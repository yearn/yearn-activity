import { NextRequest, NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/envio/queries';
import { SUPPORTED_CHAIN_IDS } from '@/lib/envio/constants';
import { sortEventsChronologically } from '@/lib/envio/utils';
import { batchFetchStrategyNames, extractStrategyRequests } from '@/lib/rpc/multicall';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 3000;

function parseChainIds(param: string | null): number[] {
  if (!param) return [...SUPPORTED_CHAIN_IDS];
  const requested = param
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
  const allowed = new Set(SUPPORTED_CHAIN_IDS);
  const filtered = requested.filter((value) => allowed.has(value as (typeof SUPPORTED_CHAIN_IDS)[number]));
  return filtered.length > 0 ? filtered : [...SUPPORTED_CHAIN_IDS];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit'));
  const limit = Number.isFinite(limitParam)
    ? Math.max(1, Math.min(limitParam, MAX_LIMIT))
    : DEFAULT_LIMIT;
  const chainIds = parseChainIds(searchParams.get('chainIds'));

  try {
    const activityData = await getRecentActivity(limit, chainIds as (typeof SUPPORTED_CHAIN_IDS)[number][]);
    const allEvents = [
      ...activityData.deposits.map((d) => ({ ...d, type: 'deposit' as const })),
      ...activityData.withdrawals.map((w) => ({ ...w, type: 'withdraw' as const })),
      ...(activityData.transfers || []).map((t) => ({ ...t, type: 'transfer' as const })),
      ...activityData.strategyReports.map((s) => ({ ...s, type: 'strategyReported' as const })),
      ...activityData.debtUpdates.map((d) => ({
        ...d,
        debt_delta:
          d.new_debt && d.current_debt ? (BigInt(d.new_debt) - BigInt(d.current_debt)).toString() : undefined,
        type: 'debtUpdated' as const,
      })),
      ...activityData.strategyChanges.map((s) => ({ ...s, type: 'strategyChanged' as const })),
      ...activityData.shutdowns.map((s) => ({ ...s, type: 'shutdown' as const })),
    ];

    const sortedEvents = sortEventsChronologically(allEvents).reverse();
    const strategyRequests = extractStrategyRequests(sortedEvents);
    const strategyNames = await batchFetchStrategyNames(strategyRequests);

    return NextResponse.json({
      events: sortedEvents,
      strategyNames: Object.fromEntries(strategyNames.entries()),
    });
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
