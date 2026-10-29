import { dbStore } from '../src/lib/db/store';
import { validateCoupon } from '../src/lib/coupons/service';
import { calculateGstBreakdown } from '../src/lib/payments/payu';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    throw new Error(msg);
  }
  console.log(`  ✅ PASS: ${msg}`);
}

async function runSynthesiaRedesignVerification() {
  console.log('\n================================================================');
  console.log('🧪 RUNNING FLUVIA FLOW: SYNTHESIA REDESIGN VERIFICATION SUITE');
  console.log('================================================================\n');

  // 1. Zero Signup Credits Verification
  console.log('1. Testing Zero Free Signup Credits...');
  const { profile: testProfile } = dbStore.createProfile({
    email: `zero_${Date.now()}@test.fluviaflow.ai`,
    displayName: 'Zero Credits User',
    passwordPlainText: 'SecurePassword123!',
    role: 'creator',
  });
  const testUserId = testProfile.id;

  const wallet = dbStore.getCreditAccount(testUserId);
  assert(wallet.availableBalance === 0, `New user starts with strictly 0 available credits (actual: ${wallet.availableBalance})`);
  assert(wallet.reservedBalance === 0, `New user starts with strictly 0 reserved credits (actual: ${wallet.reservedBalance})`);
  assert(testProfile.firstCampaignCouponSeen === false, 'New user starts with firstCampaignCouponSeen as false');

  // Check eligibility for FIRST20 coupon modal
  const eligible = dbStore.isUserEligibleForFirstCoupon(testUserId);
  assert(eligible === true, 'New user is eligible for FIRST20 coupon modal');

  // Dismiss modal
  dbStore.markFirstCouponSeen(testUserId);
  const eligibleAfterSeen = dbStore.isUserEligibleForFirstCoupon(testUserId);
  assert(eligibleAfterSeen === false, 'User is no longer eligible after marking coupon seen');

  // 2. Coupon FIRST20 Server-side Validation
  console.log('\n2. Testing FIRST20 Server-side Validation Rules...');
  const coupons = dbStore.getCoupons();
  const first20 = coupons.find((c) => c.code === 'FIRST20');
  assert(Boolean(first20), 'FIRST20 coupon is seeded in database');
  assert(first20?.discountValue === 570, `FIRST20 discount is strictly ₹570 (actual: ${first20?.discountValue})`);
  assert(first20?.discountType === 'fixed', 'FIRST20 discount type is fixed');
  assert(first20?.isActive === true, 'FIRST20 coupon is active');

  // Valid redemption on FLUVIA MAX
  const maxValidation = await validateCoupon({
    code: 'FIRST20',
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_max',
    billingInterval: 'month',
    customerState: 'Delhi',
  });

  assert(maxValidation.valid === true, 'FIRST20 is valid on plan_max subscription');
  assert(maxValidation.pricing?.discountAmount === 570, `Discount amount is ₹570 (actual: ${maxValidation.pricing?.discountAmount})`);
  assert(maxValidation.pricing?.originalBaseAmount === 4999, `Original base is ₹4,999 (actual: ${maxValidation.pricing?.originalBaseAmount})`);
  assert(maxValidation.pricing?.discountedBaseAmount === 4429, `Discounted base is ₹4,429 (actual: ${maxValidation.pricing?.discountedBaseAmount})`);
  assert(Math.abs((maxValidation.pricing?.totalAmount || 0) - 5226.22) < 0.1, `Total amount including 18% GST is ₹5,226.22 (actual: ${maxValidation.pricing?.totalAmount})`);

  // Rejection on other plans
  const starterValidation = await validateCoupon({
    code: 'FIRST20',
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    billingInterval: 'month',
  });
  assert(starterValidation.valid === false, 'FIRST20 is rejected on plan_starter');
  assert(starterValidation.error === 'Coupon FIRST20 is valid on FLUVIA MAX only.', `Error specifies FIRST20 valid on FLUVIA MAX only: "${starterValidation.error}"`);

  const proValidation = await validateCoupon({
    code: 'FIRST20',
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_creator',
    billingInterval: 'month',
  });
  assert(proValidation.valid === false, 'FIRST20 is rejected on plan_creator');
  assert(proValidation.error === 'Coupon FIRST20 is valid on FLUVIA MAX only.', `Error specifies FIRST20 valid on FLUVIA MAX only: "${proValidation.error}"`);

  // Rejection on credit packs
  const packValidation = await validateCoupon({
    code: 'FIRST20',
    userId: testUserId,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_5000',
  });
  assert(packValidation.valid === false, 'FIRST20 is rejected on credit packs');
  assert(packValidation.error === 'Coupon FIRST20 is valid on FLUVIA MAX only.', `Error specifies FIRST20 valid on FLUVIA MAX only: "${packValidation.error}"`);

  // 3. Top-Up Pack 5,000 Credits Pricing Verification
  console.log('\n3. Testing 5,000 Credits Top-Up Pack Pricing...');
  const packs = dbStore.getCreditPacks();
  const pack5000 = packs.find((p) => p.id === 'pack_5000');
  assert(Boolean(pack5000), 'pack_5000 exists in database store');
  assert(pack5000?.priceInr === 6500, `pack_5000 base price is ₹6,500 (actual: ${pack5000?.priceInr})`);
  assert(pack5000?.creditAmount === 5000 || pack5000?.credits === 5000, 'pack_5000 grants 5,000 credits');

  const packTax = calculateGstBreakdown(6500, 'Delhi');
  assert(packTax.taxAmount === 1170, `18% GST on ₹6,500 is ₹1,170 (actual: ${packTax.taxAmount})`);
  const totalWithTax = packTax.baseAmount + packTax.taxAmount;
  assert(totalWithTax === 7670, `Total payable for pack_5000 is ₹7,670 (actual: ${totalWithTax})`);

  // Configurable packs presence
  const pack1000 = packs.find((p) => p.id === 'pack_1000');
  assert(Boolean(pack1000), 'pack_1000 exists for configurable top-ups');
  const pack2500 = packs.find((p) => p.id === 'pack_2500');
  assert(Boolean(pack2500), 'pack_2500 exists for configurable top-ups');
  const pack10000 = packs.find((p) => p.id === 'pack_10000');
  assert(Boolean(pack10000), 'pack_10000 exists for configurable top-ups');
  const pack25000 = packs.find((p) => p.id === 'pack_25000');
  assert(Boolean(pack25000), 'pack_25000 exists for configurable top-ups');

  // Backwards compatibility packs preserved
  const pack500 = packs.find((p) => p.id === 'pack_500');
  assert(Boolean(pack500), 'pack_500 preserved for test backwards compatibility');
  const pack1200 = packs.find((p) => p.id === 'pack_1200');
  assert(Boolean(pack1200), 'pack_1200 preserved for test backwards compatibility');

  console.log('\n================================================================');
  console.log('🎉 ALL SYNTHESIA REDESIGN VERIFICATION TESTS PASSED SUCCESSFULLY');
  console.log('================================================================\n');
}

runSynthesiaRedesignVerification().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
