import { getRecentActivity } from '@/lib/envio/queries';
import { sortEventsChronologically, formatNumberWithCommas } from '@/lib/envio/utils';
import Link from 'next/link';
import Image from 'next/image';
import {
  SUPPORTED_CHAIN_IDS,
  TRACKED_VAULTS,
  VAULT_ASSET_TOKENS,
  VAULT_CHAIN_IDS,
  getChainName,
  getChainLogoUrl,
  getTokenLogoUrl,
} from '@/lib/envio/constants';
import ActivityFeedServer from '@/components/activity/ActivityFeedServer';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let activityData;
  let hasError = false;

  try {
    activityData = await getRecentActivity(300, [...SUPPORTED_CHAIN_IDS]);
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
  const userEvents = sortedEvents.filter(
    (event) => event.type === 'deposit' || event.type === 'withdraw' || event.type === 'transfer'
  );
  const vaultEvents = sortedEvents.filter(
    (event) =>
      event.type === 'strategyReported' ||
      event.type === 'debtUpdated' ||
      event.type === 'strategyChanged' ||
      event.type === 'shutdown'
  );
  const userEventCount = Math.min(userEvents.length, 25);
  const vaultEventCount = Math.min(vaultEvents.length, 25);
  const recentEventCount = userEventCount + vaultEventCount;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#14233c_0%,#0b0f17_45%,#07090d_100%)] text-white">
      <div className="container-custom py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Yearn Finance <span className="text-yearn-blue">Live Stats</span>
          </h1>
          <p className="text-lg text-good-ol-grey-300 max-w-2xl">
            Real-time activity dashboard for Yearn Finance V3 vaults
          </p>
        </div>

      {/* Recent Activity Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
          <Link href="/activity" className="btn-primary text-[17px]">
            View All Events →
          </Link>
        </div>

        {hasError ? (
          <div className="card">
            <div className="text-center py-12">
              <div className="text-good-ol-grey-400 mb-4">
                Unable to load activity data. Please make sure the Envio indexer is running.
              </div>
              <code className="text-xs text-good-ol-grey-500 bg-good-ol-grey-800 px-3 py-1 rounded">
                npx envio dev
              </code>
            </div>
          </div>
        ) : (
          <ActivityFeedServer events={sortedEvents} limitPerCategory={25} />
        )}
      </div>

      {/* Vaults Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Tracked Vaults</h2>
          <Link href="/vaults" className="btn-secondary text-[17px]">
            View All Vaults →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(TRACKED_VAULTS).map(([name, address], index) => {
            const displayName = name.replaceAll('_', ' ');
            const chainId = VAULT_CHAIN_IDS[address.toLowerCase()] ?? 1;
            const chainLogoSrc = getChainLogoUrl(chainId);
            const chainName = getChainName(chainId);
            const asset = VAULT_ASSET_TOKENS[address.toLowerCase()];
            const assetLogoSrc = asset ? getTokenLogoUrl(asset.chainId, asset.tokenAddress) : null;
            const isAboveFold = index < 3;
            return (
            <div key={address} className="card hover:border-yearn-blue/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-lg font-bold text-white">
                  {assetLogoSrc ? (
                    <Image
                      src={assetLogoSrc}
                      alt={displayName}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                      priority={isAboveFold}
                    />
                  ) : null}
                  <span>{displayName}</span>
                </div>
                <span className="text-xs text-good-ol-grey-500 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <div className="mb-2">
                <span className="inline-flex items-center justify-center border border-good-ol-grey-700 rounded-full px-2 py-1">
                  <Image
                    src={chainLogoSrc}
                    alt={chainName}
                    width={16}
                    height={16}
                    className="h-4 w-4"
                    priority={isAboveFold}
                  />
                </span>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  </div>
  );
}
