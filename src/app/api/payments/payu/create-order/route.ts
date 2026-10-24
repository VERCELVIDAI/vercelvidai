import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth/session';
import { createPayUPaymentOrder } from '@/lib/payments/payu';
import {
  checkPaymentRateLimit,
  getClientIdentifier,
  logPaymentEvent,
} from '@/lib/payments/rateLimiter';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomBytes(8).toString('hex')}`;

  try {
    const current = await getCurrentUser();
    if (!current) {
      logPaymentEvent({
        requestId,
        category: 'checkout_init',
        statusCode: 401,
        error: 'Unauthorized',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Rate Limiting Check (protect against rapid double-clicks & PayU 60s IP lockouts)
    const clientId = getClientIdentifier(req, current.user.id);
    const rateLimit = checkPaymentRateLimit(clientId);

    if (!rateLimit.allowed) {
      logPaymentEvent({
        requestId,
        category: 'rate_limit',
        statusCode: 429,
        userId: current.user.id,
        durationMs: Date.now() - startTime,
        error: rateLimit.errorMessage,
      });

      return NextResponse.json(
        {
          error:
            rateLimit.errorMessage ||
            `Sorry, we are unable to process your payment due to Too many Requests. Please try after ${rateLimit.retryAfter} seconds.`,
          retryAfter: rateLimit.retryAfter,
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    const body = await req.json();
    const {
      paymentType,
      itemPlanOrPackId,
      billingInterval,
      customerDetails,
      couponCode,
      forceNew,
    } = body;

    if (!paymentType || !itemPlanOrPackId) {
      logPaymentEvent({
        requestId,
        category: 'checkout_init',
        statusCode: 400,
        userId: current.user.id,
        error: 'paymentType and itemPlanOrPackId are required',
      });
      return NextResponse.json(
        { error: 'paymentType and itemPlanOrPackId are required.' },
        { status: 400 }
      );
    }

    const billingDetails = {
      name: customerDetails?.name || current.user.displayName,
      email: customerDetails?.email || current.user.email,
      phone: customerDetails?.phone || '9999999999',
      address: customerDetails?.address || '',
      city: customerDetails?.city || '',
      state: customerDetails?.state || 'Delhi',
      pincode: customerDetails?.pincode || '',
      gstin: customerDetails?.gstin || '',
    };

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const proto =
      req.headers.get('x-forwarded-proto') ||
      (req.nextUrl.protocol ? req.nextUrl.protocol.replace(':', '') : 'http');
    const requestOrigin = host ? `${proto}://${host}` : undefined;

    const orderResult = await createPayUPaymentOrder({
      userId: current.user.id,
      workspaceId: current.workspace.id,
      paymentType,
      itemPlanOrPackId,
      billingInterval: billingInterval === 'year' ? 'year' : 'month',
      customerDetails: billingDetails,
      couponCode: couponCode ? String(couponCode).trim() : undefined,
      requestOrigin,
      forceNew: Boolean(forceNew),
    });

    logPaymentEvent({
      requestId,
      category: 'checkout_init',
      statusCode: 201,
      durationMs: Date.now() - startTime,
      txnid: orderResult.order.txnid,
      orderId: orderResult.order.id,
      userId: current.user.id,
      paymentType,
      status: orderResult.order.status,
    });

    return NextResponse.json(orderResult, { status: 201 });
  } catch (err: any) {
    console.error('Error creating PayU payment order:', err);
    logPaymentEvent({
      requestId,
      category: 'checkout_init',
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: err.message || 'Failed to create payment order',
    });
    return NextResponse.json(
      { error: err.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
