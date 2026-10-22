import crypto from 'crypto';
import { dbStore } from '../src/lib/db/store';
import { validateCoupon } from '../src/lib/coupons/service';
import {
  createPayUPaymentOrder,
  fulfillPayUPayment,
  calculateGstBreakdown,
  generatePayURequestHash,
  getPayUConfig,
} from '../src/lib/payments/payu';
import { generateInvoicePdf, generateReceiptPdf } from '../src/lib/documents/pdfGenerator';

async function runCouponSystemTestSuite() {
  console.log('================================================================');
  console.log('  FLUVIA FLOW — DISCOUNT COUPON SYSTEM AUTOMATED TEST SUITE');
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

  const testUserId = `usr_test_coupon_${Date.now()}`;
  const testWorkspaceId = `ws_test_coupon_${Date.now()}`;
  const customerDetails = {
    name: 'Aria Vance',
    email: 'aria.vance@fluviaflow.ai',
    phone: '9876543210',
    state: 'Delhi',
    address: '12 Creative Studio Row, Connaught Place',
  };

  // ---------------------------------------------------------------
  // 1. VALID PERCENTAGE COUPON
  // ---------------------------------------------------------------
  console.log('--- 1. Valid Percentage Coupon ---');
  // Plan starter: ₹999 base price. SAVE10: 10% off -> ₹99.90 discount. Base = ₹899.10
  const cpnPct = dbStore.createCoupon({
    code: `TESTPCT10_${Date.now()}`,
    description: '10% discount test',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
  });

  const res1 = validateCoupon({
    code: cpnPct.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerState: 'Delhi',
  });

  assert(res1.valid === true, 'Valid percentage coupon accepted');
  assert(res1.pricing?.originalBaseAmount === 999, 'Original base amount is INR 999');
  assert(res1.pricing?.discountAmount === 99.9, '10% discount calculates to INR 99.90');
  assert(res1.pricing?.discountedBaseAmount === 899.1, 'Discounted base amount is INR 899.10');
  assert(res1.pricing?.totalAmount === Math.round((899.1 + res1.pricing!.taxAmount) * 100) / 100, 'Total includes GST on discounted base');

  // ---------------------------------------------------------------
  // 2. VALID FIXED-VALUE COUPON
  // ---------------------------------------------------------------
  console.log('\n--- 2. Valid Fixed-Value Coupon ---');
  // Plan starter: ₹999 base price. FIXED200: ₹200 off -> base = ₹799
  const cpnFixed = dbStore.createCoupon({
    code: `FIXED200_${Date.now()}`,
    description: 'Flat INR 200 off',
    discountType: 'fixed',
    discountValue: 200,
    isActive: true,
  });

  const res2 = validateCoupon({
    code: cpnFixed.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerState: 'Delhi',
  });

  assert(res2.valid === true, 'Valid fixed discount coupon accepted');
  assert(res2.pricing?.discountAmount === 200, 'Discount amount is exactly INR 200');
  assert(res2.pricing?.discountedBaseAmount === 799, 'Discounted base price is INR 799 (999 - 200)');

  // ---------------------------------------------------------------
  // 3. PERCENTAGE COUPON WITH MAXIMUM DISCOUNT CAP
  // ---------------------------------------------------------------
  console.log('\n--- 3. Percentage Coupon with Maximum Discount Cap ---');
  // Pro plan: ₹2499 base price. 50% off would be ₹1249.50, but maxDiscount = ₹500
  const cpnCapped = dbStore.createCoupon({
    code: `HALFMAX500_${Date.now()}`,
    description: '50% off capped at INR 500',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 500,
    isActive: true,
  });

  const res3 = validateCoupon({
    code: cpnCapped.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_creator', // INR 2,499
  });

  assert(res3.valid === true, 'Capped coupon accepted');
  assert(res3.pricing?.discountAmount === 500, 'Discount is strictly capped at INR 500 maximum');
  assert(res3.pricing?.discountedBaseAmount === 1999, 'Discounted base is INR 1,999 (2499 - 500)');

  // ---------------------------------------------------------------
  // 4. INVALID / UNKNOWN COUPON CODE
  // ---------------------------------------------------------------
  console.log('\n--- 4. Invalid or Unknown Coupon Code ---');
  const res4 = validateCoupon({
    code: 'NON_EXISTENT_CODE_XYZ',
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res4.valid === false, 'Non-existent coupon code rejected');
  assert(Boolean(res4.error?.includes('invalid or does not exist')), 'Helpful error message returned for unknown coupon');

  // ---------------------------------------------------------------
  // 5. EXPIRED COUPON
  // ---------------------------------------------------------------
  console.log('\n--- 5. Expired Coupon ---');
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const cpnExpired = dbStore.createCoupon({
    code: `EXPIRED_${Date.now()}`,
    description: 'Expired promo',
    discountType: 'percentage',
    discountValue: 20,
    expiresAt: yesterday,
    isActive: true,
  });

  const res5 = validateCoupon({
    code: cpnExpired.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res5.valid === false, 'Expired coupon rejected');
  assert(Boolean(res5.error?.includes('expired')), 'Error indicates coupon has expired');

  // ---------------------------------------------------------------
  // 6. COUPON NOT YET ACTIVE (FUTURE START DATE)
  // ---------------------------------------------------------------
  console.log('\n--- 6. Coupon Not Yet Active ---');
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const cpnFuture = dbStore.createCoupon({
    code: `FUTURE_${Date.now()}`,
    description: 'Future promo',
    discountType: 'percentage',
    discountValue: 20,
    startsAt: tomorrow,
    isActive: true,
  });

  const res6 = validateCoupon({
    code: cpnFuture.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res6.valid === false, 'Future coupon rejected');
  assert(Boolean(res6.error?.includes('not started yet')), 'Error indicates promotion has not started yet');

  // ---------------------------------------------------------------
  // 7. MINIMUM ORDER VALUE FAILURE
  // ---------------------------------------------------------------
  console.log('\n--- 7. Minimum Order Value Failure ---');
  // Pack 500 Credits: ₹499 base price. Coupon requires minimum ₹1000 order
  const cpnMinOrder = dbStore.createCoupon({
    code: `MIN1000_${Date.now()}`,
    description: 'Requires min order of 1000',
    discountType: 'fixed',
    discountValue: 150,
    minimumOrderValue: 1000,
    isActive: true,
  });

  const res7 = validateCoupon({
    code: cpnMinOrder.code,
    userId: testUserId,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_500', // ₹499 < ₹1000
  });

  assert(res7.valid === false, 'Order below minimum threshold rejected');
  assert(Boolean(res7.error?.includes('Minimum order value of INR 1,000')), 'Error clearly specifies minimum order requirement');

  // ---------------------------------------------------------------
  // 8. INELIGIBLE PACKAGE OR PLAN RESTRICTION
  // ---------------------------------------------------------------
  console.log('\n--- 8. Ineligible Product / Package Restriction ---');
  const cpnSubsOnly = dbStore.createCoupon({
    code: `SUBSONLY_${Date.now()}`,
    description: 'Subscriptions only',
    discountType: 'percentage',
    discountValue: 15,
    applicableTypes: ['subscription'],
    isActive: true,
  });

  const res8 = validateCoupon({
    code: cpnSubsOnly.code,
    userId: testUserId,
    paymentType: 'credit_pack', // Ineligible
    itemPlanOrPackId: 'pack_1200',
  });

  assert(res8.valid === false, 'Credit pack rejected on subscription-only coupon');
  assert(Boolean(res8.error?.includes('not valid for credit packs')), 'Error specifies product type ineligibility');

  // ---------------------------------------------------------------
  // 9. DISABLED / DEACTIVATED COUPON
  // ---------------------------------------------------------------
  console.log('\n--- 9. Disabled Coupon ---');
  const cpnDisabled = dbStore.createCoupon({
    code: `DISABLED_${Date.now()}`,
    description: 'Disabled coupon',
    discountType: 'percentage',
    discountValue: 25,
    isActive: false, // Inactive
  });

  const res9 = validateCoupon({
    code: cpnDisabled.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res9.valid === false, 'Deactivated coupon rejected');
  assert(Boolean(res9.error?.includes('currently disabled')), 'Error indicates coupon is currently disabled');

  // ---------------------------------------------------------------
  // 10. GLOBAL USAGE LIMIT REACHED
  // ---------------------------------------------------------------
  console.log('\n--- 10. Global Usage Limit Reached ---');
  const cpnLimit = dbStore.createCoupon({
    code: `LIMIT2_${Date.now()}`,
    description: 'Only 2 redemptions globally',
    discountType: 'fixed',
    discountValue: 100,
    usageLimit: 2,
    isActive: true,
  });

  // Simulate 2 completed redemptions
  const txnA = `TXN_A_${Date.now()}_1`;
  dbStore.reserveCouponRedemption({
    couponId: cpnLimit.id,
    couponCode: cpnLimit.code,
    userId: 'user_a',
    txnid: txnA,
    discountAmount: 100,
    originalAmount: 999,
    finalAmount: 899,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });
  dbStore.completeCouponRedemption(txnA);

  const txnB = `TXN_B_${Date.now()}_2`;
  dbStore.reserveCouponRedemption({
    couponId: cpnLimit.id,
    couponCode: cpnLimit.code,
    userId: 'user_b',
    txnid: txnB,
    discountAmount: 100,
    originalAmount: 999,
    finalAmount: 899,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });
  dbStore.completeCouponRedemption(txnB);

  const res10 = validateCoupon({
    code: cpnLimit.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res10.valid === false, 'Coupon exceeding global usage limit rejected');
  assert(Boolean(res10.error?.includes('maximum global redemption limit')), 'Error informs user that global limit was reached');

  // ---------------------------------------------------------------
  // 11. PER-USER USAGE LIMIT REACHED
  // ---------------------------------------------------------------
  console.log('\n--- 11. Per-User Usage Limit Reached ---');
  const cpnPerUser = dbStore.createCoupon({
    code: `ONCEPERUSER_${Date.now()}`,
    description: '1 per user',
    discountType: 'fixed',
    discountValue: 50,
    perUserLimit: 1,
    isActive: true,
  });

  // User completes 1st redemption
  const txnUser1 = `TXN_U1_${Date.now()}`;
  dbStore.reserveCouponRedemption({
    couponId: cpnPerUser.id,
    couponCode: cpnPerUser.code,
    userId: testUserId,
    txnid: txnUser1,
    discountAmount: 50,
    originalAmount: 999,
    finalAmount: 949,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });
  dbStore.completeCouponRedemption(txnUser1);

  // User attempts 2nd redemption
  const res11 = validateCoupon({
    code: cpnPerUser.code,
    userId: testUserId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });

  assert(res11.valid === false, 'Second redemption by same user rejected');
  assert(Boolean(res11.error?.includes('already redeemed')), 'Error informs user that per-user limit has been reached');

  // Different user is still permitted
  const res11DiffUser = validateCoupon({
    code: cpnPerUser.code,
    userId: 'usr_different_user_456',
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });
  assert(res11DiffUser.valid === true, 'Different user can still redeem per-user limited coupon');

  // ---------------------------------------------------------------
  // 12. DISCOUNT CANNOT EXCEED ELIGIBLE SUBTOTAL (NO NEGATIVE AMOUNT)
  // ---------------------------------------------------------------
  console.log('\n--- 12. Discount Cannot Exceed Subtotal ---');
  // Pack 500 Credits is ₹499. Massive coupon of ₹10,000 off
  const cpnMassive = dbStore.createCoupon({
    code: `HUGE10K_${Date.now()}`,
    description: 'Huge discount exceeding price',
    discountType: 'fixed',
    discountValue: 10000,
    isActive: true,
  });

  const res12 = validateCoupon({
    code: cpnMassive.code,
    userId: testUserId,
    paymentType: 'credit_pack',
    itemPlanOrPackId: 'pack_500', // ₹499
  });

  assert(res12.valid === true, 'Massive coupon validated');
  assert(res12.pricing?.discountAmount === 499, 'Discount strictly capped at eligible subtotal (₹499)');
  assert(res12.pricing?.discountedBaseAmount === 0, 'Discounted base amount does not drop below 0');
  assert(res12.pricing?.totalAmount === 0, 'Total payable does not become negative');
  assert(res12.pricing?.isZeroPayable === true, 'Flagged as zero payable flow');

  // ---------------------------------------------------------------
  // 13. PRICE MANIPULATION ATTEMPTS FROM BROWSER ARE OVERRIDDEN
  // ---------------------------------------------------------------
  console.log('\n--- 13. Server-Side Price Verification Overrides Client Manipulation ---');
  // Client attempts to claim that basic plan is ₹1. Server fetches trusted ₹999 from store
  const orderTamperAttempt = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerDetails,
    couponCode: cpnPct.code, // 10% off
  });

  assert(orderTamperAttempt.order.baseAmount === 899.1, 'Server calculates genuine discounted base price ₹899.10');
  assert(orderTamperAttempt.order.originalBaseAmount === 999, 'Original price recorded from trusted database ₹999');
  assert(orderTamperAttempt.order.discountAmount === 99.9, 'Discount amount verified server-side');

  // ---------------------------------------------------------------
  // 14. COUPON REMOVAL AND RECALCULATION
  // ---------------------------------------------------------------
  console.log('\n--- 14. Coupon Removal Recalculation ---');
  // Order without coupon
  const orderStandard = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerDetails,
  });

  assert(orderStandard.order.baseAmount === 999, 'Original base amount without coupon is ₹999');
  assert(orderStandard.order.discountAmount === undefined, 'No discount recorded when coupon not passed');
  assert(orderStandard.order.totalAmount === 1178.82, 'Full standard amount charged (999 + 18% GST)');

  // ---------------------------------------------------------------
  // 15. CHECKOUT AMOUNT MATCHES SERVER-CALCULATED PAYU AMOUNT
  // ---------------------------------------------------------------
  console.log('\n--- 15. PayU Request Amount Reconciles Exactly ---');
  const payuConfig = getPayUConfig();
  const expectedPayUAmount = orderTamperAttempt.order.totalAmount.toFixed(2);
  assert(orderTamperAttempt.payuParams.amount === expectedPayUAmount, 'PayU amount parameter matches verified total');

  // Re-verify SHA-512 Request Hash
  const manualHash = generatePayURequestHash({
    key: payuConfig.merchantKey,
    txnid: orderTamperAttempt.order.txnid,
    amount: expectedPayUAmount,
    productinfo: orderTamperAttempt.order.productInfo,
    firstname: 'Aria',
    email: customerDetails.email,
    udf1: `ord_${orderTamperAttempt.order.txnid}`,
    udf2: testUserId,
    udf3: 'subscription',
    udf4: 'plan_starter',
    udf5: testWorkspaceId,
    salt: payuConfig.merchantSalt,
  });

  assert(orderTamperAttempt.payuParams.hash === manualHash, 'PayU Request Hash strictly computed from discounted amount');

  // ---------------------------------------------------------------
  // 16. FAILED AND CANCELLED PAYMENTS DO NOT CREATE COMPLETED REDEMPTIONS
  // ---------------------------------------------------------------
  console.log('\n--- 16. Failed & Cancelled Payments Do Not Increment Redemptions ---');
  const cpnCancelTest = dbStore.createCoupon({
    code: `CANCELTEST_${Date.now()}`,
    description: 'Testing cancelled order redemption lifecycle',
    discountType: 'fixed',
    discountValue: 100,
    isActive: true,
  });

  const cancelOrder = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerDetails,
    couponCode: cpnCancelTest.code,
  });

  // Verify reservation exists
  const redBefore = dbStore.getCouponRedemptions(cpnCancelTest.id);
  assert(redBefore.length === 1 && redBefore[0].status === 'reserved', 'Coupon redemption initially placed in reserved status');
  assert(dbStore.getCouponById(cpnCancelTest.id)?.usageCount === 0, 'Usage count remains 0 during checkout reservation');

  // Customer cancels on PayU gateway
  dbStore.cancelCouponRedemption(cancelOrder.order.txnid);
  const redAfterCancel = dbStore.getCouponRedemptions(cpnCancelTest.id);
  assert(redAfterCancel[0].status === 'cancelled', 'Cancelled order marked redemption status as cancelled');
  assert(dbStore.getCouponById(cpnCancelTest.id)?.usageCount === 0, 'Usage count remains 0 after cancellation');

  // ---------------------------------------------------------------
  // 17. DUPLICATE PAYMENT CALLBACKS DO NOT DUPLICATE REDEMPTIONS OR CREDITS
  // ---------------------------------------------------------------
  console.log('\n--- 17. Idempotent Payment Callbacks ---');
  const cpnIdempotent = dbStore.createCoupon({
    code: `IDEMPOTENT_${Date.now()}`,
    description: 'Testing idempotent redemption',
    discountType: 'fixed',
    discountValue: 150,
    isActive: true,
  });

  const orderIdemp = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerDetails,
    couponCode: cpnIdempotent.code,
  });

  const walletBefore = dbStore.getCreditAccount(testUserId).availableBalance;

  // 1st fulfillment
  const f1 = await fulfillPayUPayment({
    txnid: orderIdemp.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });
  assert(f1.success === true, 'First payment fulfillment succeeded');

  const couponUsageAfterFirst = dbStore.getCouponById(cpnIdempotent.id)?.usageCount;
  const walletAfterFirst = dbStore.getCreditAccount(testUserId).availableBalance;
  assert(couponUsageAfterFirst === 1, 'Coupon usage count incremented to exactly 1');

  // 2nd duplicate callback (network retry / webhook duplicate)
  const f2 = await fulfillPayUPayment({
    txnid: orderIdemp.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });
  assert(f2.alreadyProcessed === true, 'Duplicate fulfillment recognized as already processed');

  const couponUsageAfterSecond = dbStore.getCouponById(cpnIdempotent.id)?.usageCount;
  const walletAfterSecond = dbStore.getCreditAccount(testUserId).availableBalance;
  assert(couponUsageAfterSecond === 1, 'Coupon usage count was not duplicated (remained 1)');
  assert(walletAfterSecond === walletAfterFirst, 'Credits were not duplicated on replay');

  // ---------------------------------------------------------------
  // 18. CONCURRENT REDEMPTION ATTEMPTS DO NOT BYPASS USAGE LIMITS
  // ---------------------------------------------------------------
  console.log('\n--- 18. Concurrent Limit Enforcement ---');
  const cpnRace = dbStore.createCoupon({
    code: `RACE_${Date.now()}`,
    description: 'Race condition test',
    discountType: 'percentage',
    discountValue: 20,
    usageLimit: 1, // Only 1 allowed
    isActive: true,
  });

  // Attempt 1 reserves and fulfills
  const raceOrder = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    customerDetails,
    couponCode: cpnRace.code,
  });
  await fulfillPayUPayment({ txnid: raceOrder.order.txnid, skipHashCheckIfAlreadyVerified: true });

  // Concurrent Attempt 2 should fail validation
  const raceAttempt2 = validateCoupon({
    code: cpnRace.code,
    userId: 'another_user',
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
  });
  assert(raceAttempt2.valid === false, 'Subsequent concurrent order rejected after limit reached');

  // ---------------------------------------------------------------
  // 19. ADMIN-ONLY COUPON MANAGEMENT
  // ---------------------------------------------------------------
  console.log('\n--- 19. Admin-Only Coupon Management ---');
  const adminCoupon = dbStore.createCoupon({
    code: `ADMINMGMT_${Date.now()}`,
    description: 'Created by admin',
    discountType: 'fixed',
    discountValue: 250,
    minimumOrderValue: 999,
    isActive: true,
    createdBy: 'usr_admin_master_1',
  });

  assert(adminCoupon.code.startsWith('ADMINMGMT_'), 'Admin coupon created in database');

  // Admin updates coupon
  const updatedCoupon = dbStore.updateCoupon(adminCoupon.id, {
    discountValue: 300,
    description: 'Updated discount value by admin',
  });
  assert(updatedCoupon.discountValue === 300, 'Admin can update coupon parameters');

  // Admin deactivates coupon
  const deactivated = dbStore.updateCoupon(adminCoupon.id, { isActive: false });
  assert(deactivated.isActive === false, 'Admin can deactivate coupon');

  // Admin deletes coupon
  const deleteResult = dbStore.deleteCoupon(adminCoupon.id);
  assert(deleteResult === true, 'Admin can safely delete or archive coupon');
  assert(dbStore.getCouponById(adminCoupon.id) === undefined, 'Deleted coupon removed from active lookup');

  // ---------------------------------------------------------------
  // 20. INVOICE AND RECEIPT SHOW THE CORRECT DISCOUNT AND PAYABLE AMOUNT
  // ---------------------------------------------------------------
  console.log('\n--- 20. Invoice & Receipt Vector PDF Generation with Discount ---');
  const cpnBillingDoc = dbStore.createCoupon({
    code: `BILLINGDOC_${Date.now()}`,
    description: 'Invoice verification promo',
    discountType: 'fixed',
    discountValue: 199,
    isActive: true,
  });

  const docOrder = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWorkspaceId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter', // ₹999 - ₹199 = ₹800 base
    customerDetails,
    couponCode: cpnBillingDoc.code,
  });

  const docFulfillment = await fulfillPayUPayment({
    txnid: docOrder.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });

  const invoice = docFulfillment.invoice!;
  const receipt = docFulfillment.receipt!;

  assert(invoice !== undefined, 'Tax invoice generated');
  assert(invoice.couponCode === cpnBillingDoc.code, 'Invoice records applied coupon code');
  assert(invoice.discountAmount === 199, 'Invoice records accurate discount amount (₹199)');
  assert(invoice.originalBaseAmount === 999, 'Invoice records original subtotal (₹999)');
  assert(invoice.baseAmount === 800, 'Invoice taxable value reflects discounted base (₹800)');
  assert(invoice.totalAmount === Math.round((800 + 800 * 0.18) * 100) / 100, 'Invoice grand total is ₹944 (800 + 18% GST)');

  assert(receipt !== undefined, 'Payment receipt generated');
  assert(receipt.couponCode === cpnBillingDoc.code, 'Receipt records coupon code');
  assert(receipt.discountAmount === 199, 'Receipt records discount amount');
  assert(receipt.amountReceived === invoice.totalAmount, 'Receipt amount received matches discounted invoice total');

  // Test vector PDF rendering
  const invoicePdfBytes = await generateInvoicePdf(invoice);
  assert(invoicePdfBytes instanceof Uint8Array, 'Invoice PDF rendered to bytes');
  const invoicePdfHeader = Buffer.from(invoicePdfBytes.slice(0, 5)).toString();
  assert(invoicePdfHeader === '%PDF-', 'Invoice PDF contains valid %PDF- binary header');

  const receiptPdfBytes = await generateReceiptPdf(receipt);
  assert(receiptPdfBytes instanceof Uint8Array, 'Receipt PDF rendered to bytes');
  const receiptPdfHeader = Buffer.from(receiptPdfBytes.slice(0, 5)).toString();
  assert(receiptPdfHeader === '%PDF-', 'Receipt PDF contains valid %PDF- binary header');

  console.log('\n================================================================');
  console.log(`  COUPON SYSTEM TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCouponSystemTestSuite().catch((err) => {
  console.error('Fatal error in coupon test suite:', err);
  process.exit(1);
});
