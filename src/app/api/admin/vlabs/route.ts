import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
    }

    const licences = dbStore.getVlabsLicences();
    const profiles = dbStore.getProfiles();
    const settings = dbStore.getVlabsSettings();
    const orders = dbStore.getPayUOrders();

    // Map licences with user details
    const enrichedLicences = licences.map((lic) => {
      const profile = profiles.find((p) => p.id === lic.userId);
      const order = orders.find((o) => o.id === lic.orderId || o.txnid === lic.txnid);
      return {
        ...lic,
        userEmail: profile?.email || 'Unknown',
        userName: profile?.displayName || 'User',
        amountInr: order?.totalAmount || (lic.planId === 'vlabs_1yr' ? 35988 : lic.planId === 'vlabs_2yr' ? 47976 : 107940),
      };
    });

    const activeCount = enrichedLicences.filter((l) => l.status === 'active').length;
    const expiredCount = enrichedLicences.filter((l) => l.status === 'expired').length;
    const totalRevenueInr = enrichedLicences
      .filter((l) => l.paymentStatus === 'success')
      .reduce((acc, curr) => acc + (curr.amountInr || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalLicences: enrichedLicences.length,
        activeCount,
        expiredCount,
        totalRevenueInr,
      },
      licences: enrichedLicences,
      settings,
    });
  } catch (err: any) {
    console.error('Admin vLabs API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch admin vLabs data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
    }

    const body = await req.json();
    const { action, licenceId, statusUpdates, settingsUpdates } = body;

    if (action === 'update_settings' && settingsUpdates) {
      const updated = dbStore.updateVlabsSettings(settingsUpdates);
      return NextResponse.json({ success: true, settings: updated });
    }

    if (action === 'update_licence' && licenceId && statusUpdates) {
      const updated = dbStore.updateVlabsLicence(licenceId, statusUpdates);
      return NextResponse.json({ success: true, licence: updated });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin vLabs update error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update vLabs settings' }, { status: 500 });
  }
}
