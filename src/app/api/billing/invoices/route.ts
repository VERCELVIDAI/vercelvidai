import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';

    let invoices = dbStore.getInvoices(current.user.id, current.workspace.id);

    if (status && status !== 'all') {
      invoices = invoices.filter((i) => i.status === status);
    }

    if (search) {
      invoices = invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(search) ||
          i.txnid.toLowerCase().includes(search) ||
          i.customer.name.toLowerCase().includes(search) ||
          i.customer.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ invoices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list invoices' }, { status: 500 });
  }
}
