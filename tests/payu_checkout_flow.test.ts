import { dbStore } from '../src/lib/db/store';
import {
  createPayUPaymentOrder,
  fulfillPayUPayment,
  verifyPayUResponseHash,
  generatePayURequestHash,
  sanitizePayUProductInfo,
  getPayUConfig,
} from '../src/lib/payments/payu';
import crypto from 'crypto';

async function runPayUCheckoutFlowTests() {
  console.log('================================================================');
  console.log('  FLUVIA FLOW — PAYU CHECKOUT, COUPON & GATEWAY TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testUserId = `usr_flow_${timestamp}`;
  const testWorkspaceId = `ws_flow_${timestamp}`;
  const config = getPayUConfig();

  // Seed user & initial credit balance
  const now = new Date().toISOString();
  const db = (dbStore as any).load();
  db.profiles.push({
    id: testUserId,
    email: `flow_${timestamp}@fluviaflow.ai`,
    displayName: 'Flow Tester',
    role: 'creator',
    createdAt: now,
    updatedAt: now,
  });
  db.workspaces.push({
    id: testWorkspaceId,
    ownerId: testUserId,
    name: "Flow Tester's Studio",
    createdAt: now,
    updatedAt: now,
  });
  db.creditAccounts[testUserId] = {
    userId: testUserId,
    availableBalance: 100,
    reservedBalance: 0,
    updatedAt: now,
  };
  (dbStore as any).save(db);

  // --- 1. Product Info Sanitization ---
  console.log('--- 1. PayU Product Info Sanitization ---');
  const dirtyProductInfo = '1,200 Credits Studio (1,200 Credits) (Coupon: SAVE20 applied)';
  const cleanInfo = sanitizePayUProductInfo(dirtyProductInfo);
  assert(!cleanInfo.includes(','), 'Commas stripped from productinfo');
  assert(!cleanInfo.includes('('), 'Opening brackets stripped from productinfo');
  assert(!cleanInfo.includes(')'), 'Closing brackets stripped from productinfo');
  assert(!cleanInfo.includes(':'), 'Colons stripped from productinfo');
  assert(cleanInfo.length <= 100, 'Sanitized productinfo is within 100 character PayU limit');
  assert(cleanInfo.startsWith('1200 Credits Studio'), 'Alphanumeric content preserved accurately');

  // --- 2. 100% Discount Coupon (FREE100) Zero-Payment Flow ---
  console.log('\n--- 2. 100% Discount Coupon (FREE100) Zero-Payment Flow ---');
  const initialBalance = dbStore.getCreditAccount(testUserId).availableBalance;

  const zeroOrderResult = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_1200',
    couponCode: 'FREE100',
    customerDetails: {
      name: 'Flow Tester',
      email: `flow_${timestamp}@fluviaflow.ai`,
      phone: '9876543210',
      state: 'Delhi',
    },
  });

  assert(zeroOrderResult.isZeroPayment === true, 'Order detected as 100% discount zero payment');
  assert(zeroOrderResult.order.totalAmount === 0, 'Total payable amount is INR 0.00');
  assert(zeroOrderResult.order.status === 'success', 'Zero payment order automatically settled');
  assert(zeroOrderResult.redirectUrl?.startsWith('/payment/status'), 'Redirect URL is a valid relative path');
  assert(Boolean(zeroOrderResult.order.invoiceId), 'Official zero-value GST invoice generated');
  assert(Boolean(zeroOrderResult.order.receiptId), 'Official zero-value payment receipt generated');

  const balanceAfterZero = dbStore.getCreditAccount(testUserId).availableBalance;
  assert(balanceAfterZero === initialBalance + 1200, 'Wallet credited with 1,200 credits immediately (100 -> 1300)');

  // Verify redemption recorded
  const redemptions = dbStore.getCouponRedemptions('cpn_free100');
  const userRedemption = redemptions.find((r) => r.orderId === zeroOrderResult.order.id);
  assert(Boolean(userRedemption), 'Coupon redemption recorded in database');
  assert(userRedemption?.status === 'completed', 'Coupon redemption status marked completed');

  // --- 3. Partial Discount Coupon (SAVE20) & PayU Request Hash ---
  console.log('\n--- 3. Partial Discount Coupon (SAVE20) & PayU Request Hash ---');
  const partialOrderResult = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_1200',
    couponCode: 'SAVE20',
    customerDetails: {
      name: 'Flow Tester',
      email: `flow_${timestamp}@fluviaflow.ai`,
      phone: '9876543210',
      state: 'Delhi',
    },
  });

  assert(partialOrderResult.isZeroPayment !== true, 'Partial discount order requires payment gateway');
  assert(partialOrderResult.order.baseAmount === 799.2, 'Subtotal reflects 20% discount (999 - 199.80 = 799.20)');
  assert(partialOrderResult.order.taxAmount === 143.86, '18% GST calculated on discounted base (143.86)');
  assert(partialOrderResult.order.totalAmount === 943.06, 'Total payable amount is exactly INR 943.06');

  const { payuParams } = partialOrderResult;
  assert(Boolean(payuParams), 'PayU parameters generated for checkout form submission');
  assert(payuParams.amount === '943.06', 'Amount parameter formatted with 2 decimal places');
  assert(payuParams.hash.length === 128, 'Valid 128-hex character SHA-512 Request Hash generated');
  assert(!payuParams.productinfo.includes(','), 'Productinfo parameter in payload is sanitized');
  assert(payuParams.key === config.merchantKey, 'Merchant key in payload matches configuration');

  // Verify manual recalculation of hash against sanitized productinfo
  const manualHash = generatePayURequestHash({
    key: config.merchantKey,
    txnid: partialOrderResult.order.txnid,
    amount: '943.06',
    productinfo: payuParams.productinfo,
    firstname: payuParams.firstname,
    email: payuParams.email,
    udf1: payuParams.udf1,
    udf2: payuParams.udf2,
    udf3: payuParams.udf3,
    udf4: payuParams.udf4,
    udf5: payuParams.udf5,
    salt: config.merchantSalt,
  });
  assert(payuParams.hash === manualHash, 'Form hash exactly matches official PayU SHA-512 sequence');

  // --- 4. PayU Response Reverse Hash & Callback Fulfillment ---
  console.log('\n--- 4. PayU Response Reverse Hash Verification & Fulfillment ---');
  const balanceBeforeFulfill = dbStore.getCreditAccount(testUserId).availableBalance;

  // Construct official reverse hash sequence:
  // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  const status = 'success';
  const reverseSeq = `${config.merchantSalt}|${status}||||||${payuParams.udf5}|${payuParams.udf4}|${payuParams.udf3}|${payuParams.udf2}|${payuParams.udf1}|${payuParams.email}|${payuParams.firstname}|${payuParams.productinfo}|${payuParams.amount}|${partialOrderResult.order.txnid}|${config.merchantKey}`;
  const responseHash = crypto.createHash('sha512').update(reverseSeq).digest('hex').toLowerCase();

  const fakePayUPayload = {
    key: config.merchantKey,
    txnid: partialOrderResult.order.txnid,
    amount: payuParams.amount,
    productinfo: payuParams.productinfo,
    firstname: payuParams.firstname,
    email: payuParams.email,
    status: 'success',
    hash: responseHash,
    udf1: payuParams.udf1,
    udf2: payuParams.udf2,
    udf3: payuParams.udf3,
    udf4: payuParams.udf4,
    udf5: payuParams.udf5,
    mihpayid: `mih_test_${timestamp}`,
    bank_ref_num: `BNK_REF_${timestamp}`,
    mode: 'UPI',
  };

  const isReverseHashValid = verifyPayUResponseHash(fakePayUPayload, config.merchantSalt);
  assert(isReverseHashValid === true, 'PayU response reverse hash verified successfully');

  // Fulfill order
  const fulfillment = await fulfillPayUPayment({
    txnid: partialOrderResult.order.txnid,
    payuPayload: fakePayUPayload,
  });

  assert(fulfillment.success === true, 'Order fulfillment succeeded');
  assert(fulfillment.order.status === 'success', 'Order status transitioned to success');

  const balanceAfterFulfill = dbStore.getCreditAccount(testUserId).availableBalance;
  assert(balanceAfterFulfill === balanceBeforeFulfill + 1200, 'Wallet credited with second pack (1300 -> 2500)');

  // Verify invoice & receipt
  assert(Boolean(fulfillment.invoice), 'GST tax invoice created');
  assert(fulfillment.invoice?.baseAmount === 799.2, 'Invoice subtotal reflects discounted price');
  assert(fulfillment.invoice?.totalAmount === 943.06, 'Invoice grand total matches payment');
  assert(Boolean(fulfillment.receipt), 'Payment receipt created');
  assert(fulfillment.receipt?.amountReceived === 943.06, 'Receipt amount matches payment');

  // --- 5. Security & Tampering Protections ---
  console.log('\n--- 5. Security & Tampering Protections ---');
  // Tampered hash
  const tamperedPayload = { ...fakePayUPayload, hash: 'badhash123' };
  assert(!verifyPayUResponseHash(tamperedPayload, config.merchantSalt), 'Tampered response hash strictly rejected');

  // Idempotent re-fulfillment
  const replayFulfillment = await fulfillPayUPayment({
    txnid: partialOrderResult.order.txnid,
    payuPayload: fakePayUPayload,
  });
  assert(replayFulfillment.alreadyProcessed === true, 'Replay payment identified as already processed');
  const balanceAfterReplay = dbStore.getCreditAccount(testUserId).availableBalance;
  assert(balanceAfterReplay === balanceAfterFulfill, 'Duplicate credits prevented on replay attack');

  console.log('\n================================================================');
  console.log(`  PAYU CHECKOUT FLOW RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPayUCheckoutFlowTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
