import { NextRequest } from 'next/server';
import crypto from 'crypto';

interface RateLimitRecord {
  timestamps: number[];
  lastRequestTime: number;
}

// In-memory sliding window store for payment initiation
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const expiry = 10 * 60 * 1000; // 10 minutes
    rateLimitMap.forEach((record, key) => {
      if (now - record.lastRequestTime > expiry) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfter: number; // in seconds
  remaining: number;
  errorMessage?: string;
}

export interface RateLimitOptions {
  windowMs?: number; // default: 60,000 ms (60 seconds)
  maxRequests?: number; // default: 5 requests per window
  minIntervalMs?: number; // default: 3,000 ms (minimum delay between requests)
}

/**
 * Extracts a robust client identifier from request (user ID preferred, IP fallback)
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown-client';
  return `ip:${ip}`;
}

/**
 * Checks and updates rate limit for checkout payment initiation.
 * Protects against rapid double-clicks, burst initiation, and PayU IP throttling.
 */
export function checkPaymentRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitCheckResult {
  const windowMs = options.windowMs ?? 60_000; // 60 seconds
  const maxRequests = options.maxRequests ?? 5; // 5 per minute
  const minIntervalMs = options.minIntervalMs ?? 3_000; // 3 seconds between clicks

  const now = Date.now();
  let record = rateLimitMap.get(identifier);

  if (!record) {
    record = { timestamps: [now], lastRequestTime: now };
    rateLimitMap.set(identifier, record);
    return {
      allowed: true,
      retryAfter: 0,
      remaining: maxRequests - 1,
    };
  }

  // 1. Minimum interval check (burst / double-click protection)
  const timeSinceLast = now - record.lastRequestTime;
  if (timeSinceLast < minIntervalMs) {
    const retryAfter = Math.max(1, Math.ceil((minIntervalMs - timeSinceLast) / 1000));
    return {
      allowed: false,
      retryAfter,
      remaining: 0,
      errorMessage: `Please wait ${retryAfter} second(s) before trying again.`,
    };
  }

  // 2. Sliding window check
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      retryAfter,
      remaining: 0,
      errorMessage: `Sorry, we are unable to process your payment due to Too many Requests. Please try after ${retryAfter} seconds.`,
    };
  }

  // Request is allowed - record timestamp
  record.timestamps.push(now);
  record.lastRequestTime = now;
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    retryAfter: 0,
    remaining: maxRequests - record.timestamps.length,
  };
}

/**
 * Reset rate limit for an identifier (useful in tests or when an order succeeds)
 */
export function resetPaymentRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Structured, secret-safe logging for payment lifecycle events
 */
export interface SafePaymentLog {
  requestId: string;
  category: 'checkout_init' | 'callback' | 'verify' | 'webhook' | 'rate_limit';
  statusCode: number;
  durationMs?: number;
  txnid?: string;
  orderId?: string;
  userId?: string;
  paymentType?: string;
  status?: string;
  error?: string;
}

export function logPaymentEvent(event: SafePaymentLog): void {
  // Mask txnid to preserve privacy while maintaining debug traceability
  const safeTxnid = event.txnid ? `${event.txnid.slice(0, 10)}...` : undefined;
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    requestId: event.requestId,
    category: event.category,
    statusCode: event.statusCode,
    durationMs: event.durationMs,
    txnid: safeTxnid,
    orderId: event.orderId,
    userId: event.userId,
    paymentType: event.paymentType,
    status: event.status,
    error: event.error,
  };

  if (event.statusCode >= 400) {
    console.warn(`[Payment] ${JSON.stringify(logEntry)}`);
  } else {
    console.info(`[Payment] ${JSON.stringify(logEntry)}`);
  }
}
