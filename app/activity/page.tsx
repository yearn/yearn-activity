import { getRecentActivity } from '@/lib/envio/queries';
import { sortEventsChronologically } from '@/lib/envio/utils';
import ActivityFeedServer from '@/components/activity/ActivityFeedServer';
import { SUPPORTED_CHAIN_IDS } from '@/lib/envio/constants';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function ActivityPage() {
  let activityData;
  let hasError = false;

  try {
    activityData = await getRecentActivity(500, [...SUPPORTED_CHAIN_IDS]);
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    hasError = true;
  }

  const allEvents = activityData
    ? [
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
      ]
    : [];

  const sortedEvents = sortEventsChronologically(allEvents).reverse();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#14233c_0%,#0b0f17_45%,#07090d_100%)] text-white">
      <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Vault Activity</h1>
        <p className="text-lg text-good-ol-grey-400">
          Real-time feed of vault management events and user transactions across Yearn V3 vaults.
        </p>
      </div>

      {hasError ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-good-ol-grey-400 mb-4">
              Unable to load activity data. Please make sure the Envio indexer is running.
            </div>
            <div className="text-sm text-good-ol-grey-500 mb-4">
              Start the indexer with:
            </div>
            <code className="text-xs text-good-ol-grey-500 bg-good-ol-grey-800 px-3 py-1 rounded">
              npx envio dev
            </code>
            <div className="mt-4 text-xs text-good-ol-grey-500">
              Then set ENVIO_GRAPHQL_URL=http://localhost:8080/v1/graphql in .env.local
            </div>
          </div>
        </div>
      ) : (
        <ActivityFeedServer events={sortedEvents} backgroundFetchEnabled backgroundFetchLimit={3000} />
      )}
      </div>
    </div>
  );
}
