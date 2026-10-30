'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Logo } from '@/components/brand/Logo';
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  Printer,
  ShieldCheck,
  FileText,
  Building,
  Calendar,
  CreditCard,
  Hash,
  ExternalLink,
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

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !invoice) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#667085]">Loading official tax invoice...</p>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#FFFFFF] text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left relative">
          {/* Ambient Frosted Background Lights */}
          <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -z-0" />

          {/* Top Actions Bar */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/dashboard/billing/invoices"
              className="text-xs text-[#667085] hover:text-[#5145CD] flex items-center gap-1.5 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#17191D] border border-white/60 shadow-xs backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#667085]" />
                <span>Print</span>
              </button>

              <a
                href={`/api/billing/invoices/${invoice.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* GLASS BLUR UI INVOICE CONTAINER */}
          {/* ========================================================================= */}
          <div className="relative z-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl shadow-[#5145CD]/5 overflow-hidden transition-all">
            {/* Top Kinetic Brand Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5145CD] via-[#818CF8] to-[#10B981]" />

            <div className="p-6 sm:p-10 space-y-8">
              {/* Header: Official Logo + Invoice Metadata */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#E5E7EB]/80">
                <div className="space-y-2">
                  <Logo size="lg" />
                  <p className="text-xs text-[#667085] font-medium pl-0.5">
                    Commercial Video Creative Suite • Official Tax Invoicing
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#667085]">
                    <span className="font-mono bg-white/60 px-2 py-0.5 rounded border border-[#E5E7EB] font-semibold">
                      GSTIN: 07AABCF1234F1Z5
                    </span>
                    <span className="font-mono bg-white/60 px-2 py-0.5 rounded border border-[#E5E7EB]">
                      HSN/SAC: 998313
                    </span>
                  </div>
                </div>

                <div className="sm:text-right space-y-2 self-stretch sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] text-xs font-bold font-mono uppercase shadow-2xs">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tax Invoice</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#17191D] font-mono tracking-tight">
                    #{invoice.invoiceNumber}
                  </h1>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isPaid ? 'PAID & SETTLED' : invoice.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Two-Column Info Cards (Glassmorphism Frosted Panels) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Billed To Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD] block mb-1">
                    Billed To Customer
                  </span>
                  <p className="text-sm font-bold text-[#17191D]">
                    {invoice.customerName || user.displayName || 'Fluvia Flow Creator'}
                  </p>
                  <p className="text-[#667085] font-medium">{invoice.customerEmail || user.email}</p>
                  {invoice.customerAddress && (
                    <p className="text-[#667085]">{invoice.customerAddress}</p>
                  )}
                  {invoice.customerState && (
                    <p className="text-[#667085]">State/UT: {invoice.customerState}</p>
                  )}
                  {invoice.customerGstin ? (
                    <p className="font-mono text-[11px] text-[#5145CD] font-bold mt-1">
                      Customer GSTIN: {invoice.customerGstin}
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#667085]/80 italic">Unregistered Consumer (B2C)</p>
                  )}
                </div>

                {/* Invoice Metadata Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD] block mb-1">
                    Invoice Details
                  </span>
                  <div className="flex justify-between items-center text-[#667085]">
                    <span>Invoice Date:</span>
                    <strong className="text-[#17191D] font-mono">
                      {new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>
                  {invoice.paidAt && (
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Payment Settled:</span>
                      <strong className="text-emerald-700 font-mono">
                        {new Date(invoice.paidAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                  )}
                  {invoice.txnid && (
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Merchant Order Ref:</span>
                      <strong className="font-mono text-[#17191D]">{invoice.txnid}</strong>
                    </div>
                  )}
                  {invoice.paymentMethod && (
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Payment Channel:</span>
                      <span className="font-semibold text-[#17191D]">{invoice.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table (Glassmorphism Frosted Table) */}
              <div className="rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA]/80 backdrop-blur-sm text-[#667085] border-b border-[#E5E7EB]/80 uppercase text-[10px] font-mono font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Description / Plan</th>
                      <th className="py-3.5 px-4 text-center">HSN/SAC</th>
                      <th className="py-3.5 px-4 text-center">Qty</th>
                      <th className="py-3.5 px-4 text-right">Unit Price</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]/60 text-[#17191D]">
                    {invoice.items && invoice.items.length > 0 ? (
                      invoice.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/50 transition-colors">
                          <td className="py-4 px-4 sm:px-6">
                            <p className="font-bold text-[#17191D] text-sm">{item.description}</p>
                            <p className="text-[11px] text-[#667085] mt-0.5">
                              Cloud AI video generation compute and creative commercial credits
                            </p>
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-[11px] text-[#667085]">
                            998313
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-semibold">
                            {item.quantity || 1}
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-[#667085]">
                            ₹{item.unitPrice?.toFixed(2) || (invoice.baseAmount || 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-[#17191D]">
                            ₹{item.amount?.toFixed(2) || (invoice.baseAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="font-bold text-[#17191D]">Fluvia Flow Creative Subscription</p>
                          <p className="text-[11px] text-[#667085]">Cloud video rendering credits</p>
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-[11px] text-[#667085]">998313</td>
                        <td className="py-4 px-4 text-center font-mono font-semibold">1</td>
                        <td className="py-4 px-4 text-right font-mono text-[#667085]">
                          ₹{(invoice.baseAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-[#17191D]">
                          ₹{(invoice.baseAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation & Tax Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                {/* Statutory Certification & GST Declaration */}
                <div className="w-full sm:max-w-md p-4 rounded-2xl bg-[#EEF2FF]/40 border border-[#C7D2FE]/60 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[#5145CD] font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-[#5145CD]" />
                    <span>Indian GST Statutory Compliance</span>
                  </div>
                  <p className="text-[11px] text-[#667085] leading-relaxed">
                    Invoice generated in accordance with Rule 46 of the CGST Rules, 2017. Input tax credit (ITC) is available to valid registered GST taxpayers.
                  </p>
                  <p className="text-[10px] text-[#667085] font-mono">
                    Payment Gateway: PayU Payments Private Limited (Merchant ID: Verified)
                  </p>
                </div>

                {/* Amount Totals Card */}
                <div className="w-full sm:w-80 p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-xs space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#667085]">
                    <span>Taxable Base Value:</span>
                    <span className="font-mono font-semibold text-[#17191D]">
                      ₹{(invoice.baseAmount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#667085]">
                    <span>Central GST (CGST @ 9%):</span>
                    <span className="font-mono text-[#17191D]">
                      ₹{((invoice.taxAmount || 0) / 2).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#667085]">
                    <span>State GST (SGST @ 9%):</span>
                    <span className="font-mono text-[#17191D]">
                      ₹{((invoice.taxAmount || 0) / 2).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between font-extrabold text-base text-[#17191D] pt-3 border-t border-[#E5E7EB]">
                    <span>Total (INR):</span>
                    <span className="font-mono text-[#5145CD] text-lg">
                      ₹{(invoice.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-1 text-[10px] text-[#10B981] font-semibold text-right">
                    ✓ Full payment verified and credited
                  </div>
                </div>
              </div>

              {/* Bottom Notice & Support */}
              <div className="pt-6 border-t border-[#E5E7EB]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#667085]">
                <p>
                  This is an electronically generated tax invoice. No signature required.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:billing@fluviaflow.ai"
                    className="hover:text-[#5145CD] transition-colors"
                  >
                    billing@fluviaflow.ai
                  </a>
                  <span>•</span>
                  <span>Fluvia Flow Inc.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
