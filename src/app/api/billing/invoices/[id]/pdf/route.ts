import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { generateInvoicePdf } from '@/lib/documents/pdfGenerator';

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

    const isOwner = invoice.userId === current.user.id;
    const isWorkspace = invoice.workspaceId === current.workspace.id;
    const isAdmin = current.user.role === 'admin';

    if (!isOwner && !isWorkspace && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this invoice' }, { status: 403 });
    }

    const pdfBytes = await generateInvoicePdf(invoice);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('Error rendering invoice PDF:', err);
    return NextResponse.json({ error: err.message || 'Failed to render PDF' }, { status: 500 });
  }
}
