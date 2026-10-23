import crypto from 'crypto';
import { dbStore } from '../db/store';
import { validateCoupon } from '../coupons/service';
import {
  PayUPaymentOrder,
  TaxBreakdown,
  CustomerBillingDetails,
  Invoice,
  PaymentReceipt,
  SupplierLegalDetails,
} from '../types';

export interface PayUConfig {
  merchantKey: string;
  merchantSalt: string;
  env: 'test' | 'prod';
  paymentUrl: string;
  postServiceUrl: string;
}

export function getPayUConfig(): PayUConfig {
  const env = (process.env.PAYU_ENV || 'test') as 'test' | 'prod';
  const merchantKey = process.env.PAYU_MERCHANT_KEY || 'gtKFFx'; // Official PayU sandbox test key fallback
  const merchantSalt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi'; // Official PayU sandbox test salt fallback

  const paymentUrl =
    env === 'prod'
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment';

  const postServiceUrl =
    env === 'prod'
      ? 'https://info.payu.in/merchant/postservice?form=2'
      : 'https://test.payu.in/merchant/postservice?form=2';

  return {
    merchantKey,
    merchantSalt,
    env,
    paymentUrl,
    postServiceUrl,
  };
}

/**
 * Calculate 18% GST and tax breakdown based on customer's state vs supplier's state.
 * Intra-state: CGST (9%) + SGST (9%)
 * Inter-state: IGST (18%)
 */
export function calculateGstBreakdown(basePriceInr: number, customerState?: string): TaxBreakdown {
  const supplierSettings = dbStore.getBillingSettings();
  const supplierState = (supplierSettings.state || 'Delhi').trim().toLowerCase();
  const cState = (customerState || 'Delhi').trim().toLowerCase();

  const isInterState = cState !== supplierState;
  const taxRate = 18;
  const rawTax = (basePriceInr * taxRate) / 100;
  const taxAmount = Math.round(rawTax * 100) / 100;

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstRate = 18;
    igstAmount = taxAmount;
  } else {
    cgstRate = 9;
    sgstRate = 9;
    cgstAmount = Math.round((taxAmount / 2) * 100) / 100;
    sgstAmount = Math.round((taxAmount - cgstAmount) * 100) / 100;
  }

  return {
    baseAmount: basePriceInr,
    taxRate,
    taxAmount,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    isInterState,
    placeOfSupply: customerState || supplierSettings.state || 'Delhi',
  };
}

/**
 * Clean and sanitize productinfo for PayU Hosted Checkout:
 * PayU requires productinfo to be clean ASCII alphanumeric characters, spaces, hyphens, and underscores only.
 * Strips brackets, colons, commas, semicolons, quotes, and non-ASCII characters to prevent SHA-512 hash mismatches.
 */
export function sanitizePayUProductInfo(raw: string): string {
  if (!raw) return 'Fluvia Flow AI Creative Studio';
  const cleaned = raw
    .replace(/,/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 100) || 'Fluvia Flow AI Plan';
}

/**
 * Generate official PayU SHA-512 Request Hash:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayURequestHash(params: {
  key: string;
  txnid: string;
  amount: string; // Formatted with 2 decimal places e.g. "588.82"
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
}): string {
  const { key, txnid, amount, productinfo, firstname, email, salt } = params;
  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';

  const hashSequence = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();
}

/**
 * Verify official PayU Response Hash (Reverse Hash):
 * With additionalCharges:
 *   sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Without additionalCharges:
 *   sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  payload: Record<string, any>,
  salt: string
): boolean {
  if (!payload || !payload.hash) return false;

  const key = payload.key || '';
  const txnid = payload.txnid || '';
  const amount = payload.amount || '';
  const rawProductinfo = payload.productinfo || '';
  const firstname = payload.firstname || '';
  const email = payload.email || '';
  const status = payload.status || '';
  const udf1 = payload.udf1 || '';
  const udf2 = payload.udf2 || '';
  const udf3 = payload.udf3 || '';
  const udf4 = payload.udf4 || '';
  const udf5 = payload.udf5 || '';
  const additionalCharges = payload.additionalCharges;

  const receivedHash = payload.hash.toString().toLowerCase();

  const computeHashFor = (pInfo: string) => {
    let hashSeq = '';
    if (additionalCharges) {
      hashSeq = `${additionalCharges}|${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${pInfo}|${amount}|${txnid}|${key}`;
    } else {
      hashSeq = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${pInfo}|${amount}|${txnid}|${key}`;
    }
    return crypto.createHash('sha512').update(hashSeq).digest('hex').toLowerCase();
  };

  const safeCompare = (expected: string) => {
    if (expected.length !== receivedHash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedHash));
  };

  // 1. Check with raw received productinfo
  if (safeCompare(computeHashFor(rawProductinfo))) return true;

  // 2. Check with sanitized productinfo
  if (safeCompare(computeHashFor(sanitizePayUProductInfo(rawProductinfo)))) return true;

  // 3. Check with URL-decoded productinfo if received with percent encoding
  try {
    const decoded = decodeURIComponent(rawProductinfo);
    if (decoded !== rawProductinfo && safeCompare(computeHashFor(decoded))) {
      return true;
    }
  } catch {}

  return false;
}

export interface CreatePayUOrderParams {
  userId: string;
  workspaceId: string;
  paymentType: 'subscription' | 'credit_pack';
  itemPlanOrPackId: string;
  billingInterval?: 'month' | 'year';
  customerDetails: CustomerBillingDetails;
  couponCode?: string;
}

export interface PayUOrderInitResult {
  order: PayUPaymentOrder;
  isZeroPayment?: boolean;
  redirectUrl?: string;
  payuParams: {
    actionUrl: string;
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
  };
}

/**
 * Initialize a secure PayU Payment Order with server-side amount and tax calculation.
 */
export async function createPayUPaymentOrder(
  params: CreatePayUOrderParams
): Promise<PayUOrderInitResult> {
  const config = getPayUConfig();
  const now = new Date().toISOString();

  let basePriceInr = 499;
  let productInfo = 'Fluvia Flow Creative Credits Pack';

  if (params.paymentType === 'credit_pack') {
    const pack = dbStore.getCreditPacks().find((p) => p.id === params.itemPlanOrPackId);
    if (!pack) throw new Error('Invalid credit pack selected.');
    basePriceInr = pack.priceInr;
    productInfo = `${pack.name} (${pack.creditAmount.toLocaleString()} Credits)`;
  } else if (params.paymentType === 'subscription') {
    const plan =
      dbStore.getPlans().find((p) => p.id === params.itemPlanOrPackId) ||
      dbStore.getPlanById(params.itemPlanOrPackId);
    if (!plan) throw new Error('Invalid subscription plan selected.');

    const interval = params.billingInterval || plan.billingInterval || 'month';
    if (interval === 'year') {
      const monthlyRate = plan.priceAnnualInr || Math.round(plan.priceInr * 0.8);
      basePriceInr = monthlyRate * 12;
      productInfo = `${plan.name} - Annual Subscription (12 Months at INR ${monthlyRate}/mo)`;
    } else {
      basePriceInr = plan.priceInr;
      productInfo = `${plan.name} - Monthly Subscription`;
    }
  }

  // Handle server-side coupon validation & discount calculation
  let originalBasePrice = basePriceInr;
  let couponId: string | undefined;
  let appliedCouponCode: string | undefined;
  let discountAmount = 0;

  if (params.couponCode && params.couponCode.trim()) {
    const couponValidation = validateCoupon({
      code: params.couponCode,
      userId: params.userId,
      paymentType: params.paymentType,
      itemPlanOrPackId: params.itemPlanOrPackId,
      billingInterval: params.billingInterval,
      customerState: params.customerDetails.state,
    });

    if (!couponValidation.valid) {
      throw new Error(couponValidation.error || 'Invalid coupon applied.');
    }

    couponId = couponValidation.coupon?.id;
    appliedCouponCode = couponValidation.coupon?.code;
    discountAmount = couponValidation.pricing?.discountAmount || 0;
    basePriceInr = couponValidation.pricing?.discountedBaseAmount ?? basePriceInr;
    productInfo = `${productInfo} (Coupon: ${appliedCouponCode} applied)`;

    // Handle 100% discount / free checkout flow
    if (couponValidation.pricing?.isZeroPayable) {
      const txnid = `TXN_ZERO_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const idempotencyKey = `payu_order_${txnid}`;
      
      let cleanPhone = (params.customerDetails.phone || '9999999999').replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) cleanPhone = cleanPhone.padStart(10, '9');
      else if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);

      const rawFirstName = (params.customerDetails.name || 'Creator').trim().split(/\s+/)[0] || 'Creator';
      const cleanFirstname = rawFirstName.replace(/[^a-zA-Z]/g, '') || 'Creator';
      const cleanEmail = (params.customerDetails.email || 'creator@fluviaflow.ai').toLowerCase().trim();
      const cleanProductInfo = sanitizePayUProductInfo(productInfo);

      const zeroTaxBreakdown = {
        baseAmount: 0,
        taxRate: 18,
        taxAmount: 0,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 0,
        igstAmount: 0,
        isInterState: false,
        placeOfSupply: params.customerDetails.state || 'Delhi',
      };

      const order = dbStore.createPayUOrder({
        txnid,
        userId: params.userId,
        workspaceId: params.workspaceId,
        paymentType: params.paymentType,
        itemPlanOrPackId: params.itemPlanOrPackId,
        productInfo: cleanProductInfo,
        currency: 'INR',
        baseAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
        amountPaise: 0,
        taxBreakdown: zeroTaxBreakdown,
        customerDetails: {
          ...params.customerDetails,
          phone: cleanPhone,
          email: cleanEmail,
        },
        couponId,
        couponCode: appliedCouponCode,
        discountAmount,
        originalBaseAmount: originalBasePrice,
        status: 'created',
        idempotencyKey,
      });

      if (couponId && appliedCouponCode) {
        dbStore.reserveCouponRedemption({
          couponId,
          couponCode: appliedCouponCode,
          userId: params.userId,
          orderId: order.id,
          txnid,
          discountAmount,
          originalAmount: originalBasePrice,
          finalAmount: 0,
          paymentType: params.paymentType,
          itemPlanOrPackId: params.itemPlanOrPackId,
        });
      }

      // Fulfill zero payment order immediately
      const fulfillment = await fulfillPayUPayment({
        txnid,
        skipHashCheckIfAlreadyVerified: true,
      });

      const relativeRedirectUrl = `/payment/status?txnid=${encodeURIComponent(txnid)}&status=success`;
      return {
        order: fulfillment.order,
        isZeroPayment: true,
        redirectUrl: relativeRedirectUrl,
        payuParams: {
          actionUrl: relativeRedirectUrl,
          key: config.merchantKey,
          txnid,
          amount: '0.00',
          productinfo: cleanProductInfo,
          firstname: cleanFirstname,
          email: cleanEmail,
          phone: cleanPhone,
          surl: `/api/payments/payu/callback`,
          furl: `/api/payments/payu/callback`,
          hash: '',
          udf1: `ord_${txnid}`,
          udf2: params.userId,
          udf3: params.paymentType,
          udf4: params.itemPlanOrPackId,
          udf5: params.workspaceId,
        },
      };
    }
  }

  // Calculate GST & total
  const taxBreakdown = calculateGstBreakdown(basePriceInr, params.customerDetails.state);
  const totalAmount = Math.round((basePriceInr + taxBreakdown.taxAmount) * 100) / 100;
  const amountStr = totalAmount.toFixed(2);
  const amountPaise = Math.round(totalAmount * 100);

  // Generate unique merchant transaction ID (Max 30 alphanumeric characters)
  const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const idempotencyKey = `payu_order_${txnid}`;

  const hostUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const surl = `${hostUrl}/api/payments/payu/callback`;
  const furl = `${hostUrl}/api/payments/payu/callback`;

  const rawFirstName = (params.customerDetails.name || 'Creator').trim().split(/\s+/)[0] || 'Creator';
  const firstname = rawFirstName.replace(/[^a-zA-Z]/g, '') || 'Creator';
  const email = (params.customerDetails.email || 'creator@fluviaflow.ai').toLowerCase().trim();
  let phone = (params.customerDetails.phone || '9999999999').replace(/[^0-9]/g, '');
  if (phone.length < 10) phone = phone.padStart(10, '9');
  else if (phone.length > 10) phone = phone.slice(-10);

  const cleanProductInfo = sanitizePayUProductInfo(productInfo);

  const udf1 = `ord_${txnid}`;
  const udf2 = params.userId;
  const udf3 = params.paymentType;
  const udf4 = params.itemPlanOrPackId;
  const udf5 = params.workspaceId;

  // Generate SHA-512 Hash
  const hash = generatePayURequestHash({
    key: config.merchantKey,
    txnid,
    amount: amountStr,
    productinfo: cleanProductInfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    salt: config.merchantSalt,
  });

  const order = dbStore.createPayUOrder({
    txnid,
    userId: params.userId,
    workspaceId: params.workspaceId,
    paymentType: params.paymentType,
    itemPlanOrPackId: params.itemPlanOrPackId,
    productInfo: cleanProductInfo,
    currency: 'INR',
    baseAmount: basePriceInr,
    taxAmount: taxBreakdown.taxAmount,
    totalAmount,
    amountPaise,
    taxBreakdown,
    customerDetails: {
      ...params.customerDetails,
      phone,
      email,
    },
    couponId,
    couponCode: appliedCouponCode,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
    originalBaseAmount: discountAmount > 0 ? originalBasePrice : undefined,
    status: 'created',
    idempotencyKey,
  });

  if (couponId && appliedCouponCode && discountAmount > 0) {
    dbStore.reserveCouponRedemption({
      couponId,
      couponCode: appliedCouponCode,
      userId: params.userId,
      orderId: order.id,
      txnid,
      discountAmount,
      originalAmount: originalBasePrice,
      finalAmount: totalAmount,
      paymentType: params.paymentType,
      itemPlanOrPackId: params.itemPlanOrPackId,
    });
  }

  dbStore.logAudit(params.userId, 'PAYU_ORDER_CREATED', 'payment_order', order.id, {
    txnid,
    totalAmount,
    productInfo: cleanProductInfo,
  });

  return {
    order,
    payuParams: {
      actionUrl: config.paymentUrl,
      key: config.merchantKey,
      txnid,
      amount: amountStr,
      productinfo: cleanProductInfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    },
  };
}

export interface PayUVerificationResult {
  verified: boolean;
  status: 'success' | 'failure' | 'pending';
  mihpayid?: string;
  bankRefNum?: string;
  paymentMode?: string;
  amount?: number;
  message?: string;
  rawResponse?: any;
}

/**
 * Server-to-server payment verification using PayU verify_payment API
 */
export async function verifyPaymentWithPayU(txnid: string): Promise<PayUVerificationResult> {
  const config = getPayUConfig();
  const order = dbStore.getPayUOrderByTxnid(txnid);

  if (!order) {
    return { verified: false, status: 'failure', message: 'Order not found in merchant database.' };
  }

  // Hash for verify_payment: sha512(key|command|var1|salt)
  const command = 'verify_payment';
  const hashSequence = `${config.merchantKey}|${command}|${txnid}|${config.merchantSalt}`;
  const hash = crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();

  const formData = new URLSearchParams();
  formData.append('key', config.merchantKey);
  formData.append('command', command);
  formData.append('var1', txnid);
  formData.append('hash', hash);

  try {
    const res = await fetch(config.postServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 1 && data.transaction_details && data.transaction_details[txnid]) {
        const txn = data.transaction_details[txnid];
        const isSuccess = txn.status === 'success';
        const isPending = txn.status === 'pending';

        return {
          verified: isSuccess,
          status: isSuccess ? 'success' : isPending ? 'pending' : 'failure',
          mihpayid: txn.mihpayid,
          bankRefNum: txn.bank_ref_num,
          paymentMode: txn.mode || txn.bankcode,
          amount: parseFloat(txn.amt || txn.transaction_amount || '0'),
          message: txn.error_Message || 'PayU verified',
          rawResponse: txn,
        };
      }
    }
  } catch (err: any) {
    console.warn(`PayU server postservice verification check error: ${err.message}`);
  }

  // Fallback check: If order was already completed or verified locally via verified response hash
  if (order.status === 'success') {
    return {
      verified: true,
      status: 'success',
      mihpayid: order.payuMihpayid,
      bankRefNum: order.payuBankRefNum,
      paymentMode: order.payuPaymentMode,
      amount: order.totalAmount,
      message: 'Verified from existing confirmed transaction record',
    };
  }

  return {
    verified: false,
    status: order.status === 'pending' ? 'pending' : 'failure',
    message: 'Could not verify transaction with PayU upstream service.',
  };
}

export interface FulfillPayUOrderParams {
  txnid?: string;
  orderId?: string;
  payuPayload?: Record<string, any>;
  skipHashCheckIfAlreadyVerified?: boolean;
}

export interface FulfillmentResult {
  success: boolean;
  alreadyProcessed?: boolean;
  order: PayUPaymentOrder;
  invoice?: Invoice;
  receipt?: PaymentReceipt;
  error?: string;
}

/**
 * Idempotently and atomically fulfill a confirmed PayU order:
 * 1. Verify response hash & match expected amount.
 * 2. Mark order as paid.
 * 3. Credit wallet via immutable ledger.
 * 4. Create official GST Tax Invoice.
 * 5. Create Payment Receipt.
 */
export async function fulfillPayUPayment(
  params: FulfillPayUOrderParams
): Promise<FulfillmentResult> {
  const config = getPayUConfig();
  const order =
    (params.txnid ? dbStore.getPayUOrderByTxnid(params.txnid) : undefined) ||
    (params.orderId ? dbStore.getPayUOrderById(params.orderId) : undefined);

  if (!order) {
    throw new Error(`Order with transaction ID ${params.txnid || params.orderId} not found.`);
  }

  // Idempotency: If already fulfilled, return existing records
  if (order.status === 'success') {
    const existingInvoice = order.invoiceId ? dbStore.getInvoiceById(order.invoiceId) : undefined;
    const existingReceipt = order.receiptId ? dbStore.getReceiptById(order.receiptId) : undefined;
    return {
      success: true,
      alreadyProcessed: true,
      order,
      invoice: existingInvoice,
      receipt: existingReceipt,
    };
  }

  // Verify response hash if payload supplied
  if (params.payuPayload && !params.skipHashCheckIfAlreadyVerified) {
    const isHashValid = verifyPayUResponseHash(params.payuPayload, config.merchantSalt);
    if (!isHashValid) {
      dbStore.updatePayUOrder(order.id, {
        status: 'failed',
        payuError: 'Response hash mismatch - potential tampering',
      });
      throw new Error('PayU response hash verification failed. Security mismatch.');
    }

    // Reconcile amount
    const returnedAmount = parseFloat(params.payuPayload.amount || '0');
    if (Math.abs(returnedAmount - order.totalAmount) > 0.05) {
      dbStore.updatePayUOrder(order.id, {
        status: 'failed',
        payuError: `Amount mismatch: expected ${order.totalAmount}, received ${returnedAmount}`,
      });
      throw new Error(`Payment amount mismatch. Expected: ${order.totalAmount}, Received: ${returnedAmount}`);
    }

    const payuStatus = (params.payuPayload.status || '').toLowerCase();
    if (payuStatus !== 'success') {
      dbStore.updatePayUOrder(order.id, {
        status: payuStatus === 'pending' ? 'pending' : 'failed',
        payuError: params.payuPayload.error_Message || `Payment status was ${payuStatus}`,
      });
      return {
        success: false,
        order: dbStore.getPayUOrderById(order.id)!,
        error: `PayU transaction was not successful (status: ${payuStatus})`,
      };
    }
  }

  const now = new Date().toISOString();
  const mihpayid = params.payuPayload?.mihpayid || `mih_${Date.now()}`;
  const bankRefNum = params.payuPayload?.bank_ref_num || `BNK_${Date.now()}`;
  const mode = params.payuPayload?.mode || params.payuPayload?.bankcode || 'UPI / Card';

  // 1. Credit wallet ledger atomically
  let creditsAwarded = 0;
  if (order.paymentType === 'credit_pack') {
    const pack = dbStore.getCreditPacks().find((p) => p.id === order.itemPlanOrPackId);
    creditsAwarded = pack ? pack.creditAmount : 500;

    dbStore.addCredits(
      order.userId,
      creditsAwarded,
      'purchase',
      order.id,
      `payu_fulfill_${order.txnid}`,
      {
        provider: 'payu',
        txnid: order.txnid,
        mihpayid,
        amountInr: order.totalAmount,
      }
    );
  } else if (order.paymentType === 'subscription') {
    const plan = dbStore.getPlans().find((p) => p.id === order.itemPlanOrPackId);
    creditsAwarded = plan ? plan.creditsPerPeriod : 1500;

    dbStore.addCredits(
      order.userId,
      creditsAwarded,
      'subscription_grant',
      order.id,
      `payu_sub_grant_${order.txnid}`,
      {
        planId: order.itemPlanOrPackId,
        billingInterval: plan?.billingInterval || 'month',
        txnid: order.txnid,
      }
    );

    // Update or activate user subscription
    const isAnnual = order.productInfo.includes('Annual');
    const periodDays = isAnnual ? 365 : 30;
    const periodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString();

    const existingSub = dbStore.getUserSubscription(order.userId).subscription;
    if (existingSub) {
      existingSub.planId = order.itemPlanOrPackId;
      existingSub.status = 'active';
      existingSub.providerSubscriptionId = `payu_sub_${order.txnid}`;
      existingSub.currentPeriodStart = now;
      existingSub.currentPeriodEnd = periodEnd;
    } else {
      dbStore.createSubscription({
        userId: order.userId,
        planId: order.itemPlanOrPackId,
        providerSubscriptionId: `payu_sub_${order.txnid}`,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      });
    }
  }

  // 1.5. Complete coupon redemption atomically if coupon was applied
  if (order.couponCode) {
    dbStore.completeCouponRedemption(order.txnid, order.id);
  }

  // 2. Generate Official Invoice
  const supplier = dbStore.getBillingSettings();
  const invoiceNumber = dbStore.getNextInvoiceNumber();

  const invoice = dbStore.createInvoice({
    invoiceNumber,
    orderId: order.id,
    txnid: order.txnid,
    userId: order.userId,
    workspaceId: order.workspaceId,
    supplier,
    customer: order.customerDetails,
    couponId: order.couponId,
    couponCode: order.couponCode,
    discountAmount: order.discountAmount,
    originalBaseAmount: order.originalBaseAmount,
    items: [
      {
        id: 'itm_1',
        description: order.productInfo,
        hsnSacCode: '998314', // SAC for Information technology services
        quantity: 1,
        unitPrice: order.originalBaseAmount || order.baseAmount,
        taxableValue: order.baseAmount,
        gstRate: order.taxBreakdown.taxRate,
        cgstAmount: order.taxBreakdown.cgstAmount,
        sgstAmount: order.taxBreakdown.sgstAmount,
        igstAmount: order.taxBreakdown.igstAmount,
        totalAmount: order.totalAmount,
      },
    ],
    baseAmount: order.baseAmount,
    taxAmount: order.taxAmount,
    cgstAmount: order.taxBreakdown.cgstAmount,
    sgstAmount: order.taxBreakdown.sgstAmount,
    igstAmount: order.taxBreakdown.igstAmount,
    totalAmount: order.totalAmount,
    currency: 'INR',
    status: 'paid',
    issueDate: now,
    dueDate: now,
    paymentDate: now,
    payuPaymentId: mihpayid,
    terms: 'Payment received via PayU India Hosted Checkout. Subject to terms at fluviaflow.ai/terms.',
    notes: order.couponCode
      ? `Thank you for your business. Applied Coupon: ${order.couponCode} (Discount: INR ${(order.discountAmount || 0).toFixed(2)}). Computer-generated tax invoice.`
      : 'Thank you for your business. Computer-generated tax invoice.',
  });

  // 3. Generate Official Payment Receipt
  const receiptNumber = dbStore.getNextReceiptNumber();
  const receipt = dbStore.createReceipt({
    receiptNumber,
    orderId: order.id,
    txnid: order.txnid,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    userId: order.userId,
    workspaceId: order.workspaceId,
    customerName: order.customerDetails.name,
    customerEmail: order.customerDetails.email,
    couponCode: order.couponCode,
    discountAmount: order.discountAmount,
    originalAmount: order.originalBaseAmount,
    amountReceived: order.totalAmount,
    currency: 'INR',
    paymentMethod: mode,
    payuMihpayid: mihpayid,
    payuBankRefNum: bankRefNum,
    productPurchased: order.productInfo,
    paymentDate: now,
    paymentStatus: 'verified_success',
    verificationReference: `PAYU-VERIFIED-${order.txnid}-${Date.now().toString(36).toUpperCase()}`,
    footerNotice:
      'Computer-generated payment receipt. Payment status is subject to verification against the merchant payment records.',
  });

  // 4. Update order with complete references
  const updatedOrder = dbStore.updatePayUOrder(order.id, {
    status: 'success',
    payuMihpayid: mihpayid,
    payuBankRefNum: bankRefNum,
    payuPaymentMode: mode,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    receiptId: receipt.id,
    receiptNumber: receipt.receiptNumber,
    verifiedAt: now,
  });

  dbStore.logAudit(order.userId, 'PAYU_PAYMENT_SUCCESS', 'payment_order', order.id, {
    txnid: order.txnid,
    totalAmount: order.totalAmount,
    invoiceNumber,
    receiptNumber,
    creditsAwarded,
  });

  return {
    success: true,
    order: updatedOrder,
    invoice,
    receipt,
  };
}
