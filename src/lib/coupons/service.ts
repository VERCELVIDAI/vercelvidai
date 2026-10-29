import { dbStore } from '@/lib/db/store';
import { calculateGstBreakdown } from '@/lib/payments/payu';
import { Coupon, CouponValidationResult } from '@/lib/types';

export interface ValidateCouponParams {
  code: string;
  userId?: string;
  paymentType: 'subscription' | 'credit_pack';
  itemPlanOrPackId: string;
  billingInterval?: 'month' | 'year';
  customerState?: string;
}

/**
 * Validates a coupon code strictly on the server against trusted pricing and database state.
 * Performs decimal-safe calculations and tax breakdown.
 */
export function validateCoupon(params: ValidateCouponParams): CouponValidationResult {
  const normalizedCode = (params.code || '').trim().toUpperCase();

  if (!normalizedCode) {
    return { valid: false, error: 'Please enter a valid coupon code.' };
  }

  // 1. Resolve trusted product / plan pricing
  let basePrice = 0;
  let productName = '';

  if (params.paymentType === 'credit_pack') {
    const pack = dbStore.getCreditPacks().find((p) => p.id === params.itemPlanOrPackId);
    if (!pack) {
      return { valid: false, error: 'Invalid credit package selected.' };
    }
    basePrice = pack.priceInr;
    productName = pack.name;
  } else if (params.paymentType === 'subscription') {
    const plan =
      dbStore.getPlans().find((p) => p.id === params.itemPlanOrPackId) ||
      dbStore.getPlanById(params.itemPlanOrPackId);
    if (!plan) {
      return { valid: false, error: 'Invalid subscription plan selected.' };
    }

    const isAnnual = params.billingInterval === 'year';
    if (isAnnual) {
      const monthlyRate = plan.priceAnnualInr || Math.round(plan.priceInr * 0.8);
      basePrice = monthlyRate * 12;
    } else {
      basePrice = plan.priceInr;
    }
    productName = plan.name;
  } else {
    return { valid: false, error: 'Unsupported checkout payment type.' };
  }

  // 2. Lookup coupon
  const coupon = dbStore.getCouponByCode(normalizedCode);
  if (!coupon) {
    return { valid: false, error: 'Coupon code is invalid or does not exist.' };
  }

  // 3. Status check
  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is currently disabled.' };
  }

  // 4. Time restrictions
  const now = Date.now();
  if (coupon.startsAt) {
    const startsTime = new Date(coupon.startsAt).getTime();
    if (!isNaN(startsTime) && startsTime > now) {
      return { valid: false, error: 'This coupon promotion has not started yet.' };
    }
  }

  if (coupon.expiresAt) {
    const expiresTime = new Date(coupon.expiresAt).getTime();
    if (!isNaN(expiresTime) && expiresTime < now) {
      return { valid: false, error: 'This coupon has expired.' };
    }
  }

  // 5. Minimum Order Value
  if (coupon.minimumOrderValue && coupon.minimumOrderValue > 0) {
    if (basePrice < coupon.minimumOrderValue) {
      return {
        valid: false,
        error: `Minimum order value of INR ${coupon.minimumOrderValue.toLocaleString('en-IN')} is required for coupon ${coupon.code}.`,
      };
    }
  }

  // 6. Applicable Checkout Types & Item Restrictions
  if (normalizedCode === 'FIRST20') {
    if (params.paymentType !== 'subscription' || params.itemPlanOrPackId !== 'plan_max') {
      return {
        valid: false,
        error: 'Coupon FIRST20 is valid on FLUVIA MAX only.',
      };
    }
  }

  if (coupon.applicableTypes && coupon.applicableTypes.length > 0) {
    if (!coupon.applicableTypes.includes(params.paymentType)) {
      const label = params.paymentType === 'subscription' ? 'subscriptions' : 'credit packs';
      return {
        valid: false,
        error: `Coupon ${coupon.code} is not valid for ${label}.`,
      };
    }
  }

  // 7. Applicable Specific Item IDs
  if (coupon.applicableItemIds && coupon.applicableItemIds.length > 0) {
    if (!coupon.applicableItemIds.includes(params.itemPlanOrPackId)) {
      if (normalizedCode === 'FIRST20') {
        return {
          valid: false,
          error: 'Coupon FIRST20 is valid on FLUVIA MAX only.',
        };
      }
      return {
        valid: false,
        error: `Coupon ${coupon.code} cannot be applied to the selected plan or pack.`,
      };
    }
  }

  // 8. Global Usage Limit
  const completedRedemptions = dbStore
    .getCouponRedemptions(coupon.id)
    .filter((r) => r.status === 'completed');
  const currentUsage = Math.max(coupon.usageCount || 0, completedRedemptions.length);

  if (coupon.usageLimit && coupon.usageLimit > 0) {
    if (currentUsage >= coupon.usageLimit) {
      return {
        valid: false,
        error: 'This coupon has reached its maximum global redemption limit.',
      };
    }
  }

  // 9. Per-User Usage Limit
  if (coupon.perUserLimit && coupon.perUserLimit > 0 && params.userId) {
    const userCompleted = dbStore
      .getUserCouponRedemptions(params.userId, coupon.id)
      .filter((r) => r.status === 'completed');
    if (userCompleted.length >= coupon.perUserLimit) {
      return {
        valid: false,
        error: `You have already redeemed coupon ${coupon.code} the maximum allowed times (${coupon.perUserLimit}).`,
      };
    }
  }

  // 10. Discount Calculation (Decimal-safe currency arithmetic)
  let calculatedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    calculatedDiscount = (basePrice * coupon.discountValue) / 100;
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
    }
  } else if (coupon.discountType === 'fixed') {
    calculatedDiscount = coupon.discountValue;
  }

  // Discount can never exceed subtotal, and must be non-negative
  const discountAmount = Math.min(basePrice, Math.max(0, Math.round(calculatedDiscount * 100) / 100));
  const discountedBaseAmount = Math.max(0, Math.round((basePrice - discountAmount) * 100) / 100);

  // 11. Zero Payable flow check
  if (discountedBaseAmount === 0) {
    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minimumOrderValue: coupon.minimumOrderValue,
      },
      pricing: {
        originalBaseAmount: basePrice,
        discountAmount,
        discountedBaseAmount: 0,
        taxRate: 18,
        taxAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalAmount: 0,
        isInterState: false,
        isZeroPayable: true,
      },
    };
  }

  // 12. Standard GST Tax Calculation on Discounted Base
  const taxBreakdown = calculateGstBreakdown(discountedBaseAmount, params.customerState);
  const totalAmount = Math.round((discountedBaseAmount + taxBreakdown.taxAmount) * 100) / 100;

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minimumOrderValue: coupon.minimumOrderValue,
    },
    pricing: {
      originalBaseAmount: basePrice,
      discountAmount,
      discountedBaseAmount,
      taxRate: taxBreakdown.taxRate,
      taxAmount: taxBreakdown.taxAmount,
      cgstAmount: taxBreakdown.cgstAmount,
      sgstAmount: taxBreakdown.sgstAmount,
      igstAmount: taxBreakdown.igstAmount,
      totalAmount,
      isInterState: taxBreakdown.isInterState,
      isZeroPayable: totalAmount === 0,
    },
  };
}
