import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const plans = dbStore.getPlans();
    return NextResponse.json({ plans });
  } catch (err: any) {
    console.error('Error fetching admin plans:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { planId, updates } = body;

    if (!planId || !updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'planId and valid updates object are required' }, { status: 400 });
    }

    const sanitizedUpdates: any = {};
    if (updates.name !== undefined) sanitizedUpdates.name = String(updates.name).trim();
    if (updates.description !== undefined) sanitizedUpdates.description = String(updates.description).trim();
    if (updates.priceInr !== undefined) {
      const p = Number(updates.priceInr);
      if (isNaN(p) || p < 0) return NextResponse.json({ error: 'Invalid priceInr' }, { status: 400 });
      sanitizedUpdates.priceInr = p;
    }
    if (updates.priceAnnualInr !== undefined) {
      const p = Number(updates.priceAnnualInr);
      if (isNaN(p) || p < 0) return NextResponse.json({ error: 'Invalid priceAnnualInr' }, { status: 400 });
      sanitizedUpdates.priceAnnualInr = p;
    }
    if (updates.creditsPerPeriod !== undefined) {
      const c = Number(updates.creditsPerPeriod);
      if (isNaN(c) || c < 0) return NextResponse.json({ error: 'Invalid creditsPerPeriod' }, { status: 400 });
      sanitizedUpdates.creditsPerPeriod = c;
    }
    if (updates.badge !== undefined) sanitizedUpdates.badge = updates.badge ? String(updates.badge).trim() : undefined;
    if (updates.isActive !== undefined) sanitizedUpdates.isActive = Boolean(updates.isActive);
    if (updates.entitlements && typeof updates.entitlements === 'object') {
      sanitizedUpdates.entitlements = updates.entitlements;
    }

    const updatedPlan = dbStore.updatePlan(planId, sanitizedUpdates);

    dbStore.logAudit(
      current.user.id,
      'ADMIN_PLAN_UPDATED',
      'plan',
      planId,
      sanitizedUpdates
    );

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
    });
  } catch (err: any) {
    console.error('Error updating plan:', err);
    return NextResponse.json({ error: err.message || 'Failed to update plan' }, { status: 500 });
  }
}
