import fs from 'fs';
import path from 'path';

// Load .env.local into process.env for standalone test runner
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {}

import crypto from 'crypto';
import {
  getPayUConfig,
  validatePayUEnvironment,
  createPayUPaymentOrder,
  generatePayURequestHash,
  verifyPayUResponseHash,
  fulfillPayUPayment,
  calculateGstBreakdown,
} from '../src/lib/payments/payu';
import {
  checkPaymentRateLimit,
  resetPaymentRateLimit,
  logPaymentEvent,
} from '../src/lib/payments/rateLimiter';
import { dbStore } from '../src/lib/db/store';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

async function runRateLimitAndProductionTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING PAYU RATE LIMITING, IDEMPOTENCY & PRODUCTION TESTS');
  console.log('================================================================\n');

  // 1. Test Environment Validation
  console.log('1. Testing PAYU_ENV Validation & Safety Guards...');
  assert('validatePayUEnvironment normalizes "production" to "production"', validatePayUEnvironment('production') === 'production');
  assert('validatePayUEnvironment normalizes "prod" to "production"', validatePayUEnvironment('prod') === 'production');
  assert('validatePayUEnvironment normalizes "test" to "test"', validatePayUEnvironment('test') === 'test');
  assert('validatePayUEnvironment normalizes "sandbox" to "test"', validatePayUEnvironment('sandbox') === 'test');
  
  let invalidThrew = false;
  try {
    validatePayUEnvironment('invalid_env_mode');
  } catch (err: any) {
    invalidThrew = err.message.includes('Only "production" or "test" are accepted');
  }
  assert('validatePayUEnvironment rejects invalid environments with clear error', invalidThrew);

  // 2. Production Credentials & Mismatch Protection
  console.log('\n2. Testing Production Credentials & Endpoint Guardrails...');
  const currentConfig = getPayUConfig();
  assert('Production paymentUrl is https://secure.payu.in/_payment', currentConfig.paymentUrl === 'https://secure.payu.in/_payment');
  assert('Production postServiceUrl is https://info.payu.in/merchant/postservice?form=2', currentConfig.postServiceUrl === 'https://info.payu.in/merchant/postservice?form=2');
  assert('Production merchant key is configured', Boolean(currentConfig.merchantKey));
  assert('Production salt is configured', Boolean(currentConfig.merchantSalt));

  // Test missing credentials protection in production mode (Phase 3 Requirement 8)
  const savedKey = process.env.PAYU_MERCHANT_KEY;
  const savedKeyAlias = process.env.PAYU_KEY;
  delete process.env.PAYU_MERCHANT_KEY;
  delete process.env.PAYU_KEY;

  let missingCredsThrew = false;
  try {
    getPayUConfig();
  } catch (err: any) {
    missingCredsThrew = err.message.includes('PayU production credentials missing');
  }
  assert('getPayUConfig fails safely when production credentials are missing (no fabrication)', missingCredsThrew);

  // Restore credentials
  process.env.PAYU_MERCHANT_KEY = savedKey;
  process.env.PAYU_KEY = savedKeyAlias;

  // Test mismatch protection: test key gtKFFx on production endpoints must throw
  process.env.PAYU_MERCHANT_KEY = 'gtKFFx';
  let mismatchThrew = false;
  try {
    getPayUConfig();
  } catch (err: any) {
    mismatchThrew = err.message.includes('Test merchant key "gtKFFx" cannot be used with production endpoints');
  }
  assert('Prevents test merchant key gtKFFx from being mixed with production endpoints', mismatchThrew);

  // Restore genuine credentials
  process.env.PAYU_MERCHANT_KEY = savedKey;

  // 3. Rate Limiter & Sliding Window / Cooldown Tests
  console.log('\n3. Testing In-Memory Rate Limiter & 429 Retry-After Protection...');
  const testClientId = `test_client_${Date.now()}`;
  resetPaymentRateLimit(testClientId);

  // First request must succeed
  const req1 = checkPaymentRateLimit(testClientId, { minIntervalMs: 500, maxRequests: 3 });
  assert('Initial checkout initiation is allowed', req1.allowed === true);

  // Rapid burst request (under minIntervalMs) must be blocked
  const reqRapid = checkPaymentRateLimit(testClientId, { minIntervalMs: 500, maxRequests: 3 });
  assert('Rapid burst request (< minInterval) is blocked', reqRapid.allowed === false);
  assert('Rapid burst provides retryAfter countdown', reqRapid.retryAfter >= 1);
  assert('Rapid burst provides user-friendly error message', Boolean(reqRapid.errorMessage));

  // Wait for minInterval
  await new Promise((r) => setTimeout(r, 550));

  // Second request allowed
  const req2 = checkPaymentRateLimit(testClientId, { minIntervalMs: 500, maxRequests: 3 });
  assert('Second request after interval delay is allowed', req2.allowed === true);

  await new Promise((r) => setTimeout(r, 550));

  // Third request allowed
  const req3 = checkPaymentRateLimit(testClientId, { minIntervalMs: 500, maxRequests: 3 });
  assert('Third request within window is allowed', req3.allowed === true);

  await new Promise((r) => setTimeout(r, 550));

  // Fourth request exceeds maxRequests within window
  const reqOverLimit = checkPaymentRateLimit(testClientId, { minIntervalMs: 500, maxRequests: 3, windowMs: 10_000 });
  assert('Exceeding max requests in sliding window triggers rate limit', reqOverLimit.allowed === false);
  assert('Rate limit error contains PayU 60s cooldown message', reqOverLimit.errorMessage?.includes('Too many Requests') ?? false);
  assert('Rate limit retryAfter is positive', reqOverLimit.retryAfter > 0);

  // 4. Server-Side Checkout Idempotency
  console.log('\n4. Testing Server-Side Checkout Idempotency...');
  const users = dbStore.getAllProfiles();
  const testUser = users[0];
  const testWorkspace = dbStore.getUserWorkspaces(testUser.id)[0] || dbStore.ensureUserWorkspace(testUser.id, testUser.displayName);

  const orderParams = {
    userId: testUser.id,
    workspaceId: testWorkspace.id,
    paymentType: 'credit_pack' as const,
    itemPlanOrPackId: 'pack_1200',
    customerDetails: {
      name: 'Idempotent Tester',
      email: 'tester@fluviaflow.online',
      phone: '9876543210',
      state: 'Delhi',
    },
    forceNew: true, // Generate a fresh order for first attempt
  };

  const firstInit = await createPayUPaymentOrder(orderParams);
  const firstTxnid = firstInit.order.txnid;
  assert('First order generated a unique txnid', Boolean(firstTxnid));

  // Immediate second call for same cart without forceNew must reuse the pending order
  const duplicateInit = await createPayUPaymentOrder({
    ...orderParams,
    forceNew: false,
  });
  assert('Duplicate rapid initiation reuses the existing pending order', duplicateInit.order.txnid === firstTxnid);
  assert('Reused order has matching payload hash', duplicateInit.payuParams.hash === firstInit.payuParams.hash);

  // 5. Duplicate Callbacks & Idempotent Settlement Protection
  console.log('\n5. Testing Duplicate Callback Idempotency...');
  const txnidForCallback = `TXN_TEST_CB_${Date.now()}`;
  const config = getPayUConfig();

  // Create an order specifically for callback testing
  const cbOrder = dbStore.createPayUOrder({
    txnid: txnidForCallback,
    userId: testUser.id,
    workspaceId: testWorkspace.id,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_500',
    productInfo: '500 Credits Boost',
    currency: 'INR',
    baseAmount: 499,
    taxAmount: 89.82,
    totalAmount: 588.82,
    amountPaise: 58882,
    customerDetails: {
      name: 'Callback Tester',
      email: 'cb_test@fluviaflow.online',
      phone: '9999999999',
    },
    status: 'created',
    taxBreakdown: calculateGstBreakdown(499, 'Delhi'),
    idempotencyKey: `cb_test_${txnidForCallback}`,
  });

  const accountBefore = dbStore.getCreditAccount(testUser.id);
  const balanceBefore = accountBefore?.availableBalance ?? 0;

  // First fulfillment
  const firstFulfill = await fulfillPayUPayment({
    txnid: txnidForCallback,
    skipHashCheckIfAlreadyVerified: true,
  });
  assert('First payment fulfillment marks order as success', firstFulfill.order.status === 'success');
  assert('Credits granted on first settlement', (dbStore.getCreditAccount(testUser.id)?.availableBalance ?? 0) === balanceBefore + 500);

  // Second duplicate fulfillment call (simulating PayU network re-posting the webhook)
  const duplicateFulfill = await fulfillPayUPayment({
    txnid: txnidForCallback,
    skipHashCheckIfAlreadyVerified: true,
  });
  assert('Duplicate callback detected alreadyProcessed', duplicateFulfill.alreadyProcessed === true);
  assert('Credits NOT added twice on duplicate callback', (dbStore.getCreditAccount(testUser.id)?.availableBalance ?? 0) === balanceBefore + 500);

  // 6. Safe Audit Logging Verification
  console.log('\n6. Testing Secret-Safe Logging...');
  let loggedOutput = '';
  const originalInfo = console.info;
  console.info = (...args: any[]) => {
    loggedOutput += args.join(' ');
  };

  logPaymentEvent({
    requestId: 'test_req_safe',
    category: 'checkout_init',
    statusCode: 201,
    txnid: 'TXN_SECRET_1234567890_MASKED',
    userId: 'usr_safe_1',
    paymentType: 'subscription',
  });

  console.info = originalInfo;

  assert('Log entry does NOT contain merchant salt', !loggedOutput.includes(config.merchantSalt));
  assert('Log entry masks txnid', loggedOutput.includes('TXN_SECRET...'));
  assert('Log entry contains category checkout_init', loggedOutput.includes('checkout_init'));

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runRateLimitAndProductionTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
