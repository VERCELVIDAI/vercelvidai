'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Logo } from '@/components/brand/Logo';
import { LiquidGlassCard } from '@/components/billing/LiquidGlassCard';
import { BillingDocumentSkeleton } from '@/components/billing/BillingDocumentSkeleton';
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
  Copy,
  Check,
  Sparkles,
  Receipt as ReceiptIcon,
} from 'lucide-react';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading || !invoice) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex flex-col md:flex-row">
        <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
          <BillingDocumentSkeleton type="invoice" />
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isPaid = invoice.status === 'paid';
  const isRefunded = invoice.status === 'refunded';
  const isPending = invoice.status === 'pending';

  const supplier = invoice.supplier || {
    legalName: 'Fluvia Flow Technologies Private Limited',
    tradeName: 'Fluvia Flow',
    registeredAddress: 'Level 4, Horizon Creative Hub, Connaught Place, New Delhi 110001',
    state: 'Delhi',
    gstin: '07AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    supportEmail: 'billing@fluviaflow.ai',
    website: 'https://fluviaflow.ai',
  };

  const customer = invoice.customer || {
    name: invoice.customerName || user.displayName || 'Fluvia Flow Creator',
    email: invoice.customerEmail || user.email || 'creator@fluviaflow.ai',
    address: invoice.customerAddress || 'Registered Cloud Creator Workspace',
    state: invoice.customerState || 'Delhi',
    gstin: invoice.customerGstin,
  };

  const originalAmount = invoice.originalBaseAmount || invoice.baseAmount || 0;
  const discountAmount = invoice.discountAmount || 0;
  const taxableAmount = invoice.baseAmount || (originalAmount - discountAmount);
  const taxAmount = invoice.taxAmount || 0;
  const totalAmount = invoice.totalAmount || (taxableAmount + taxAmount);

  // Determine CGST + SGST vs IGST
  const isIntraState = !customer.state || customer.state.toLowerCase() === supplier.state.toLowerCase();
  const cgst = isIntraState ? taxAmount / 2 : 0;
  const sgst = isIntraState ? taxAmount / 2 : 0;
  const igst = !isIntraState ? taxAmount : 0;

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#FFFFFF] text-[#17191D] relative">
      {/* Sidebar hidden during print */}
      <div className="no-print">
        <Sidebar userRole={user.role} credits={credits} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-8">
        <div className="no-print">
          <DashboardHeader
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
            role={user.role}
            credits={credits.availableBalance}
            workspaceName={data?.workspace?.name}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left relative">
          {/* Ambient Frosted Background Lights */}
          <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0 no-print" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-0 no-print" />

          {/* Top Actions Bar (Hidden during print) */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4 no-print">
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
                className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#17191D] border border-white/80 shadow-2xs backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
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
          {/* LIQUID GLASS INTERACTIVE INVOICE CONTAINER */}
          {/* ========================================================================= */}
          <LiquidGlassCard
            interactive={true}
            tiltMax={3}
            className="print-clean"
          >
            {/* Top Kinetic Brand Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5145CD] via-[#818CF8] to-[#10B981]" />

            <div className="p-6 sm:p-10 space-y-8">
              {/* Header: Official Logo + Invoice Metadata */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#E5E7EB]/80">
                <div className="space-y-2">
                  <Logo size="lg" />
                  <p className="text-xs text-[#667085] font-medium pl-0.5">
                    Creative Generative Platform • Digital Tax Invoicing
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#667085]">
                    <span className="font-mono bg-white/70 px-2 py-0.5 rounded-md border border-[#E5E7EB] font-semibold text-[#17191D]">
                      GSTIN: {supplier.gstin || '07AAAAA0000A1Z5'}
                    </span>
                    <span className="font-mono bg-white/70 px-2 py-0.5 rounded-md border border-[#E5E7EB] text-[#667085]">
                      SAC: 998314
                    </span>
                    <span className="font-mono bg-white/70 px-2 py-0.5 rounded-md border border-[#E5E7EB] text-[#667085]">
                      PAN: {supplier.pan || 'AAAAA0000A'}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right space-y-2 self-stretch sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] text-xs font-bold font-mono uppercase tracking-wide shadow-2xs">
                    <FileText className="w-3.5 h-3.5" />
                    <span>TAX INVOICE</span>
                  </div>

                  <div className="flex sm:justify-end items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#17191D] font-mono tracking-tight">
                      #{invoice.invoiceNumber}
                    </h1>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(invoice.invoiceNumber, 'invNum')}
                      className="p-1 rounded-md text-[#667085] hover:text-[#5145CD] hover:bg-white/80 transition-colors"
                      title="Copy Invoice Number"
                    >
                      {copiedField === 'invNum' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isRefunded
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isPaid ? 'PAID & SETTLED' : isRefunded ? 'REFUNDED' : invoice.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Two-Column Info Cards (Glassmorphism Frosted Panels) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Billed By Card (Supplier Legal Entity) */}
                <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD] flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>Billed By (Supplier)</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#667085]">ORIGIN: {supplier.state || 'DELHI'}</span>
                  </div>
                  <p className="text-sm font-bold text-[#17191D]">{supplier.legalName}</p>
                  <p className="text-[#667085] leading-relaxed">{supplier.registeredAddress}</p>
                  <div className="pt-1 space-y-0.5 text-[#667085]">
                    <p>State: <strong className="text-[#17191D]">{supplier.state} (Code 07)</strong></p>
                    <p>Email: <strong className="text-[#17191D]">{supplier.supportEmail}</strong></p>
                    <p>Website: <strong className="text-[#5145CD]">{supplier.website || 'fluviaflow.ai'}</strong></p>
                  </div>
                </div>

                {/* Billed To Card (Customer Details) */}
                <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Billed To (Customer)</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#667085]">
                      POS: {customer.state || supplier.state || 'DELHI'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#17191D]">{customer.name}</p>
                  <p className="text-[#667085]">{customer.email}</p>
                  <p className="text-[#667085] leading-relaxed">{customer.address}</p>
                  <div className="pt-1">
                    {customer.gstin ? (
                      <p className="font-mono text-[11px] text-[#5145CD] font-bold">
                        Customer GSTIN: {customer.gstin}
                      </p>
                    ) : (
                      <span className="inline-block text-[10px] font-mono font-medium text-[#667085] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        Consumer / Unregistered B2C
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Metadata Row (Dates & Payment Channels) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] block font-semibold">Issue Date</span>
                  <strong className="text-[#17191D] font-mono text-xs">
                    {new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block font-semibold">Payment Status</span>
                  <strong className="text-emerald-700 font-mono text-xs">
                    {isPaid ? 'Settled via PayU' : invoice.status}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block font-semibold">Order ID</span>
                  <strong className="font-mono text-[#17191D] text-xs truncate block" title={invoice.orderId || invoice.txnid}>
                    {(invoice.orderId || invoice.txnid || 'N/A').slice(0, 16)}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block font-semibold">Payment Method</span>
                  <strong className="text-[#17191D] text-xs">
                    {invoice.paymentMethod || 'PayU India Gateway'}
                  </strong>
                </div>
              </div>

              {/* Items Breakdown Table (Frosted Glass Table) */}
              <div className="rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA]/80 backdrop-blur-xs text-[#667085] border-b border-[#E5E7EB]/80 uppercase text-[10px] font-mono font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Description / Plan</th>
                      <th className="py-3.5 px-4 text-center">SAC Code</th>
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
                              Cloud AI video compute and creative generative tokens
                            </p>
                            {invoice.couponCode && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono font-bold text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#C7D2FE]">
                                <Sparkles className="w-3 h-3" />
                                <span>Coupon Applied: {invoice.couponCode}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-[11px] text-[#667085]">
                            {item.hsnSacCode || '998314'}
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-semibold">
                            {item.quantity || 1}
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-[#667085]">
                            ₹{Number(item.unitPrice || originalAmount).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-[#17191D]">
                            ₹{Number(item.taxableValue || taxableAmount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="font-bold text-[#17191D]">Fluvia Flow Generative Credits</p>
                          <p className="text-[11px] text-[#667085]">Cloud AI video compute tokens</p>
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-[11px] text-[#667085]">998314</td>
                        <td className="py-4 px-4 text-center font-mono font-semibold">1</td>
                        <td className="py-4 px-4 text-right font-mono text-[#667085]">
                          ₹{Number(taxableAmount).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-[#17191D]">
                          ₹{Number(taxableAmount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Calculation & Tax Summary Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                {/* Statutory Certification & GST Declaration Box */}
                <div className="w-full sm:max-w-md p-5 rounded-2xl bg-[#EEF2FF]/40 border border-[#C7D2FE]/60 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#5145CD] font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-[#5145CD]" />
                    <span>Indian GST Statutory Tax Compliance</span>
                  </div>
                  <p className="text-[11px] text-[#667085] leading-relaxed">
                    Tax invoice issued under Section 31 of the CGST Act, 2017 read with Rule 46 of the CGST Rules, 2017. Input Tax Credit (ITC) eligible for verified business GST registrations.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-[#667085]">
                    <span className="bg-white/80 px-2 py-0.5 rounded border border-[#C7D2FE]/60 font-semibold text-[#17191D]">
                      Place of Supply: {customer.state || supplier.state || 'Delhi'}
                    </span>
                    <span className="bg-white/80 px-2 py-0.5 rounded border border-[#C7D2FE]/60">
                      HSN/SAC: 998314
                    </span>
                  </div>
                </div>

                {/* Amount Totals Card (Frosted 3D Glass) */}
                <div className="w-full sm:w-88 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-md shadow-[#5145CD]/5 space-y-2.5 text-xs">
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#667085]">
                      <span>Original Subtotal:</span>
                      <span className="font-mono text-[#667085] line-through">
                        ₹{Number(originalAmount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({invoice.couponCode || 'Promo'}):</span>
                      <span className="font-mono">-₹{Number(discountAmount).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#667085]">
                    <span>Taxable Base Value:</span>
                    <span className="font-mono font-semibold text-[#17191D]">
                      ₹{Number(taxableAmount).toFixed(2)}
                    </span>
                  </div>

                  {isIntraState ? (
                    <>
                      <div className="flex justify-between text-[#667085]">
                        <span>Central GST (CGST @ 9%):</span>
                        <span className="font-mono text-[#17191D]">₹{Number(cgst).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#667085]">
                        <span>State GST (SGST @ 9%):</span>
                        <span className="font-mono text-[#17191D]">₹{Number(sgst).toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[#667085]">
                      <span>Integrated GST (IGST @ 18%):</span>
                      <span className="font-mono text-[#17191D]">₹{Number(igst).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline font-black text-[#17191D] pt-3 border-t border-[#E5E7EB]">
                    <div>
                      <span className="text-sm">Total Amount Paid</span>
                      <span className="block text-[10px] text-[#667085] font-normal">Inclusive of all applicable taxes</span>
                    </div>
                    <span className="font-mono text-[#5145CD] text-2xl font-black">
                      ₹{Number(totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] border-t border-[#E5E7EB]/60">
                    <span className="text-[#667085]">Payment Method:</span>
                    <strong className="text-[#17191D]">{invoice.paymentMethod || 'PayU India Gateway'}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Notice, Legal, and Brand Signature */}
              <div className="pt-6 border-t border-[#E5E7EB]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#667085]">
                <p>
                  Thank you for creating with Fluvia Flow. This is a computer-generated tax invoice.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:billing@fluviaflow.ai"
                    className="hover:text-[#5145CD] transition-colors font-semibold"
                  >
                    billing@fluviaflow.ai
                  </a>
                  <span>•</span>
                  <a
                    href="https://fluviaflow.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#5145CD] transition-colors"
                  >
                    fluviaflow.ai
                  </a>
                  <span>•</span>
                  <span className="font-semibold text-[#17191D]">Fluvia Flow Inc.</span>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </main>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-clean {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
