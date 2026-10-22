import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice =
      dbStore.getInvoiceById(params.id) ||
      dbStore.getInvoiceByNumber(params.id);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Verify ownership
    const isOwner = invoice.userId === current.user.id;
    const isWorkspace = invoice.workspaceId === current.workspace.id;
    const isAdmin = current.user.role === 'admin';

    if (!isOwner && !isWorkspace && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this invoice' }, { status: 403 });
    }

    return NextResponse.json({ invoice });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch invoice' }, { status: 500 });
  }
}
