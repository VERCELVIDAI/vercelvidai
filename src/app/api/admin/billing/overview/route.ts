import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { getPayUConfig } from '@/lib/payments/payu';

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase() || '';

    let orders = dbStore.getAllPayUOrders();
    const invoices = dbStore.getAllInvoices();
    const receipts = dbStore.getAllReceipts();

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.txnid.toLowerCase().includes(search) ||
          o.customerDetails.email.toLowerCase().includes(search) ||
          o.customerDetails.name.toLowerCase().includes(search) ||
          o.productInfo.toLowerCase().includes(search)
      );
    }

    // CSV export
    if (format === 'csv') {
      const headers = [
        'Order ID',
        'Merchant Txn ID',
        'Customer Name',
        'Customer Email',
        'Customer State',
        'Product',
        'Base Amount (INR)',
        'Tax Amount (INR)',
        'Total Amount (INR)',
        'Status',
        'PayU Mihpayid',
        'Bank Ref Num',
        'Invoice Number',
        'Receipt Number',
        'Created At',
      ];

      const rows = orders.map((o) => [
        o.id,
        o.txnid,
        `"${o.customerDetails.name.replace(/"/g, '""')}"`,
        o.customerDetails.email,
        o.customerDetails.state || 'N/A',
        `"${o.productInfo.replace(/"/g, '""')}"`,
        o.baseAmount.toFixed(2),
        o.taxAmount.toFixed(2),
        o.totalAmount.toFixed(2),
        o.status,
        o.payuMihpayid || '',
        o.payuBankRefNum || '',
        o.invoiceNumber || '',
        o.receiptNumber || '',
        o.createdAt,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="FluviaFlow_Transactions_${Date.now()}.csv"`,
        },
      });
    }

    // Financial Metrics
    const successfulOrders = orders.filter((o) => o.status === 'success');
    const totalGrossRevenueInr = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalTaxCollectedInr = successfulOrders.reduce((sum, o) => sum + o.taxAmount, 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'created');
    const failedOrders = orders.filter((o) => o.status === 'failed' || o.status === 'cancelled');

    const supplierSettings = dbStore.getBillingSettings();
    const payuConfig = getPayUConfig();

    return NextResponse.json({
      metrics: {
        totalOrders: orders.length,
        successfulOrders: successfulOrders.length,
        pendingOrders: pendingOrders.length,
        failedOrders: failedOrders.length,
        totalGrossRevenueInr: Math.round(totalGrossRevenueInr * 100) / 100,
        totalTaxCollectedInr: Math.round(totalTaxCollectedInr * 100) / 100,
        totalInvoicesIssued: invoices.length,
        totalReceiptsIssued: receipts.length,
      },
      orders,
      invoices: invoices.slice(0, 10),
      receipts: receipts.slice(0, 10),
      supplierSettings,
      payuIntegration: {
        provider: 'PayU India Hosted Checkout',
        env: payuConfig.env,
        paymentUrl: payuConfig.paymentUrl,
        merchantKeyMasked: payuConfig.merchantKey ? payuConfig.merchantKey.slice(0, 2) + '••••' + payuConfig.merchantKey.slice(-2) : 'Not Configured',
        saltConfigured: !!payuConfig.merchantSalt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Admin billing overview failed' }, { status: 500 });
  }
}
