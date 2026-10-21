import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  const current = await getCurrentUser();
  if (!current || current.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const profiles = dbStore.getAllProfiles();
  const jobs = dbStore.getAllJobs();
  const payments = dbStore.getAllPayments();
  const models = dbStore.getModels();
  const providers = dbStore.getProviders();
  const auditLogs = dbStore.getAuditLogs();
  const supportTickets = dbStore.getSupportTickets();

  const totalUsers = profiles.length;
  const totalGenerations = jobs.length;
  const completedGenerations = jobs.filter((j) => j.status === 'completed').length;
  const failedGenerations = jobs.filter((j) => j.status === 'failed').length;
  const successRate = totalGenerations > 0 ? Math.round((completedGenerations / totalGenerations) * 100) : 100;

  const totalGrossRevenueInr = payments
    .filter((p) => p.status === 'success')
    .reduce((acc, p) => acc + p.amountInr, 0);

  return NextResponse.json({
    metrics: {
      totalUsers,
      totalGenerations,
      completedGenerations,
      failedGenerations,
      successRate,
      totalGrossRevenueInr,
      activeJobsCount: jobs.filter((j) => j.status === 'processing' || j.status === 'queued').length,
    },
    providers,
    models,
    recentJobs: jobs.slice(0, 10),
    recentPayments: payments.slice(0, 10),
    recentAudits: auditLogs.slice(0, 15),
    supportTickets,
  });
}
