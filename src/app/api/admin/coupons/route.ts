import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { DiscountType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const coupons = dbStore.getCoupons();
    const redemptions = dbStore.getCouponRedemptions();

    const completedRedemptions = redemptions.filter((r) => r.status === 'completed');
    const totalDiscountAmount = completedRedemptions.reduce((sum, r) => sum + (r.discountAmount || 0), 0);

    const stats = {
      totalCoupons: coupons.length,
      activeCoupons: coupons.filter((c) => c.isActive).length,
      totalRedemptions: completedRedemptions.length,
      totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
    };

    return NextResponse.json({
      coupons,
      redemptions: redemptions.slice(0, 100), // recent 100 redemptions
      stats,
    });
  } catch (err: any) {
    console.error('Error in GET /api/admin/coupons:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minimumOrderValue,
      startsAt,
      expiresAt,
      usageLimit,
      perUserLimit,
      applicableTypes,
      applicableItemIds,
      isActive = true,
    } = body;

    // Validation
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{2,30}$/.test(normalizedCode)) {
      return NextResponse.json(
        { error: 'Coupon code must be 2-30 characters and contain only uppercase letters, numbers, hyphens or underscores.' },
        { status: 400 }
      );
    }

    if (discountType !== 'percentage' && discountType !== 'fixed') {
      return NextResponse.json({ error: 'Discount type must be either percentage or fixed.' }, { status: 400 });
    }

    const val = Number(discountValue);
    if (isNaN(val) || val <= 0) {
      return NextResponse.json({ error: 'Discount value must be greater than zero.' }, { status: 400 });
    }

    if (discountType === 'percentage' && val > 100) {
      return NextResponse.json({ error: 'Percentage discount cannot exceed 100%.' }, { status: 400 });
    }

    const existing = dbStore.getCouponByCode(normalizedCode);
    if (existing) {
      return NextResponse.json({ error: `Coupon code '${normalizedCode}' already exists.` }, { status: 400 });
    }

    const coupon = dbStore.createCoupon({
      code: normalizedCode,
      description: description ? String(description).trim() : undefined,
      discountType: discountType as DiscountType,
      discountValue: val,
      maxDiscount: maxDiscount && Number(maxDiscount) > 0 ? Number(maxDiscount) : undefined,
      minimumOrderValue: minimumOrderValue && Number(minimumOrderValue) > 0 ? Number(minimumOrderValue) : undefined,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      usageLimit: usageLimit && Number(usageLimit) > 0 ? Math.floor(Number(usageLimit)) : undefined,
      perUserLimit: perUserLimit && Number(perUserLimit) > 0 ? Math.floor(Number(perUserLimit)) : undefined,
      applicableTypes: Array.isArray(applicableTypes) && applicableTypes.length > 0 ? applicableTypes : undefined,
      applicableItemIds: Array.isArray(applicableItemIds) && applicableItemIds.length > 0 ? applicableItemIds : undefined,
      isActive: Boolean(isActive),
      createdBy: current.user.id,
    });

    dbStore.logAudit(
      current.user.id,
      'ADMIN_COUPON_CREATED',
      'coupon',
      coupon.id,
      { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue }
    );

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/admin/coupons:', err);
    return NextResponse.json({ error: err.message || 'Failed to create coupon' }, { status: 500 });
  }
}
