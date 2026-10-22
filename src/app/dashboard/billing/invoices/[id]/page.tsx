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
      <div className="min-h-screen text-[#17211D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen text-[#17211D] flex">
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
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={`/api/billing/invoices/${invoice.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </a>
            </div>
          </div>

          {/* Visual Invoice Paper Container */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-emerald-500/10">
              <div>
                <span className="text-xl font-extrabold text-[#17211D] tracking-tight">
                  FLUVIA <span className="text-emerald-600">FLOW</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">AI Video Creative Infrastructure</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-500/30">
                  {invoice.supplier.isGstRegistered ? 'GST Tax Invoice' : 'Commercial Invoice'}
                </span>
                <h1 className="text-xl font-black text-[#17211D] mt-2 font-mono">{invoice.invoiceNumber}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Issued: {new Date(invoice.issueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>

            {/* Supplier and Customer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Supplier Details</span>
                <h3 className="font-bold text-[#17211D] text-sm">{invoice.supplier.legalName}</h3>
                <p className="text-slate-600 leading-relaxed">{invoice.supplier.registeredAddress}</p>
                <p className="text-slate-600">State: {invoice.supplier.state}</p>
                {invoice.supplier.gstin && (
                  <p className="font-mono text-slate-700 font-medium">GSTIN: {invoice.supplier.gstin}</p>
                )}
                <p className="text-slate-600">Email: {invoice.supplier.supportEmail}</p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Billed To</span>
                <h3 className="font-bold text-[#17211D] text-sm">{invoice.customer.name}</h3>
                <p className="text-slate-600">{invoice.customer.email}</p>
                {invoice.customer.address && <p className="text-slate-600">{invoice.customer.address}</p>}
                <p className="text-slate-600">Place of Supply: {invoice.customer.state || 'Delhi'}</p>
                {invoice.customer.gstin && (
                  <p className="font-mono text-emerald-700 font-bold">GSTIN: {invoice.customer.gstin}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-xl border border-emerald-500/10 bg-emerald-50/20">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-50/60 text-slate-600 border-b border-emerald-500/10 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4">SAC Code</th>
                    <th className="py-3 px-4">Taxable Value</th>
                    <th className="py-3 px-4">GST Rate</th>
                    <th className="py-3 px-4 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10 text-slate-700">
                  {invoice.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-bold text-[#17211D]">{item.description}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.hsnSacCode}</td>
                      <td className="py-3 px-4 font-mono">INR {item.taxableValue.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono">{item.gstRate}%</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#17211D]">
                        INR {item.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Calculation & Summary Box */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 bg-emerald-50/40 border border-emerald-500/15 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Taxable Value:</span>
                  <span className="font-mono text-[#17211D] font-semibold">INR {invoice.baseAmount.toFixed(2)}</span>
                </div>

                {invoice.cgstAmount > 0 ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (9%):</span>
                      <span className="font-mono text-[#17211D]">INR {invoice.cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (9%):</span>
                      <span className="font-mono text-[#17211D]">INR {invoice.sgstAmount.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST (18%):</span>
                    <span className="font-mono text-[#17211D]">INR {invoice.igstAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-emerald-500/10 flex justify-between items-baseline font-bold">
                  <span className="text-[#17211D] text-sm">Grand Total:</span>
                  <span className="text-emerald-700 text-base font-mono">
                    INR {invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Verification Stamp */}
            <div className="pt-6 border-t border-emerald-500/10 text-[11px] text-slate-500 space-y-1">
              <p>
                <strong>Payment Settlement:</strong> Settled via PayU India Hosted Checkout. Merchant Txn ID:{' '}
                <span className="font-mono text-slate-700">{invoice.txnid}</span>
              </p>
              <p>This is a computer-generated tax invoice and requires no physical signature.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
