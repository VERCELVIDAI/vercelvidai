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

    const packs = dbStore.getCreditPacks();
    return NextResponse.json({ packs });
  } catch (err: any) {
    console.error('Error fetching admin packs:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch packs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { packId, updates } = body;

    if (!packId || !updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'packId and valid updates object are required' }, { status: 400 });
    }

    const sanitizedUpdates: any = {};
    if (updates.name !== undefined) sanitizedUpdates.name = String(updates.name).trim();
    if (updates.priceInr !== undefined) {
      const p = Number(updates.priceInr);
      if (isNaN(p) || p < 0) return NextResponse.json({ error: 'Invalid priceInr' }, { status: 400 });
      sanitizedUpdates.priceInr = p;
    }
    if (updates.creditAmount !== undefined) {
      const c = Number(updates.creditAmount);
      if (isNaN(c) || c < 0) return NextResponse.json({ error: 'Invalid creditAmount' }, { status: 400 });
      sanitizedUpdates.creditAmount = c;
    }
    if (updates.isActive !== undefined) sanitizedUpdates.isActive = Boolean(updates.isActive);

    const updatedPack = dbStore.updateCreditPack(packId, sanitizedUpdates);

    dbStore.logAudit(
      current.user.id,
      'ADMIN_CREDIT_PACK_UPDATED',
      'credit_pack',
      packId,
      sanitizedUpdates
    );

    return NextResponse.json({
      success: true,
      pack: updatedPack,
    });
  } catch (err: any) {
    console.error('Error updating credit pack:', err);
    return NextResponse.json({ error: err.message || 'Failed to update credit pack' }, { status: 500 });
  }
}
