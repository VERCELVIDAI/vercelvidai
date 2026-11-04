import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser, createSignedSessionToken } from '@/lib/auth/session';
import { createPayUPaymentOrder } from '@/lib/payments/payu';
import { dbStore } from '@/lib/db/store';
import {
  checkPaymentRateLimit,
  getClientIdentifier,
  logPaymentEvent,
} from '@/lib/payments/rateLimiter';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomBytes(8).toString('hex')}`;

  try {
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
        error: 'paymentType and itemPlanOrPackId are required',
      });
      return NextResponse.json(
        { error: 'paymentType and itemPlanOrPackId are required.' },
        { status: 400 }
      );
    }

    // Authenticated user or seamless guest account resolution
    let current = await getCurrentUser();
    let newSessionToken: string | null = null;
    let userId = current?.user?.id;
    let workspaceId = current?.workspace?.id;

    if (!current) {
      const email = (customerDetails?.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        logPaymentEvent({
          requestId,
          category: 'checkout_init',
          statusCode: 400,
          error: 'Valid customer email is required for checkout',
        });
        return NextResponse.json(
          { error: 'Please enter a valid email address to complete checkout.' },
          { status: 400 }
        );
      }

      let profile = dbStore.getProfileByEmail(email);
      let workspace: any;

      if (profile) {
        workspace = dbStore.ensureUserWorkspace(profile.id, profile.displayName);
      } else {
        const created = dbStore.createProfile({
          email,
          displayName: (customerDetails?.name || '').trim() || email.split('@')[0],
          passwordPlainText: crypto.randomBytes(16).toString('hex'),
          role: 'creator',
        });
        profile = created.profile;
        workspace = created.workspace;
      }

      userId = profile.id;
      workspaceId = workspace.id;
      newSessionToken = createSignedSessionToken({
        userId: profile.id,
        email: profile.email,
        role: 'creator',
        workspaceId: workspace.id,
      });
    }

    // 1. Rate Limiting Check (protect against rapid double-clicks & PayU 60s IP lockouts)
    const clientId = getClientIdentifier(req, userId!);
    const rateLimit = checkPaymentRateLimit(clientId);

    if (!rateLimit.allowed) {
      logPaymentEvent({
        requestId,
        category: 'rate_limit',
        statusCode: 429,
        userId: userId!,
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

    const billingDetails = {
      name: customerDetails?.name || current?.user?.displayName || 'Creator',
      email: customerDetails?.email || current?.user?.email || 'creator@fluviaflow.ai',
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
      userId: userId!,
      workspaceId: workspaceId!,
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
      userId: userId!,
      paymentType,
      status: orderResult.order.status,
    });

    const res = NextResponse.json(orderResult, { status: 201 });

    if (newSessionToken) {
      const isHttps = Boolean(requestOrigin && requestOrigin.startsWith('https://'));
      const cookieOpts = {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      };
      res.cookies.set('fluvia_session', newSessionToken, cookieOpts);
      res.cookies.set('vidai_session', newSessionToken, cookieOpts);
    }

    return res;
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
