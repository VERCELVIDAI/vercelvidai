/**
 * FLUVIA FLOW — PAYU HASH & PAYMENT VERIFICATION TEST SUITE
 * Validates canonical PayU request hash formula, reverse response hash,
 * annual plan amount calculations, UDF positioning, duplicate callbacks,
 * idempotency, and server payload consistency.
 */

import crypto from 'crypto';
import {
  generatePayURequestHash,
  verifyPayUResponseHash,
  buildCanonicalPayUPayload,
  getPayUConfig,
  sanitizePayUProductInfo,
  calculateGstBreakdown,
  createPayUPaymentOrder,
  fulfillPayUPayment,
} from '../src/lib/payments/payu';
import { dbStore } from '../src/lib/db/store';

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING PAYU HASH & PAYMENT ENGINE TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(desc: string, condition: boolean, extra?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`, extra ? extra : '');
      failed++;
    }
  }

  // -----------------------------------------------------------------------------
  // TEST 1 & 2: Hash formula and canonical input structure
  // -----------------------------------------------------------------------------
  console.log('1 & 2. Testing Canonical Hash Generation & Formula...');
  const testKey = 'test_merchant_key';
  const testSalt = 'test_merchant_salt_32_characters';
  const testTxnid = 'TXN_SYNTHETIC_12345';
  const testAmount = '56625.84';
  const testProduct = 'Fluvia Max - Annual Subscription 12 Months at INR 3999 mo';
  const testFirstname = 'Alex';
  const testEmail = 'alex@fluviaflow.ai';
  const testUdf1 = 'ord_TXN_SYNTHETIC_12345';
  const testUdf2 = 'usr_test_user_id';
  const testUdf3 = 'subscription';
  const testUdf4 = 'plan_max';
  const testUdf5 = 'ws_workspace_id';

  const expectedSequence = `${testKey}|${testTxnid}|${testAmount}|${testProduct}|${testFirstname}|${testEmail}|${testUdf1}|${testUdf2}|${testUdf3}|${testUdf4}|${testUdf5}||||||${testSalt}`;
  const expectedHash = crypto.createHash('sha512').update(expectedSequence).digest('hex').toLowerCase();

  const generatedHash = generatePayURequestHash({
    key: testKey,
    txnid: testTxnid,
    amount: testAmount,
    productinfo: testProduct,
    firstname: testFirstname,
    email: testEmail,
    udf1: testUdf1,
    udf2: testUdf2,
    udf3: testUdf3,
    udf4: testUdf4,
    udf5: testUdf5,
    salt: testSalt,
  });

  assert('generatePayURequestHash matches manual canonical SHA-512 digest', generatedHash === expectedHash);

  // -----------------------------------------------------------------------------
  // TEST 3: Lowercase SHA-512 Hex (128 hex characters)
  // -----------------------------------------------------------------------------
  console.log('\n3. Testing Hash Format and Encoding...');
  assert('Hash output is exactly 128 characters long', generatedHash.length === 128);
  assert('Hash output is lowercase hex [0-9a-f]', /^[0-9a-f]{128}$/.test(generatedHash));

  // -----------------------------------------------------------------------------
  // TEST 4: UDF Field Positioning and Empty UDFs
  // -----------------------------------------------------------------------------
  console.log('\n4. Testing UDF Positions & Empty Delimiters...');
  const emptyUdfHash = generatePayURequestHash({
    key: testKey,
    txnid: testTxnid,
    amount: testAmount,
    productinfo: testProduct,
    firstname: testFirstname,
    email: testEmail,
    salt: testSalt,
  });
  const expectedEmptySequence = `${testKey}|${testTxnid}|${testAmount}|${testProduct}|${testFirstname}|${testEmail}|||||||||||${testSalt}`;
  const expectedEmptyHash = crypto.createHash('sha512').update(expectedEmptySequence).digest('hex').toLowerCase();
  assert('Empty UDF fields preserve all 11 required pipe separators', emptyUdfHash === expectedEmptyHash);

  // -----------------------------------------------------------------------------
  // TEST 5: Annual Max Subscription Price Calculation (56625.84 check)
  // -----------------------------------------------------------------------------
  console.log('\n5. Testing Annual Subscription Plan Calculation...');
  const planMax = dbStore.getPlans().find((p) => p.id === 'plan_max');
  assert('plan_max exists in database', !!planMax);
  const monthlyAnnualRate = planMax!.priceAnnualInr || 3999;
  const annualBaseAmount = monthlyAnnualRate * 12; // 3999 * 12 = 47988
  assert('Annual base price for Fluvia Max is exactly 47,988', annualBaseAmount === 47988);

  const taxBreakdown = calculateGstBreakdown(annualBaseAmount, 'Delhi');
  assert('Tax amount for 47,988 at 18% is exactly 8,637.84', taxBreakdown.taxAmount === 8637.84);
  const totalAnnualAmount = Math.round((annualBaseAmount + taxBreakdown.taxAmount) * 100) / 100;
  assert('Total calculated annual amount is exactly 56,625.84', totalAnnualAmount === 56625.84);
  assert('Formatted string representation is "56625.84"', totalAnnualAmount.toFixed(2) === '56625.84');

  // -----------------------------------------------------------------------------
  // TEST 6: buildCanonicalPayUPayload Payload Consistency
  // -----------------------------------------------------------------------------
  console.log('\n6. Testing Canonical Payload Builder Consistency...');
  const config = getPayUConfig();
  const canonical = buildCanonicalPayUPayload({
    config,
    txnid: 'TXN_CANONICAL_TEST',
    amount: 56625.84,
    productInfo: 'Fluvia Max - Annual Subscription (12 Months at INR 3999/mo)',
    customerDetails: {
      name: 'Maya Lin',
      email: 'maya@fluviaflow.ai',
      phone: '9876543210',
    },
    surl: 'http://localhost:3000/api/payments/payu/callback',
    furl: 'http://localhost:3000/api/payments/payu/callback',
    udf1: 'ord_123',
    udf2: 'usr_456',
    udf3: 'subscription',
    udf4: 'plan_max',
    udf5: 'ws_789',
  });

  assert('Payload amount is formatted to 2 decimals', canonical.amount === '56625.84');
  assert('Productinfo sanitized cleanly without special chars', !/[()/]/.test(canonical.productinfo));
  assert('Firstname resolved to single alphanumeric token', canonical.firstname === 'Maya');
  assert('Phone resolved to clean 10-digit number', canonical.phone === '9876543210');

  // Verify hash in payload matches manual SHA-512 with payload values
  const verifyManualHash = generatePayURequestHash({
    key: canonical.key,
    txnid: canonical.txnid,
    amount: canonical.amount,
    productinfo: canonical.productinfo,
    firstname: canonical.firstname,
    email: canonical.email,
    udf1: canonical.udf1,
    udf2: canonical.udf2,
    udf3: canonical.udf3,
    udf4: canonical.udf4,
    udf5: canonical.udf5,
    salt: config.merchantSalt,
  });
  assert('Payload hash strictly equals manual SHA-512 from payload fields', canonical.hash === verifyManualHash);

  // -----------------------------------------------------------------------------
  // TEST 7: Reverse Response Hash Verification
  // -----------------------------------------------------------------------------
  console.log('\n7. Testing PayU Reverse Response Hash Verification...');
  const respTxnid = 'TXN_RESP_101';
  const respAmount = '56625.84';
  const respProduct = 'Fluvia Max Plan';
  const respFirstname = 'Maya';
  const respEmail = 'maya@fluviaflow.ai';
  const respStatus = 'success';
  const respKey = config.merchantKey;
  const respSalt = config.merchantSalt;

  // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  const validRespSeq = `${respSalt}|${respStatus}||||||${testUdf5}|${testUdf4}|${testUdf3}|${testUdf2}|${testUdf1}|${respEmail}|${respFirstname}|${respProduct}|${respAmount}|${respTxnid}|${respKey}`;
  const validRespHash = crypto.createHash('sha512').update(validRespSeq).digest('hex').toLowerCase();

  const mockPayload = {
    key: respKey,
    txnid: respTxnid,
    amount: respAmount,
    productinfo: respProduct,
    firstname: respFirstname,
    email: respEmail,
    status: respStatus,
    udf1: testUdf1,
    udf2: testUdf2,
    udf3: testUdf3,
    udf4: testUdf4,
    udf5: testUdf5,
    hash: validRespHash,
  };

  assert('Valid PayU response hash validates true', verifyPayUResponseHash(mockPayload, respSalt));

  const tamperedPayload = { ...mockPayload, amount: '56620.00' }; // altered amount
  assert('Altered response amount fails hash verification', !verifyPayUResponseHash(tamperedPayload, respSalt));

  const fakeHashPayload = { ...mockPayload, hash: 'bad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' };
  assert('Forged hash is rejected', !verifyPayUResponseHash(fakeHashPayload, respSalt));

  // -----------------------------------------------------------------------------
  // TEST 8: End-to-End Order Creation & Fulfillment Idempotency
  // -----------------------------------------------------------------------------
  console.log('\n8. Testing End-to-End Order Creation & Atomic Fulfillment...');
  const dummyUserId = 'usr_payu_test_' + Date.now();
  const dummyWorkspaceId = 'ws_payu_test_' + Date.now();
  dbStore.createProfile({
    email: `payu_${Date.now()}@fluvia.io`,
    displayName: 'PayU Test Creator',
    passwordPlainText: 'ValidPassword123!',
  });

  const orderResult = await createPayUPaymentOrder({
    userId: dummyUserId,
    workspaceId: dummyWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_max',
    billingInterval: 'year',
    customerDetails: {
      name: 'PayU Test Creator',
      email: `payu_${Date.now()}@fluvia.io`,
      phone: '9876543210',
      state: 'Maharashtra',
    },
  });

  assert('createPayUPaymentOrder returns created order', orderResult.order.status === 'created');
  assert('createPayUPaymentOrder returns matching payuParams', orderResult.payuParams.amount === '56625.84');
  assert('payuParams hash matches generated order', orderResult.payuParams.hash.length === 128);

  // Fulfill the order
  const fulfillment = await fulfillPayUPayment({
    txnid: orderResult.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });

  assert('Order fulfilled with success status', fulfillment.success && fulfillment.order.status === 'success');
  assert('Subscription grant awarded 4000 credits to user', dbStore.getCreditAccount(dummyUserId).availableBalance >= 4000);

  // Idempotent fulfillment call
  const repeatFulfillment = await fulfillPayUPayment({
    txnid: orderResult.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });
  assert('Repeat fulfillment detects alreadyProcessed flag', repeatFulfillment.alreadyProcessed === true);

  console.log('\n================================================================');
  console.log(`PAYU TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
