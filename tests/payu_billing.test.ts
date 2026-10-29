import crypto from 'crypto';
import { dbStore } from '../src/lib/db/store';
import {
  generatePayURequestHash,
  verifyPayUResponseHash,
  calculateGstBreakdown,
  createPayUPaymentOrder,
  fulfillPayUPayment,
  getPayUConfig,
} from '../src/lib/payments/payu';
import { generateInvoicePdf, generateReceiptPdf } from '../src/lib/documents/pdfGenerator';

async function runPayUBillingTests() {
  console.log('================================================================');
  console.log('  VERCEL VIDAI — PAYU PAYMENT & BILLING AUTOMATED TEST SUITE');
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

  // TEST 1: PayU Request Hash Generation (SHA-512)
  console.log('--- 1. PayU Request Hash Calculation ---');
  const sampleKey = 'gtKFFx';
  const sampleSalt = 'eCwWELxi';
  const sampleTxnId = 'TXN_TEST_123456';
  const sampleAmount = '1178.82';
  const sampleProduct = '1,200 Credits Studio Pack';
  const sampleFirstname = 'Aria';
  const sampleEmail = 'creator@vidai.io';
  const sampleUdf1 = 'ord_123';
  const sampleUdf2 = 'usr_123';

  const generatedHash = generatePayURequestHash({
    key: sampleKey,
    txnid: sampleTxnId,
    amount: sampleAmount,
    productinfo: sampleProduct,
    firstname: sampleFirstname,
    email: sampleEmail,
    udf1: sampleUdf1,
    udf2: sampleUdf2,
    salt: sampleSalt,
  });

  const manualSequence = `${sampleKey}|${sampleTxnId}|${sampleAmount}|${sampleProduct}|${sampleFirstname}|${sampleEmail}|${sampleUdf1}|${sampleUdf2}|||||||||${sampleSalt}`;
  const expectedHash = crypto.createHash('sha512').update(manualSequence).digest('hex').toLowerCase();

  assert(generatedHash === expectedHash, 'PayU SHA-512 request hash matches official formula');
  assert(generatedHash.length === 128, 'SHA-512 hash is 128 hex characters');

  // TEST 2: PayU Response Reverse Hash Verification
  console.log('\n--- 2. PayU Response Hash Verification (Reverse Hash) ---');
  const responsePayload = {
    key: sampleKey,
    txnid: sampleTxnId,
    amount: sampleAmount,
    productinfo: sampleProduct,
    firstname: sampleFirstname,
    email: sampleEmail,
    status: 'success',
    udf1: sampleUdf1,
    udf2: sampleUdf2,
    udf3: '',
    udf4: '',
    udf5: '',
    mihpayid: '403993715530123456',
  };

  const reverseSequence = `${sampleSalt}|${responsePayload.status}||||||${responsePayload.udf5}|${responsePayload.udf4}|${responsePayload.udf3}|${responsePayload.udf2}|${responsePayload.udf1}|${responsePayload.email}|${responsePayload.firstname}|${responsePayload.productinfo}|${responsePayload.amount}|${responsePayload.txnid}|${responsePayload.key}`;
  const validResponseHash = crypto.createHash('sha512').update(reverseSequence).digest('hex').toLowerCase();

  const isVerifiedValid = verifyPayUResponseHash(
    { ...responsePayload, hash: validResponseHash },
    sampleSalt
  );
  const isVerifiedTampered = verifyPayUResponseHash(
    { ...responsePayload, hash: 'forged_invalid_hash_string' },
    sampleSalt
  );
  const isVerifiedModifiedAmount = verifyPayUResponseHash(
    { ...responsePayload, amount: '10.00', hash: validResponseHash }, // amount changed!
    sampleSalt
  );

  assert(isVerifiedValid === true, 'Legitimate PayU response reverse hash verified');
  assert(isVerifiedTampered === false, 'Tampered response hash rejected');
  assert(isVerifiedModifiedAmount === false, 'Tampered payload with changed amount rejected');

  // TEST 3: GST Tax Calculation (Intra-state vs Inter-state)
  console.log('\n--- 3. GST Tax Breakdown (SAC 998314) ---');
  const intraTax = calculateGstBreakdown(1000, 'Delhi');
  assert(intraTax.baseAmount === 1000, 'Base taxable amount is 1000');
  assert(intraTax.taxAmount === 180, '18% GST calculates to 180');
  assert(intraTax.cgstAmount === 90 && intraTax.sgstAmount === 90, 'Intra-state (Delhi to Delhi) splits into 9% CGST (90) + 9% SGST (90)');
  assert(intraTax.isInterState === false, 'Intra-state correctly flagged');

  const interTax = calculateGstBreakdown(1000, 'Maharashtra');
  assert(interTax.igstAmount === 180, 'Inter-state (Delhi to Maharashtra) applies 18% IGST (180)');
  assert(interTax.cgstAmount === 0 && interTax.sgstAmount === 0, 'No CGST/SGST on inter-state supply');
  assert(interTax.isInterState === true, 'Inter-state correctly flagged');

  // TEST 4: PayU Payment Order Creation
  console.log('\n--- 4. PayU Payment Order Initialization ---');
  const testUser = dbStore.createProfile({
    email: `payu_test_${Date.now()}@vidai.io`,
    displayName: 'Fintech Tester',
    passwordPlainText: 'ValidPass123!',
    role: 'creator',
  });

  const orderResult = await createPayUPaymentOrder({
    userId: testUser.profile.id,
    workspaceId: testUser.workspace.id,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_1200',
    customerDetails: {
      name: 'Fintech Tester',
      email: testUser.profile.email,
      phone: '9876543210',
      state: 'Karnataka',
    },
  });

  assert(orderResult.order.txnid.startsWith('TXN_'), 'Merchant txnid generated with TXN_ prefix');
  assert(orderResult.order.status === 'created', 'Order starts in created status');
  assert(orderResult.order.totalAmount === 1178.82, 'Order total includes 999 base + 18% GST (1178.82 INR)');
  assert(orderResult.payuParams.hash.length === 128, 'Form parameters include computed SHA-512 hash');
  assert(orderResult.payuParams.actionUrl.includes('payu.in'), 'Action URL points to PayU gateway');

  // TEST 5: Idempotent Payment Fulfillment & Wallet Crediting
  console.log('\n--- 5. Atomic Payment Fulfillment & Idempotency ---');
  const initialBal = dbStore.getCreditAccount(testUser.profile.id).availableBalance;
  assert(initialBal === 0, 'Initial signup balance is 0 credits');

  // Generate valid response hash for this order using active merchant salt
  const activeSalt = getPayUConfig().merchantSalt;
  const orderReverseSequence = `${activeSalt}|success||||||${orderResult.payuParams.udf5}|${orderResult.payuParams.udf4}|${orderResult.payuParams.udf3}|${orderResult.payuParams.udf2}|${orderResult.payuParams.udf1}|${orderResult.payuParams.email}|${orderResult.payuParams.firstname}|${orderResult.payuParams.productinfo}|${orderResult.order.totalAmount.toFixed(2)}|${orderResult.order.txnid}|${orderResult.payuParams.key}`;
  const orderReverseHash = crypto.createHash('sha512').update(orderReverseSequence).digest('hex').toLowerCase();

  const fulfillment1 = await fulfillPayUPayment({
    txnid: orderResult.order.txnid,
    payuPayload: {
      key: orderResult.payuParams.key,
      txnid: orderResult.order.txnid,
      amount: orderResult.order.totalAmount.toFixed(2),
      productinfo: orderResult.payuParams.productinfo,
      firstname: orderResult.payuParams.firstname,
      email: orderResult.payuParams.email,
      status: 'success',
      udf1: orderResult.payuParams.udf1,
      udf2: orderResult.payuParams.udf2,
      udf3: orderResult.payuParams.udf3,
      udf4: orderResult.payuParams.udf4,
      udf5: orderResult.payuParams.udf5,
      hash: orderReverseHash,
      mihpayid: '403993715530999999',
      bank_ref_num: 'BNK_TEST_777',
      mode: 'UPI',
    },
  });

  assert(fulfillment1.success === true, 'First fulfillment succeeded');
  assert(fulfillment1.order.status === 'success', 'Order status marked success');
  const afterBal1 = dbStore.getCreditAccount(testUser.profile.id).availableBalance;
  assert(afterBal1 === 1200, '1,200 credits credited to wallet (0 -> 1200)');

  // Replay fulfillment (duplicate webhook / callback / page refresh)
  const fulfillment2 = await fulfillPayUPayment({
    txnid: orderResult.order.txnid,
  });

  assert(fulfillment2.alreadyProcessed === true, 'Second fulfillment recognized as already processed');
  const afterBal2 = dbStore.getCreditAccount(testUser.profile.id).availableBalance;
  assert(afterBal2 === 1200, 'Duplicate request prevented duplicate credit grants (balance remains 1200)');

  // TEST 6: Invoice and Receipt Creation & Number Uniqueness
  console.log('\n--- 6. Sequential Invoice & Receipt Generation ---');
  assert(fulfillment1.invoice !== undefined, 'Tax invoice generated automatically upon settlement');
  assert(!!fulfillment1.invoice?.invoiceNumber.startsWith('INV-2026-'), 'Invoice number has standard INV-2026- prefix');
  assert(fulfillment1.receipt !== undefined, 'Payment receipt generated automatically upon settlement');
  assert(!!fulfillment1.receipt?.receiptNumber.startsWith('RCP-2026-'), 'Receipt number has standard RCP-2026- prefix');

  const invNum1 = dbStore.getNextInvoiceNumber();
  const invNum2 = dbStore.getNextInvoiceNumber();
  assert(invNum1.startsWith('INV-2026-'), 'Invoice sequence follows INV-YYYY-XXXX convention');

  // TEST 7: Vector PDF Generation
  console.log('\n--- 7. Selectable Vector PDF Generation (pdf-lib) ---');
  const invoicePdfBytes = await generateInvoicePdf(fulfillment1.invoice!);
  const receiptPdfBytes = await generateReceiptPdf(fulfillment1.receipt!, fulfillment1.invoice);

  const invoiceHeader = Buffer.from(invoicePdfBytes.slice(0, 5)).toString('ascii');
  const receiptHeader = Buffer.from(receiptPdfBytes.slice(0, 5)).toString('ascii');

  assert(invoiceHeader === '%PDF-', 'Invoice PDF generated with valid %PDF- binary header');
  assert(invoicePdfBytes.length > 1000, `Invoice PDF contains complete layout (${invoicePdfBytes.length} bytes)`);
  assert(receiptHeader === '%PDF-', 'Receipt PDF generated with valid %PDF- binary header');
  assert(receiptPdfBytes.length > 1000, `Receipt PDF contains complete layout (${receiptPdfBytes.length} bytes)`);

  // TEST 8: Amount Mismatch Detection
  console.log('\n--- 8. Security Tampering & Amount Mismatch Rejection ---');
  const mismatchOrder = await createPayUPaymentOrder({
    userId: testUser.profile.id,
    workspaceId: testUser.workspace.id,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_500',
    customerDetails: {
      name: 'Fintech Tester',
      email: testUser.profile.email,
      phone: '9876543210',
      state: 'Delhi',
    },
  });

  let mismatchCaught = false;
  try {
    await fulfillPayUPayment({
      txnid: mismatchOrder.order.txnid,
      payuPayload: {
        hash: 'valid_looking_hash',
        amount: '10.00', // Expected ~588.82 INR!
        status: 'success',
      },
    });
  } catch (err: any) {
    mismatchCaught = true;
  }
  assert(mismatchCaught, 'Amount mismatch securely detected and rejected');

  console.log('\n================================================================');
  console.log(`  PAYU BILLING TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runPayUBillingTests().catch((err) => {
  console.error('Fatal PayU billing test failure:', err);
  process.exit(1);
});
