import { getUserActivity } from '@/lib/envio/queries';
import { getEtherscanAddressUrl, sortEventsChronologically, formatNumberWithCommas } from '@/lib/envio/utils';
import ActivityRow from '@/components/activity/ActivityRow';
import { notFound } from 'next/navigation';
import { SUPPORTED_CHAIN_IDS } from '@/lib/envio/constants';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function UserPage({ params }: PageProps) {
  const { address } = await params;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    notFound();
  }

  let activityData;
  let hasError = false;

  try {
    activityData = await getUserActivity(address, [...SUPPORTED_CHAIN_IDS]);
  } catch (error) {
    console.error('Failed to fetch user activity:', error);
    hasError = true;
  }

  const allEvents = activityData
    ? [
        ...activityData.deposits.map((d) => ({ ...d, type: 'deposit' as const })),
        ...activityData.withdrawals.map((w) => ({ ...w, type: 'withdraw' as const })),
      ]
    : [];

  const sortedEvents = sortEventsChronologically(allEvents).reverse();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#14233c_0%,#0b0f17_45%,#07090d_100%)] text-white">
      <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">User Activity</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-good-ol-grey-400">Address:</span>
          <code className="text-sm font-mono text-yearn-blue bg-good-ol-grey-800 px-3 py-1 rounded">
            {address}
          </code>
          <a
            href={getEtherscanAddressUrl(address, 1)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-good-ol-grey-300 hover:text-yearn-blue transition-colors"
            title="View address on Etherscan"
          >
            Etherscan →
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-good-ol-grey-400 mb-2">Total Transactions</div>
          <div className="text-2xl font-bold text-white font-numeric">{formatNumberWithCommas(sortedEvents.length)}</div>
        </div>

        <div className="card">
          <div className="text-sm text-good-ol-grey-400 mb-2">Deposits</div>
          <div className="text-2xl font-bold text-up-only-green-500 font-numeric">
            {formatNumberWithCommas(sortedEvents.filter((e) => e.type === 'deposit').length)}
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-good-ol-grey-400 mb-2">Withdrawals</div>
          <div className="text-2xl font-bold text-disco-salmon-500 font-numeric">
            {formatNumberWithCommas(sortedEvents.filter((e) => e.type === 'withdraw').length)}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>

        {hasError ? (
          <div className="card">
            <div className="text-center py-12 text-good-ol-grey-400">
              Unable to load user activity data.
            </div>
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            {sortedEvents.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12 text-good-ol-grey-400">
              No activity found for this address.
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
