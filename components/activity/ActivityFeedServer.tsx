import ActivityFeed from './ActivityFeed';
import { batchFetchStrategyNames, extractStrategyRequests } from '@/lib/rpc/multicall';

type EventType = 'deposit' | 'withdraw' | 'transfer' | 'strategyReported' | 'debtUpdated' | 'strategyChanged' | 'shutdown' | 'roleSet';

interface Event {
  id: string;
  type: EventType;
  chainId?: number;
  blockNumber?: string | number;
  blockTimestamp?: string | number;
  owner?: string;
  receiver?: string;
  sender?: string;
  assets?: string;
  shares?: string;
  value?: string;
  vaultAddress: string;
  transactionHash?: string;
  strategy?: string;
  gain?: string;
  loss?: string;
  current_debt?: string;
  new_debt?: string;
  debt_delta?: string;
  protocol_fees?: string;
  total_fees?: string;
  total_refunds?: string;
  change_type?: string;
  account?: string;
  role?: string;
}

interface ActivityFeedServerProps {
  events: Event[];
  limitPerCategory?: number;
  backgroundFetchLimit?: number;
  backgroundFetchEnabled?: boolean;
  backgroundFetchMode?: 'all' | 'vault';
  compactViewToggleOnMobile?: boolean;
  compactVaultStatsOnMobile?: boolean;
}

const MAX_SERVER_SIDE_STRATEGY_REQUESTS = 24;
const SERVER_SIDE_STRATEGY_LOOKUP_TIMEOUT_MS = 3000;

async function prefetchStrategyNames(events: Event[]): Promise<Map<string, string>> {
  const strategyRequests = extractStrategyRequests(events).slice(0, MAX_SERVER_SIDE_STRATEGY_REQUESTS);
  if (!strategyRequests.length) {
    return new Map();
  }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<Map<string, string>>((resolve) => {
      timeoutHandle = setTimeout(() => {
        console.warn(
          `Strategy name prefetch timed out after ${SERVER_SIDE_STRATEGY_LOOKUP_TIMEOUT_MS}ms. Continuing without names.`
        );
        resolve(new Map());
      }, SERVER_SIDE_STRATEGY_LOOKUP_TIMEOUT_MS);
    });

    return await Promise.race([batchFetchStrategyNames(strategyRequests), timeoutPromise]);
  } catch (error) {
    console.warn('Failed to prefetch strategy names for activity feed:', error);
    return new Map();
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

/**
 * Server component wrapper that pre-fetches strategy names using multicall
 * and passes them to the client ActivityFeed component
 */
export default async function ActivityFeedServer({
  events,
  limitPerCategory,
  backgroundFetchLimit,
  backgroundFetchEnabled,
  backgroundFetchMode,
  compactViewToggleOnMobile,
  compactVaultStatsOnMobile,
}: ActivityFeedServerProps) {
  const strategyNames = await prefetchStrategyNames(events);

  return (
    <ActivityFeed
      events={events}
      limitPerCategory={limitPerCategory}
      strategyNames={strategyNames}
      backgroundFetchLimit={backgroundFetchLimit}
      backgroundFetchEnabled={backgroundFetchEnabled}
      backgroundFetchMode={backgroundFetchMode}
      compactViewToggleOnMobile={compactViewToggleOnMobile}
      compactVaultStatsOnMobile={compactVaultStatsOnMobile}
    />
  );
}
