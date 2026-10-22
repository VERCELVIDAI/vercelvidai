'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  FileText,
  Download,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Receipt,
  Printer,
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isInterState = invoice.customer.state !== invoice.supplier.state;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/billing/invoices"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={`/api/billing/invoices/${invoice.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </a>
            </div>
          </div>

          {/* Visual Invoice Paper Container */}
          <div className="bg-[#12141C] border border-white/10 rounded-2xl p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  VERCEL <span className="text-violet-400">VIDAI</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">AI Video Creative Infrastructure</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase font-bold text-violet-400 bg-violet-950/60 px-3 py-1 rounded-md border border-violet-500/30">
                  {invoice.supplier.isGstRegistered ? 'GST Tax Invoice' : 'Commercial Invoice'}
                </span>
                <h1 className="text-xl font-black text-white mt-2 font-mono">{invoice.invoiceNumber}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Issued: {new Date(invoice.issueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>

            {/* Supplier and Customer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Supplier Details</span>
                <h3 className="font-bold text-white text-sm">{invoice.supplier.legalName}</h3>
                <p className="text-slate-400 leading-relaxed">{invoice.supplier.registeredAddress}</p>
                <p className="text-slate-400">State: {invoice.supplier.state}</p>
                {invoice.supplier.gstin && (
                  <p className="font-mono text-slate-300">GSTIN: {invoice.supplier.gstin}</p>
                )}
                <p className="text-slate-400">Email: {invoice.supplier.supportEmail}</p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Billed To</span>
                <h3 className="font-bold text-white text-sm">{invoice.customer.name}</h3>
                <p className="text-slate-400">{invoice.customer.email}</p>
                {invoice.customer.address && <p className="text-slate-400">{invoice.customer.address}</p>}
                <p className="text-slate-400">Place of Supply: {invoice.customer.state || 'Delhi'}</p>
                {invoice.customer.gstin && (
                  <p className="font-mono text-emerald-400 font-bold">GSTIN: {invoice.customer.gstin}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/5 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4">SAC Code</th>
                    <th className="py-3 px-4">Taxable Value</th>
                    <th className="py-3 px-4">GST Rate</th>
                    <th className="py-3 px-4 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {invoice.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-bold text-white">{item.description}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.hsnSacCode}</td>
                      <td className="py-3 px-4 font-mono">INR {item.taxableValue.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono">{item.gstRate}%</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        INR {item.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Calculation & Summary Box */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Taxable Value:</span>
                  <span className="font-mono text-white">INR {invoice.baseAmount.toFixed(2)}</span>
                </div>

                {invoice.cgstAmount > 0 ? (
                  <>
                    <div className="flex justify-between text-slate-400">
                      <span>CGST (9%):</span>
                      <span className="font-mono text-white">INR {invoice.cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>SGST (9%):</span>
                      <span className="font-mono text-white">INR {invoice.sgstAmount.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-400">
                    <span>IGST (18%):</span>
                    <span className="font-mono text-white">INR {invoice.igstAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold">
                  <span className="text-white text-sm">Grand Total:</span>
                  <span className="text-emerald-400 text-base font-mono">
                    INR {invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Verification Stamp */}
            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-500 space-y-1">
              <p>
                <strong>Payment Settlement:</strong> Settled via PayU India Hosted Checkout. Merchant Txn ID:{' '}
                <span className="font-mono text-slate-400">{invoice.txnid}</span>
              </p>
              <p>This is a computer-generated tax invoice and requires no physical signature.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
