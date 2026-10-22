import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { DiscountType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const existing = dbStore.getCouponById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });
    }

    const body = await req.json();
    const updates: any = {};

    if (body.code !== undefined) {
      const normalizedCode = String(body.code).trim().toUpperCase();
      if (!/^[A-Z0-9_-]{2,30}$/.test(normalizedCode)) {
        return NextResponse.json(
          { error: 'Coupon code must be 2-30 alphanumeric characters, hyphens or underscores.' },
          { status: 400 }
        );
      }
      updates.code = normalizedCode;
    }

    if (body.description !== undefined) {
      updates.description = String(body.description).trim();
    }

    if (body.discountType !== undefined) {
      if (body.discountType !== 'percentage' && body.discountType !== 'fixed') {
        return NextResponse.json({ error: 'Discount type must be percentage or fixed.' }, { status: 400 });
      }
      updates.discountType = body.discountType as DiscountType;
    }

    if (body.discountValue !== undefined) {
      const val = Number(body.discountValue);
      if (isNaN(val) || val <= 0) {
        return NextResponse.json({ error: 'Discount value must be greater than zero.' }, { status: 400 });
      }
      const type = updates.discountType || existing.discountType;
      if (type === 'percentage' && val > 100) {
        return NextResponse.json({ error: 'Percentage discount cannot exceed 100%.' }, { status: 400 });
      }
      updates.discountValue = val;
    }

    if (body.maxDiscount !== undefined) {
      updates.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : undefined;
    }

    if (body.minimumOrderValue !== undefined) {
      updates.minimumOrderValue = body.minimumOrderValue ? Number(body.minimumOrderValue) : undefined;
    }

    if (body.startsAt !== undefined) {
      updates.startsAt = body.startsAt ? new Date(body.startsAt).toISOString() : undefined;
    }

    if (body.expiresAt !== undefined) {
      updates.expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : undefined;
    }

    if (body.usageLimit !== undefined) {
      updates.usageLimit = body.usageLimit ? Math.floor(Number(body.usageLimit)) : undefined;
    }

    if (body.perUserLimit !== undefined) {
      updates.perUserLimit = body.perUserLimit ? Math.floor(Number(body.perUserLimit)) : undefined;
    }

    if (body.applicableTypes !== undefined) {
      updates.applicableTypes = Array.isArray(body.applicableTypes) && body.applicableTypes.length > 0 ? body.applicableTypes : undefined;
    }

    if (body.applicableItemIds !== undefined) {
      updates.applicableItemIds = Array.isArray(body.applicableItemIds) && body.applicableItemIds.length > 0 ? body.applicableItemIds : undefined;
    }

    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

    const updated = dbStore.updateCoupon(id, updates);

    dbStore.logAudit(
      current.user.id,
      'ADMIN_COUPON_UPDATED',
      'coupon',
      id,
      { updates }
    );

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err: any) {
    console.error('Error in PUT /api/admin/coupons/[id]:', err);
    return NextResponse.json({ error: err.message || 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const existing = dbStore.getCouponById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });
    }

    const success = dbStore.deleteCoupon(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete coupon.' }, { status: 500 });
    }

    dbStore.logAudit(
      current.user.id,
      'ADMIN_COUPON_DELETED',
      'coupon',
      id,
      { code: existing.code }
    );

    return NextResponse.json({ success: true, message: `Coupon ${existing.code} deleted successfully.` });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/coupons/[id]:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete coupon' }, { status: 500 });
  }
}
