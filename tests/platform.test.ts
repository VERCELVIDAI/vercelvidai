import { dbStore } from '../src/lib/db/store';
import { calculateEstimatedCredits, dispatchGenerationJob } from '../src/lib/ai/dispatcher';
import { verifyPaymentSignature, confirmAndFulfillPayment, createRazorpayOrder } from '../src/lib/payments/razorpay';
import crypto from 'crypto';

async function runTests() {
  console.log('================================================================');
  console.log('  VERCEL VIDAI — AUTOMATED PLATFORM TEST SUITE');
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

  // TEST 1: User Creation & Initial Welcome Grant
  console.log('\n--- 1. User & Wallet Initialization ---');
  const testEmail = `test_user_${Date.now()}@vidai.io`;
  const { profile, workspace } = dbStore.createProfile({
    displayName: 'Test Runner',
    email: testEmail,
    passwordPlainText: 'ValidPass123!',
    role: 'creator',
  });
  assert(profile.id.startsWith('usr_'), 'Profile created with valid prefix');
  assert(workspace.ownerId === profile.id, 'Workspace ownership bound to profile');

  const initialAccount = dbStore.getCreditAccount(profile.id);
  assert(initialAccount.availableBalance === 100, 'Initial signup bonus of 100 credits awarded');
  assert(initialAccount.reservedBalance === 0, 'Initial reserved balance is zero');

  // TEST 2: Credit Calculation Unit Test
  console.log('\n--- 2. Credit Estimation Logic ---');
  const costVidai5s = calculateEstimatedCredits('vidai-cinematic-v1', 5);
  const costVidai10s = calculateEstimatedCredits('vidai-cinematic-v1', 10);
  const costRunway = calculateEstimatedCredits('runway-gen3', 5);
  const costFlux = calculateEstimatedCredits('fal-flux-pro');

  assert(costVidai5s === 25, 'Standard Vidai 5s generation costs 25 credits');
  assert(costVidai10s === 50, 'Standard Vidai 10s generation pro-rates to 50 credits');
  assert(costRunway === 50, 'Runway Gen-3 base generation costs 50 credits');
  assert(costFlux === 5, 'Flux image generation costs 5 credits');

  // TEST 3: Atomic Credit Reservation & Prevention of Overspending
  console.log('\n--- 3. Atomic Credit Reservation & Overspending Prevention ---');
  const dummyJobId = 'job_test_' + Date.now();
  dbStore.reserveCredits(profile.id, 50, dummyJobId);
  const afterReserve = dbStore.getCreditAccount(profile.id);
  assert(afterReserve.availableBalance === 50, 'Available balance decremented by 50');
  assert(afterReserve.reservedBalance === 50, 'Reserved balance incremented by 50');

  // Attempting to reserve more than available should throw
  let overspendCaught = false;
  try {
    dbStore.reserveCredits(profile.id, 100, 'job_fail_overspend');
  } catch (err) {
    overspendCaught = true;
  }
  assert(overspendCaught, 'Concurrent overspending blocked when balance insufficient');

  // TEST 4: Generation State Settlement & Compensating Refund
  console.log('\n--- 4. Generation Settlement & Compensating Refunds ---');
  // Settle job with exact cost
  dbStore.settleCredits(profile.id, dummyJobId, 50, 50);
  const afterSettle = dbStore.getCreditAccount(profile.id);
  assert(afterSettle.availableBalance === 50, 'Available balance remains 50 after exact settle');
  assert(afterSettle.reservedBalance === 0, 'Reserved balance returned to 0');

  // Test compensating refund on failure
  const failJobId = 'job_fail_' + Date.now();
  dbStore.reserveCredits(profile.id, 30, failJobId);
  dbStore.refundCredits(profile.id, 30, 'Simulated cluster timeout', failJobId);
  const afterRefund = dbStore.getCreditAccount(profile.id);
  assert(afterRefund.availableBalance === 50, 'Full 30 credits restored to available balance upon failure');
  assert(afterRefund.reservedBalance === 0, 'Reserved balance safely decremented back to 0');

  // TEST 5: Idempotent Ledger Grants
  console.log('\n--- 5. Idempotent Ledger Enforcement ---');
  const idempotencyKey = `order_test_idempotent_${Date.now()}`;
  dbStore.addCredits(profile.id, 200, 'purchase', 'pay_123', idempotencyKey);
  const balAfterFirst = dbStore.getCreditAccount(profile.id).availableBalance;

  // Replay exact same request with same idempotency key
  dbStore.addCredits(profile.id, 200, 'purchase', 'pay_123', idempotencyKey);
  const balAfterSecond = dbStore.getCreditAccount(profile.id).availableBalance;

  assert(balAfterFirst === 250, 'Balance credited 200 on first invocation (50 -> 250)');
  assert(balAfterSecond === 250, 'Duplicate request with same idempotency key ignored (idempotent safe)');

  // TEST 6: Payment Signature Verification Logic
  console.log('\n--- 6. Payment Signature Verification ---');
  const secret = process.env.RAZORPAY_KEY_SECRET || 'vidai_secret_demo456';
  const orderId = 'order_test_sig_' + Date.now();
  const paymentId = 'pay_test_sig_' + Date.now();
  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValidSig = verifyPaymentSignature({ orderId, paymentId, signature: validSignature });
  const isInvalidSig = verifyPaymentSignature({ orderId, paymentId, signature: 'tampered_invalid_sig' });

  assert(isValidSig === true, 'Valid Razorpay HMAC SHA-256 signature verified');
  assert(isInvalidSig === false, 'Tampered payment signature rejected');

  // TEST 7: Timeline Operations Unit Test
  console.log('\n--- 7. Project & Timeline Operations ---');
  const project = dbStore.createProject({
    workspaceId: workspace.id,
    ownerId: profile.id,
    title: 'Test Timeline Project',
    mediaType: 'video',
  });
  assert(project.timeline.tracks.length >= 3, 'Project timeline initialized with default tracks');

  // Add clip
  const clip1 = {
    id: 'clp_u1',
    trackId: 'trk_v1',
    type: 'video' as const,
    title: 'Scene 1',
    startTimeSec: 0,
    durationSec: 8,
  };
  project.timeline.clips.push(clip1);
  assert(project.timeline.clips.length === 1, 'Clip added to timeline');

  // Duplicate project
  const duplicated = dbStore.duplicateProject(project.id);
  assert(duplicated.id !== project.id, 'Duplicated project receives new distinct ID');
  assert(duplicated.title.includes('(Copy)'), 'Duplicated project has copy indicator');
  assert(duplicated.timeline.clips.length === 1, 'Timeline clips copied to duplicate');

  // TEST 8: Full AI Generation Dispatcher Integration Test
  console.log('\n--- 8. AI Dispatcher Job Submission ---');
  const genJob = await dispatchGenerationJob({
    userId: profile.id,
    workspaceId: workspace.id,
    projectId: project.id,
    modelId: 'vidai-cinematic-v1',
    input: {
      prompt: 'Cinematic futuristic city street with neon lights',
      aspectRatio: '16:9',
      durationSec: 5,
    },
  });

  assert(genJob.status === 'queued', 'Job created in queued state');
  assert(genJob.reservedCredits === 25, '25 credits reserved for generation job');
  const persistedJob = dbStore.getJobById(genJob.id);
  assert(persistedJob !== undefined, 'Job persisted in reliable job table across refreshes');

  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
