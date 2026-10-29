'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  Search,
  Filter,
  Receipt,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

export default function TransactionsListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async (page = 1) => {
    try {
      const [authRes, txRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/transactions?page=${page}&limit=10&search=${encodeURIComponent(search)}&status=${statusFilter}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
        if (txData.pagination) setPagination(txData.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(1);
  };

  if (isLoading) {
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-1 font-medium">
                <Link href="/dashboard/billing" className="hover:text-[#5145CD] transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-[#17191D] font-semibold">Transactions</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">Transaction History</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Complete audit trail of all PayU India payment orders, settlements, and tax calculations.
              </p>
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 transition-all self-start sm:self-auto cursor-pointer"
            >
              Buy Creative Credits
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by txnid, item, or PayU ID..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17191D] placeholder-[#667085] focus:outline-hidden focus:border-[#5145CD] transition-colors"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#667085] font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#5145CD]" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#17191D] font-medium focus:outline-hidden focus:border-[#5145CD] transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-[#667085] text-xs space-y-3">
                  <CreditCard className="w-10 h-10 text-[#667085] opacity-50 mx-auto" />
                  <p className="font-semibold text-[#17191D]">No transactions found</p>
                  <p>Orders created via PayU Hosted Checkout will appear here with complete verification data.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Merchant Txn ID</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Base (INR)</th>
                      <th className="py-3 px-4">Taxes (INR)</th>
                      <th className="py-3 px-4">Total (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#17191D]">
                          <Link href={`/dashboard/billing/transactions/${tx.id}`} className="hover:text-[#5145CD] underline">
                            {tx.txnid}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#17191D] max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#667085]">
                          INR {tx.baseAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#667085]">
                          INR {tx.taxAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#5145CD]">
                          INR {tx.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              tx.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tx.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085]">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end flex-wrap gap-1.5">
                            {tx.invoiceId && (
                              <>
                                <Link
                                  href={`/dashboard/billing/invoices/${tx.invoiceId}`}
                                  className="px-2 py-1 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="View Official Invoice"
                                >
                                  <FileText className="w-3 h-3 text-[#5145CD]" />
                                  <span>Invoice</span>
                                </Link>
                                <a
                                  href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-md border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#667085] text-[11px] font-semibold inline-flex items-center transition-colors"
                                  title="Download Invoice PDF"
                                >
                                  <Download className="w-3 h-3 text-[#667085]" />
                                </a>
                              </>
                            )}
                            {tx.receiptId && (
                              <>
                                <Link
                                  href={`/dashboard/billing/receipts/${tx.receiptId}`}
                                  className="px-2 py-1 rounded-md border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="View Official Receipt"
                                >
                                  <Receipt className="w-3 h-3 text-[#667085]" />
                                  <span>Receipt</span>
                                </Link>
                                <a
                                  href={`/api/billing/receipts/${tx.receiptId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-[11px] font-semibold inline-flex items-center transition-colors"
                                  title="Download Receipt PDF"
                                >
                                  <Download className="w-3 h-3 text-[#5145CD]" />
                                </a>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#667085] font-medium">
                <span>
                  Showing {transactions.length} of {pagination.totalCount} orders
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchTransactions(pagination.page - 1)}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#17191D] hover:bg-[#F7F8FA] disabled:opacity-30 cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[#17191D]">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchTransactions(pagination.page + 1)}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#17191D] hover:bg-[#F7F8FA] disabled:opacity-30 cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
