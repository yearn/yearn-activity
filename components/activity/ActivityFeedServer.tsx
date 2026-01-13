import ActivityFeed from './ActivityFeed';
import { batchFetchStrategyNames, extractStrategyRequests } from '@/lib/rpc/multicall';

type EventType = 'deposit' | 'withdraw' | 'transfer' | 'strategyReported' | 'debtUpdated' | 'strategyChanged' | 'shutdown';

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
}

interface ActivityFeedServerProps {
  events: Event[];
  limitPerCategory?: number;
  backgroundFetchLimit?: number;
  backgroundFetchEnabled?: boolean;
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
}: ActivityFeedServerProps) {
  // Extract unique strategy requests from events
  const strategyRequests = extractStrategyRequests(events);

  // Batch fetch all strategy names in parallel
  const strategyNames = await batchFetchStrategyNames(strategyRequests);

  return (
    <ActivityFeed
      events={events}
      limitPerCategory={limitPerCategory}
      strategyNames={strategyNames}
      backgroundFetchLimit={backgroundFetchLimit}
      backgroundFetchEnabled={backgroundFetchEnabled}
    />
  );
}
