import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({
        authenticated: false,
        hasActiveLicence: false,
        licence: null,
        remainingDays: 0,
        isExpired: false,
        features: [],
      });
    }

    const userId = session.user.id;
    const licence = dbStore.getUserVlabsLicence(userId);

    if (!licence) {
      return NextResponse.json({
        authenticated: true,
        hasActiveLicence: false,
        licence: null,
        remainingDays: 0,
        isExpired: false,
        features: ['preview_mode', 'sample_generation'],
      });
    }

    const now = Date.now();
    const expTime = new Date(licence.expirationDate).getTime();
    const remainingDays = Math.max(0, Math.ceil((expTime - now) / (1000 * 60 * 60 * 24)));
    const isExpired = licence.status === 'expired' || remainingDays === 0;

    return NextResponse.json({
      authenticated: true,
      hasActiveLicence: licence.status === 'active' && !isExpired,
      licence: {
        id: licence.id,
        planId: licence.planId,
        status: isExpired ? 'expired' : licence.status,
        durationMonths: licence.durationMonths,
        purchaseDate: licence.purchaseDate,
        activationDate: licence.activationDate,
        expirationDate: licence.expirationDate,
        productAccess: licence.productAccess,
      },
      remainingDays,
      isExpired,
      features: licence.productAccess || ['studio', 'tts', 'dubbing', 'voice_cloning', 'voice_design', 'voice_library'],
    });
  } catch (err: any) {
    console.error('Error fetching vLabs licence status:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch licence status' },
      { status: 500 }
    );
  }
}
