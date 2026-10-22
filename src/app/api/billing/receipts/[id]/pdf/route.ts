import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { generateReceiptPdf } from '@/lib/documents/pdfGenerator';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const receipt =
      dbStore.getReceiptById(params.id) ||
      dbStore.getReceiptByNumber(params.id);

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    const isOwner = receipt.userId === current.user.id;
    const isWorkspace = receipt.workspaceId === current.workspace.id;
    const isAdmin = current.user.role === 'admin';

    if (!isOwner && !isWorkspace && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this receipt' }, { status: 403 });
    }

    const invoice = receipt.invoiceId ? dbStore.getInvoiceById(receipt.invoiceId) : undefined;
    const pdfBytes = await generateReceiptPdf(receipt, invoice);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Receipt-${receipt.receiptNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('Error rendering receipt PDF:', err);
    return NextResponse.json({ error: err.message || 'Failed to render PDF' }, { status: 500 });
  }
}
