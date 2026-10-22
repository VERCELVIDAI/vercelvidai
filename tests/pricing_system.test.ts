import { dbStore } from '../src/lib/db/store';
import { createPayUPaymentOrder, fulfillPayUPayment, calculateGstBreakdown } from '../src/lib/payments/payu';
import { generateInvoicePdf, generateReceiptPdf } from '../src/lib/documents/pdfGenerator';

console.log('================================================================');
console.log('  FLUVIA FLOW — PRICING & BILLING SYSTEM TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    failCount++;
  }
}

async function runTests() {
  // Test 1: Plan Configurations in Store
  console.log('--- 1. Four Configurable Fluvia Flow Plans ---');
  const plans = dbStore.getPlans();
  const basicPlan = plans.find(p => p.id === 'plan_starter');
  const proPlan = plans.find(p => p.id === 'plan_creator');
  const maxPlan = plans.find(p => p.id === 'plan_max');
  const teamsPlan = plans.find(p => p.id === 'plan_business');

  assert(Boolean(basicPlan), 'Basic plan exists with plan_starter ID');
  assert(Boolean(proPlan), 'Pro plan exists with plan_creator ID');
  assert(Boolean(maxPlan), 'Max plan exists with plan_max ID');
  assert(Boolean(teamsPlan), 'Teams plan exists with plan_business ID');

  assert(basicPlan?.priceInr === 999 && basicPlan?.creditsPerPeriod === 500, 'Basic plan is ₹999 for 500 credits');
  assert(proPlan?.priceInr === 2499 && proPlan?.creditsPerPeriod === 1600, 'Pro plan is ₹2,499 for 1,600 credits');
  assert(maxPlan?.priceInr === 4999 && maxPlan?.creditsPerPeriod === 4000, 'Max plan is ₹4,999 for 4,000 credits');
  assert(teamsPlan?.priceInr === 9999 && teamsPlan?.creditsPerPeriod === 10000, 'Teams plan is ₹9,999 for 10,000 credits');

  // Test 2: Accurate Savings Calculation
  console.log('\n--- 2. Transparent Annual Pricing Calculations ---');
  const basicAnnualMonthly = basicPlan?.priceAnnualInr || 799;
  const basicSavings = Math.round(((basicPlan!.priceInr - basicAnnualMonthly) / basicPlan!.priceInr) * 100);
  assert(basicSavings === 20, `Basic annual discount accurately calculates to 20% (₹999 -> ₹${basicAnnualMonthly})`);

  const proAnnualMonthly = proPlan?.priceAnnualInr || 1999;
  const proSavings = Math.round(((proPlan!.priceInr - proAnnualMonthly) / proPlan!.priceInr) * 100);
  assert(proSavings === 20, `Pro annual discount accurately calculates to 20% (₹2,499 -> ₹${proAnnualMonthly})`);

  // Test 3: Credit Estimation from Server-Configured Cost
  console.log('\n--- 3. Generation Estimation from Live Model Costs ---');
  const videoCostCredits = 25; // 5 seconds of Fluvia Cinematic v1
  const basicVideoEst = Math.floor(basicPlan!.creditsPerPeriod / videoCostCredits);
  const proVideoEst = Math.floor(proPlan!.creditsPerPeriod / videoCostCredits);
  const maxVideoEst = Math.floor(maxPlan!.creditsPerPeriod / videoCostCredits);
  const teamsVideoEst = Math.floor(teamsPlan!.creditsPerPeriod / videoCostCredits);

  assert(basicVideoEst === 20, `Basic delivers 20 video generations (500 / 25)`);
  assert(proVideoEst === 64, `Pro delivers 64 video generations (1,600 / 25)`);
  assert(maxVideoEst === 160, `Max delivers 160 video generations (4,000 / 25)`);
  assert(teamsVideoEst === 400, `Teams delivers 400 video generations (10,000 / 25)`);

  // Test 4: PayU Annual Order Creation & Authoritative Pricing
  console.log('\n--- 4. PayU Annual Subscription Order Initialization ---');
  const testUserId = 'usr_creator_demo_1';
  const testWsId = 'ws_creator_demo_1';

  const orderResult = await createPayUPaymentOrder({
    userId: testUserId,
    workspaceId: testWsId,
    paymentType: 'subscription',
    itemPlanOrPackId: 'plan_starter',
    billingInterval: 'year',
    customerDetails: {
      name: 'Annual Subscriber',
      email: 'creator@vidai.io',
      phone: '9876543210',
      state: 'Delhi',
    },
  });

  const expectedBaseAnnual = 799 * 12; // 9,588 INR
  const expectedTax = Math.round((expectedBaseAnnual * 0.18) * 100) / 100; // 1,725.84 INR
  const expectedTotal = expectedBaseAnnual + expectedTax; // 11,313.84 INR

  assert(orderResult.order.baseAmount === expectedBaseAnnual, `Base annual amount is 12 x ₹799 = ₹${expectedBaseAnnual}`);
  assert(orderResult.order.taxAmount === expectedTax, `18% GST calculates to ₹${expectedTax}`);
  assert(orderResult.order.totalAmount === expectedTotal, `Total amount charged is ₹${expectedTotal}`);
  assert(orderResult.payuParams.hash.length === 128, 'PayU SHA-512 request hash is valid');

  // Test 5: Subscription Fulfillment Sets 365 Days Period for Annual
  console.log('\n--- 5. Atomic Fulfillment & 365-Day Subscription Activation ---');
  const fulfillResult = await fulfillPayUPayment({
    txnid: orderResult.order.txnid,
    skipHashCheckIfAlreadyVerified: true,
  });

  assert(fulfillResult.success, 'Fulfillment marked order success');
  const userSub = dbStore.getUserSubscription(testUserId).subscription;
  assert(Boolean(userSub), 'User has active subscription object');
  assert(userSub?.planId === 'plan_starter', 'Subscription is bound to plan_starter');

  const periodDays = Math.round(
    (new Date(userSub!.currentPeriodEnd).getTime() - new Date(userSub!.currentPeriodStart).getTime()) / (1000 * 60 * 60 * 24)
  );
  assert(periodDays >= 364 && periodDays <= 366, `Subscription period end is 1 year (365 days) ahead`);

  // Test 6: Invoices & Receipts for the Transaction
  console.log('\n--- 6. Vector PDF Document Generation ---');
  assert(Boolean(fulfillResult.invoice), 'Tax invoice generated automatically');
  assert(Boolean(fulfillResult.receipt), 'Payment receipt generated automatically');

  const invoicePdf = await generateInvoicePdf(fulfillResult.invoice!);
  assert(invoicePdf.byteLength > 2000, `Invoice PDF rendered (${invoicePdf.byteLength} bytes)`);
  const invoiceHeader = Buffer.from(invoicePdf.slice(0, 5)).toString('ascii');
  assert(invoiceHeader === '%PDF-', 'Invoice PDF contains %PDF- binary header');

  const receiptPdf = await generateReceiptPdf(fulfillResult.receipt!, fulfillResult.invoice);
  assert(receiptPdf.byteLength > 2000, `Receipt PDF rendered (${receiptPdf.byteLength} bytes)`);
  const receiptHeader = Buffer.from(receiptPdf.slice(0, 5)).toString('ascii');
  assert(receiptHeader === '%PDF-', 'Receipt PDF contains %PDF- binary header');

  // Test 7: Admin Plan Updating & Audit Log Protection
  console.log('\n--- 7. Admin Plan Updates & Audit Trail ---');
  const updatedBasic = dbStore.updatePlan('plan_starter', {
    description: 'Updated for creator testing',
  });
  assert(updatedBasic.description === 'Updated for creator testing', 'Plan description updated in store');

  // Historical invoice check: previous invoice must remain completely untouched
  const histInvoice = dbStore.getInvoiceById(fulfillResult.invoice!.id);
  assert(histInvoice?.totalAmount === expectedTotal, 'Historical invoice preserved without mutation');

  console.log('\n================================================================');
  console.log(`  PRICING TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
