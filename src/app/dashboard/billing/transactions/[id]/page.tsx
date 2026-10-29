'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  ArrowLeft,
  FileText,
  Receipt,
} from 'lucide-react';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [txData, setTxData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch(`/api/billing/transactions/${params.id}`),
    ])
      .then(async ([authRes, res]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (res.ok) {
          setTxData(await res.json());
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [params.id, router]);

  if (isLoading || !txData) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const order = txData.order;
  const invoice = txData.invoice;
  const receipt = txData.receipt;

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/dashboard/billing/transactions"
              className="text-xs text-[#667085] hover:text-[#5145CD] flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Transactions</span>
            </Link>

            <div className="flex items-center gap-3">
              {receipt?.id && (
                <a
                  href={`/api/billing/receipts/${receipt.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Receipt className="w-4 h-4 text-[#5145CD]" />
                  <span>Receipt PDF</span>
                </a>
              )}
              {invoice?.id && (
                <a
                  href={`/api/billing/invoices/${invoice.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Invoice PDF</span>
                </a>
              )}
            </div>
          </div>

          {/* Main Transaction Card */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#667085] font-semibold">
                  Merchant Transaction Record
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#17191D] mt-1 font-mono">{order.txnid}</h1>
                <p className="text-xs text-[#667085] mt-1">
                  Ordered on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-bold border ${
                    order.status === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 bg-[#F7F8FA] border border-[#E5E7EB] p-4 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#667085]">Payment Breakdown</span>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Product:</span>
                  <strong>{order.productInfo}</strong>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Subtotal:</span>
                  <span className="font-mono">INR {order.baseAmount.toFixed(2)}</span>
                </div>
                {order.taxAmount && order.taxAmount > 0 ? (
                  <div className="flex justify-between text-[#17191D]">
                    <span className="text-[#667085]">Taxes & Fees:</span>
                    <span className="font-mono">INR {order.taxAmount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[#17191D] font-bold pt-2 border-t border-[#E5E7EB]">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-[#5145CD] text-sm font-black">INR {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* PayU Gateway Parameters */}
              <div className="space-y-3 bg-[#F7F8FA] border border-[#E5E7EB] p-4 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#667085]">PayU Gateway Technical Identifiers</span>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Payment Gateway:</span>
                  <span className="font-semibold">PayU India Hosted Checkout</span>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">PayU ID (mihpayid):</span>
                  <span className="font-mono text-[#17191D]">{order.payuMihpayid || 'Pending Gateway Return'}</span>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Bank Reference:</span>
                  <span className="font-mono text-[#17191D]">{order.payuBankRefNum || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Payment Channel:</span>
                  <span className="font-medium">{order.payuPaymentMode || 'UPI / NetBanking / Cards'}</span>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Idempotency Hash:</span>
                  <span className="font-mono text-[10px] text-[#667085] truncate max-w-xs">{order.idempotencyKey}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Snapshot */}
            <div className="bg-[#F7F8FA] border border-[#E5E7EB] p-4 rounded-xl text-xs space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-[#667085]">Customer Billing Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="text-[#667085] block">Name:</span>
                  <strong className="text-[#17191D]">{order.customerDetails?.name}</strong>
                </div>
                <div>
                  <span className="text-[#667085] block">Email:</span>
                  <span className="text-[#17191D]">{order.customerDetails?.email}</span>
                </div>
                <div>
                  <span className="text-[#667085] block">Place of Supply:</span>
                  <span className="text-[#17191D]">{order.customerDetails?.state || 'Delhi'}</span>
                </div>
              </div>
              {order.customerDetails?.gstin && (
                <div className="pt-2 text-[11px] text-[#667085]">
                  <span>Customer Business / Tax ID: </span>
                  <strong className="text-[#5145CD] font-mono">{order.customerDetails.gstin}</strong>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
