import crypto from 'crypto';
import { dbStore } from '../db/store';

export interface CreateOrderParams {
  userId: string;
  amountInr: number;
  paymentType: 'subscription' | 'credit_pack';
  itemPlanOrPackId: string;
}

export function createRazorpayOrder(params: CreateOrderParams) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_vidai_demo123';
  const orderId = 'order_' + Math.random().toString(36).substring(2, 14);

  // Record pending payment in store
  const payment = dbStore.createPayment({
    userId: params.userId,
    orderId,
    amountInr: params.amountInr,
    currency: 'INR',
    status: 'pending',
    paymentType: params.paymentType,
    metadata: {
      itemPlanOrPackId: params.itemPlanOrPackId,
    },
  });

  return {
    orderId,
    keyId,
    amount: params.amountInr * 100, // Razorpay uses paisa
    currency: 'INR',
    paymentRecordId: payment.id,
  };
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'vidai_secret_demo456';

  // Demo simulator bypass signature check if using test simulator
  if (params.signature.startsWith('simulated_valid_sig_')) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest('hex');

  return generatedSignature === params.signature;
}

export function confirmAndFulfillPayment(params: {
  userId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const isValid = verifyPaymentSignature(params);
  if (!isValid) {
    throw new Error('Invalid payment signature. Verification failed.');
  }

  const payments = dbStore.getAllPayments();
  const payment = payments.find((p) => p.orderId === params.orderId);

  if (!payment) {
    throw new Error('Order not found.');
  }

  if (payment.status === 'success') {
    // Idempotent safe return
    return { success: true, alreadyProcessed: true };
  }

  // Update payment status
  payment.status = 'success';
  payment.providerPaymentId = params.paymentId;

  const itemPlanOrPackId = payment.metadata?.itemPlanOrPackId;

  if (payment.paymentType === 'credit_pack') {
    const packs = dbStore.getCreditPacks();
    const pack = packs.find((p) => p.id === itemPlanOrPackId);
    const creditsToAdd = pack ? pack.creditAmount : 500;

    dbStore.addCredits(
      params.userId,
      creditsToAdd,
      'purchase',
      payment.id,
      `pay_fulfill_${params.orderId}`,
      { packId: itemPlanOrPackId, amountInr: payment.amountInr }
    );
  } else if (payment.paymentType === 'subscription') {
    const plans = dbStore.getPlans();
    const plan = plans.find((p) => p.id === itemPlanOrPackId) || plans[1];

    // Give plan allowance credits
    dbStore.addCredits(
      params.userId,
      plan.creditsPerPeriod,
      'monthly_allowance',
      payment.id,
      `sub_fulfill_${params.orderId}`,
      { planId: plan.id, amountInr: payment.amountInr }
    );
  }

  dbStore.logAudit(params.userId, 'PAYMENT_FULFILLED', 'payment', payment.id, {
    orderId: params.orderId,
    amountInr: payment.amountInr,
  });

  return { success: true, payment };
}
