'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Download,
  ArrowLeft,
} from 'lucide-react';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch(`/api/billing/invoices/${params.id}`),
    ])
      .then(async ([authRes, invRes]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (invRes.ok) {
          const invData = await invRes.json();
          setInvoice(invData.invoice);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [params.id, router]);

  if (isLoading || !invoice) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/dashboard/billing/invoices"
              className="text-xs text-[#667085] hover:text-[#17191D] flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>

            <a
              href={`/api/billing/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </a>
          </div>

          {/* Visual Invoice Paper Container */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 space-y-8 border border-[#E5E7EB] shadow-sm">
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xl font-black text-[#17191D] tracking-tight">
                  FLUVIA <span className="text-[#5145CD]">FLOW</span>
                </span>
                <p className="text-xs text-[#667085] mt-0.5">AI Ad Creation Studio</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase font-semibold text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-md border border-[#5145CD]/20">
                  Official Tax Invoice
                </span>
                <p className="text-xs font-mono text-[#667085] mt-2">#{invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Bill To & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#667085]">
              <div>
                <span className="font-semibold text-[#17191D] uppercase text-[10px] tracking-wider block mb-1">
                  Billed To
                </span>
                <p className="font-medium text-[#17191D]">{invoice.customerName || user.displayName}</p>
                <p>{invoice.customerEmail || user.email}</p>
                {invoice.customerAddress && <p>{invoice.customerAddress}</p>}
                {invoice.customerGstin && <p className="font-mono mt-1">GSTIN: {invoice.customerGstin}</p>}
              </div>

              <div className="sm:text-right space-y-1">
                <div>
                  <span className="font-semibold text-[#17191D]">Issue Date:</span>{' '}
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold text-[#17191D]">Status:</span>{' '}
                  <span className="uppercase font-mono font-bold text-emerald-600">{invoice.status}</span>
                </div>
                {invoice.paidAt && (
                  <div>
                    <span className="font-semibold text-[#17191D]">Settled:</span>{' '}
                    {new Date(invoice.paidAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                  {invoice.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium">{item.description}</td>
                      <td className="p-3 text-right font-mono">{item.quantity || 1}</td>
                      <td className="p-3 text-right font-mono">INR {item.unitPrice?.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-semibold">INR {item.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-full sm:w-72 space-y-2 border-t border-[#E5E7EB] pt-4">
                <div className="flex justify-between text-[#667085]">
                  <span>Subtotal</span>
                  <span className="font-mono">INR {invoice.baseAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#667085]">
                  <span>GST (18%)</span>
                  <span className="font-mono">INR {invoice.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#17191D] pt-2 border-t border-[#E5E7EB]">
                  <span>Total Paid</span>
                  <span className="font-mono text-[#5145CD]">INR {invoice.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}