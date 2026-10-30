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

    const billingSettings = dbStore.getBillingSettings();
    const plans = dbStore.getPlans();
    const creditPacks = dbStore.getCreditPacks();

    return NextResponse.json({
      billingSettings,
      plans,
      creditPacks,
    });
  } catch (err: any) {
    console.error('Error fetching admin billing settings:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 });
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
      legalName,
      tradeName,
      registeredAddress,
      city,
      state,
      pincode,
      gstin,
      isGstRegistered,
      supportEmail,
      supportPhone,
      pan,
      brandLogoUrl,
      invoicePrefix,
      receiptPrefix,
      taxRatePercent,
      footerNotes,
      terms,
    } = body;

    const updates: any = {};
    if (legalName !== undefined) updates.legalName = String(legalName).trim();
    if (tradeName !== undefined) updates.tradeName = String(tradeName).trim();
    if (registeredAddress !== undefined) updates.registeredAddress = String(registeredAddress).trim();
    if (city !== undefined) updates.city = String(city).trim();
    if (state !== undefined) updates.state = String(state).trim();
    if (pincode !== undefined) updates.pincode = String(pincode).trim();
    if (gstin !== undefined) updates.gstin = String(gstin).trim().toUpperCase();
    if (isGstRegistered !== undefined) updates.isGstRegistered = Boolean(isGstRegistered);
    if (supportEmail !== undefined) updates.supportEmail = String(supportEmail).trim();
    if (supportPhone !== undefined) updates.supportPhone = String(supportPhone).trim();
    if (pan !== undefined) updates.pan = String(pan).trim().toUpperCase();
    if (brandLogoUrl !== undefined) updates.brandLogoUrl = String(brandLogoUrl).trim();
    if (invoicePrefix !== undefined) updates.invoicePrefix = String(invoicePrefix).trim().toUpperCase();
    if (receiptPrefix !== undefined) updates.receiptPrefix = String(receiptPrefix).trim().toUpperCase();
    if (taxRatePercent !== undefined) updates.taxRatePercent = Number(taxRatePercent);
    if (footerNotes !== undefined) updates.footerNotes = String(footerNotes).trim();
    if (terms !== undefined) updates.terms = String(terms).trim();

    const updated = dbStore.updateBillingSettings(updates);

    dbStore.logAudit(
      current.user.id,
      'ADMIN_BILLING_SETTINGS_UPDATED',
      'billing_settings',
      'supplier_config',
      updates
    );

    return NextResponse.json({
      success: true,
      billingSettings: updated,
    });
  } catch (err: any) {
    console.error('Error updating admin billing settings:', err);
    return NextResponse.json({ error: err.message || 'Failed to update billing settings' }, { status: 500 });
  }
}
