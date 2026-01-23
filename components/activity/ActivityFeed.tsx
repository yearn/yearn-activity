'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import ActivityRow from './ActivityRow';
import {
  TRACKED_VAULTS,
  VAULT_NAMES,
  VAULT_ASSET_TOKENS,
  VAULT_SYMBOLS,
  SUPPORTED_CHAIN_IDS,
  getChainName,
  getChainLogoUrl,
  getTokenLogoUrl,
} from '@/lib/envio/constants';
import { formatNumberWithCommas, parseEventId, sortEventsChronologically } from '@/lib/envio/utils';

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

interface ActivityFeedProps {
  events: Event[];
  limitPerCategory?: number;
  strategyNames?: Map<string, string>;
  backgroundFetchLimit?: number;
  backgroundFetchEnabled?: boolean;
}

type ViewMode = 'vault' | 'user';

export default function ActivityFeed({
  events,
  limitPerCategory,
  strategyNames,
  backgroundFetchLimit = 500,
  backgroundFetchEnabled = false,
}: ActivityFeedProps) {
  const [loadedEvents, setLoadedEvents] = useState<Event[]>(events);
  const [loadedStrategyNames, setLoadedStrategyNames] = useState<Map<string, string>>(strategyNames ?? new Map());
  const [hasBackgroundLoaded, setHasBackgroundLoaded] = useState(false);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [selectedVault, setSelectedVault] = useState<string>('all');
  const [showRedundantEvents, setShowRedundantEvents] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isChainMenuOpen, setIsChainMenuOpen] = useState(false);
  const [isVaultMenuOpen, setIsVaultMenuOpen] = useState(false);
  const [isEventTypeMenuOpen, setIsEventTypeMenuOpen] = useState(false);
  const [isEventGuideOpen, setIsEventGuideOpen] = useState(false);
  const chainMenuRef = useRef<HTMLDivElement | null>(null);
  const vaultMenuRef = useRef<HTMLDivElement | null>(null);
  const eventTypeMenuRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setLoadedEvents(events);
    setHasBackgroundLoaded(false);
  }, [events]);

  useEffect(() => {
    setLoadedStrategyNames(strategyNames ?? new Map());
  }, [strategyNames]);

  useEffect(() => {
    if (!backgroundFetchEnabled || hasBackgroundLoaded || isBackgroundLoading) return;
    if (!backgroundFetchLimit || backgroundFetchLimit <= events.length) return;

    const controller = new AbortController();
    const loadBackground = async () => {
      setIsBackgroundLoading(true);
      try {
        const response = await fetch(`/api/activity?limit=${backgroundFetchLimit}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          events?: Event[];
          strategyNames?: Record<string, string>;
        };
        if (!data?.events?.length) return;

        setLoadedEvents((prev) => {
          const merged = new Map(prev.map((event) => [event.id, event]));
          data.events!.forEach((event) => merged.set(event.id, event));
          return sortEventsChronologically(Array.from(merged.values())).reverse();
        });

        if (data.strategyNames) {
          setLoadedStrategyNames((prev) => {
            const merged = new Map(prev);
            Object.entries(data.strategyNames!).forEach(([key, value]) => {
              if (value) merged.set(key, value);
            });
            return merged;
          });
        }

        setHasBackgroundLoaded(true);
      } catch (error) {
        if ((error as { name?: string })?.name !== 'AbortError') {
          console.error('Failed to background load activity:', error);
        }
      } finally {
        setIsBackgroundLoading(false);
      }
    };

    loadBackground();

    return () => {
      controller.abort();
    };
  }, [backgroundFetchEnabled, backgroundFetchLimit, events.length, hasBackgroundLoaded, isBackgroundLoading]);

  const vaultOptions = useMemo(
    () =>
      Object.entries(TRACKED_VAULTS).map(([symbol, address]) => {
        const lowerAddress = address.toLowerCase();
        const label = VAULT_NAMES[lowerAddress] ?? `${symbol} Vault`;
        const asset = VAULT_ASSET_TOKENS[lowerAddress];
        const logoSrc = asset ? getTokenLogoUrl(asset.chainId, asset.tokenAddress) : null;
        const tokenSymbol = VAULT_SYMBOLS[lowerAddress] ?? symbol;
        return {
          address: lowerAddress,
          label,
          logoSrc,
          tokenSymbol,
        };
      }),
    []
  );

  const chainOptions = useMemo(
    () =>
      SUPPORTED_CHAIN_IDS.map((chainId) => ({
        value: chainId.toString(),
        label: getChainName(chainId),
      })),
    []
  );
  const eventTypeOptions = useMemo(() => {
    if (viewMode === 'vault') {
      return [
        {
          value: 'strategyReported',
          label: 'Strategy Reports',
          icon: '📊',
          iconBg: 'bg-yearn-blue/10',
          iconColor: 'text-yearn-blue',
        },
        {
          value: 'debtUpdated',
          label: 'Debt Updates',
          icon: '💰',
          iconBg: 'bg-purple-500/10',
          iconColor: 'text-purple-500',
        },
        {
          value: 'strategyChanged',
          label: 'Strategy Changes',
          icon: '🔄',
          iconBg: 'bg-orange-500/10',
          iconColor: 'text-orange-500',
        },
        {
          value: 'shutdown',
          label: 'Shutdowns',
          icon: '🛑',
          iconBg: 'bg-red-500/10',
          iconColor: 'text-red-500',
        },
      ];
    }
    return [
      {
        value: 'deposit',
        label: 'Deposits',
        icon: '↓',
        iconBg: 'bg-up-only-green-500/10',
        iconColor: 'text-up-only-green-500',
      },
      {
        value: 'withdraw',
        label: 'Withdrawals',
        icon: '↑',
        iconBg: 'bg-disco-salmon-500/10',
        iconColor: 'text-disco-salmon-500',
      },
      {
        value: 'transfer',
        label: 'Transfers',
        icon: '↔',
        iconBg: 'bg-good-ol-grey-500/10',
        iconColor: 'text-good-ol-grey-400',
      },
    ];
  }, [viewMode]);
  const selectedEventTypeOption = useMemo(
    () => eventTypeOptions.find((option) => option.value === selectedEventType),
    [eventTypeOptions, selectedEventType]
  );

  const getEventChainId = (event: Event) => event.chainId ?? parseEventId(event.id).chainId;

  const filteredEvents = useMemo(() => {
    if (selectedVault === 'all') return loadedEvents;
    return loadedEvents.filter((event) => event.vaultAddress.toLowerCase() === selectedVault);
  }, [loadedEvents, selectedVault]);

  const chainFilteredEvents = useMemo(() => {
    if (selectedChain === 'all') return filteredEvents;
    return filteredEvents.filter((event) => getEventChainId(event).toString() === selectedChain);
  }, [filteredEvents, selectedChain]);

  const userEvents = useMemo(
    () =>
      chainFilteredEvents.filter(
        (event) => event.type === 'deposit' || event.type === 'withdraw' || event.type === 'transfer'
      ),
    [chainFilteredEvents]
  );

  const dedupedUserEvents = useMemo(() => {
    const seen = new Map<string, { index: number; priority: number }>();
    const deduped: Event[] = [];

    for (const event of userEvents) {
      const transactionHash = event.transactionHash?.toLowerCase();
      if (!transactionHash) {
        deduped.push(event);
        continue;
      }

      const priority = event.type === 'transfer' ? 0 : 1;
      const existing = seen.get(transactionHash);

      if (!existing) {
        seen.set(transactionHash, { index: deduped.length, priority });
        deduped.push(event);
        continue;
      }

      if (priority > existing.priority) {
        deduped[existing.index] = event;
        seen.set(transactionHash, { index: existing.index, priority });
      }
    }

    return deduped;
  }, [userEvents]);

  const trackedVaultSet = useMemo(
    () => new Set(Object.values(TRACKED_VAULTS).map((address) => address.toLowerCase())),
    []
  );

  const withdrawTxHashes = useMemo(
    () =>
      new Set(
        dedupedUserEvents
          .filter(
            (event) =>
              event.type === 'withdraw' &&
              !!event.transactionHash &&
              trackedVaultSet.has(event.vaultAddress.toLowerCase())
          )
          .map((event) => event.transactionHash!.toLowerCase())
      ),
    [trackedVaultSet, dedupedUserEvents]
  );

  const vaultEvents = useMemo(
    () =>
      chainFilteredEvents.filter((event) => {
        const isVaultEvent =
          event.type === 'strategyReported' ||
          event.type === 'debtUpdated' ||
          event.type === 'strategyChanged' ||
          event.type === 'shutdown';

        if (!isVaultEvent) return false;

        if (
          !showRedundantEvents &&
          event.type === 'debtUpdated' &&
          event.transactionHash &&
          withdrawTxHashes.has(event.transactionHash.toLowerCase())
        ) {
          return false;
        }

        return true;
      }),
    [chainFilteredEvents, showRedundantEvents, withdrawTxHashes]
  );

  const filteredUserEvents = useMemo(() => {
    if (selectedEventType === 'all') return dedupedUserEvents;
    return dedupedUserEvents.filter((event) => event.type === selectedEventType);
  }, [selectedEventType, dedupedUserEvents]);

  const filteredVaultEvents = useMemo(() => {
    if (selectedEventType === 'all') return vaultEvents;
    return vaultEvents.filter((event) => event.type === selectedEventType);
  }, [selectedEventType, vaultEvents]);

  const limitedUserEvents = useMemo(
    () => (limitPerCategory ? filteredUserEvents.slice(0, limitPerCategory) : filteredUserEvents),
    [limitPerCategory, filteredUserEvents]
  );
  const limitedVaultEvents = useMemo(
    () => (limitPerCategory ? filteredVaultEvents.slice(0, limitPerCategory) : filteredVaultEvents),
    [limitPerCategory, filteredVaultEvents]
  );
  const displayedEvents = viewMode === 'vault' ? limitedVaultEvents : limitedUserEvents;
  const totalPages = Math.max(1, Math.ceil(displayedEvents.length / PAGE_SIZE));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return displayedEvents.slice(start, start + PAGE_SIZE);
  }, [currentPage, displayedEvents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, selectedVault, selectedChain, selectedEventType, showRedundantEvents, limitPerCategory, loadedEvents]);

  useEffect(() => {
    setSelectedEventType('all');
  }, [viewMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Memoized click outside handler to prevent unnecessary event listener re-attachments
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      if (isChainMenuOpen && chainMenuRef.current && !chainMenuRef.current.contains(target)) {
        setIsChainMenuOpen(false);
      }
      if (isVaultMenuOpen && vaultMenuRef.current && !vaultMenuRef.current.contains(target)) {
        setIsVaultMenuOpen(false);
      }
      if (isEventTypeMenuOpen && eventTypeMenuRef.current && !eventTypeMenuRef.current.contains(target)) {
        setIsEventTypeMenuOpen(false);
      }
    },
    [isChainMenuOpen, isVaultMenuOpen, isEventTypeMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      {/* View Toggle + Vault Filter */}
      <div className="mb-6 flex flex-col items-start gap-4">
        <div className="flex gap-2 p-1 bg-good-ol-grey-800 rounded-lg inline-flex">
          <button
            onClick={() => setViewMode('user')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              viewMode === 'user'
                ? 'bg-yearn-blue text-white shadow-sm'
                : 'text-good-ol-grey-400 hover:text-white'
            }`}
          >
            User Transactions
          </button>
          <button
            onClick={() => setViewMode('vault')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              viewMode === 'vault'
                ? 'bg-yearn-blue text-white shadow-sm'
                : 'text-good-ol-grey-400 hover:text-white'
            }`}
          >
            Vault Management
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-good-ol-grey-300 relative" ref={vaultMenuRef}>
            <span className="whitespace-nowrap">Select Vault</span>
            <button
              type="button"
              onClick={() => setIsVaultMenuOpen((open) => !open)}
              className="flex items-center gap-2 bg-good-ol-grey-800 border border-good-ol-grey-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yearn-blue"
            >
              {selectedVault === 'all' ? (
                <span>All vaults</span>
              ) : (
                <>
                  {(() => {
                    const selected = vaultOptions.find((vault) => vault.address === selectedVault);
                    return selected ? (
                      <>
                        {selected.logoSrc ? (
                          <Image src={selected.logoSrc} alt={selected.tokenSymbol} width={16} height={16} className="h-4 w-4" />
                        ) : null}
                        <span>{selected.label}</span>
                      </>
                    ) : (
                      <span>Selected vault</span>
                    );
                  })()}
                </>
              )}
              <span className="text-good-ol-grey-400">▾</span>
            </button>
            {isVaultMenuOpen && (
              <div className="absolute z-20 top-full mt-2 w-64 rounded-lg border border-good-ol-grey-700 bg-good-ol-grey-800 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVault('all');
                    setIsVaultMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700 rounded-t-lg"
                >
                  All vaults
                </button>
                {vaultOptions.map((vault) => (
                  <button
                    key={vault.address}
                    type="button"
                    onClick={() => {
                      setSelectedVault(vault.address);
                      setIsVaultMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700"
                  >
                    {vault.logoSrc ? (
                      <Image src={vault.logoSrc} alt={vault.tokenSymbol} width={20} height={20} className="h-5 w-5" />
                    ) : null}
                    <span>{vault.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-good-ol-grey-300 relative" ref={chainMenuRef}>
            <span className="whitespace-nowrap">Select Blockchain</span>
            <button
              type="button"
              onClick={() => setIsChainMenuOpen((open) => !open)}
              className="flex items-center gap-2 bg-good-ol-grey-800 border border-good-ol-grey-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yearn-blue"
            >
              {selectedChain === 'all' ? (
                <span>All</span>
              ) : (
                <>
                  <Image
                    src={getChainLogoUrl(Number(selectedChain))}
                    alt={getChainName(Number(selectedChain))}
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <span>{getChainName(Number(selectedChain))}</span>
                </>
              )}
              <span className="text-good-ol-grey-400">▾</span>
            </button>
            {isChainMenuOpen && (
              <div className="absolute z-20 top-full mt-2 w-56 rounded-lg border border-good-ol-grey-700 bg-good-ol-grey-800 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChain('all');
                    setIsChainMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700 rounded-t-lg"
                >
                  All
                </button>
                {chainOptions
                  .filter((chain) =>
                    SUPPORTED_CHAIN_IDS.includes(Number(chain.value) as (typeof SUPPORTED_CHAIN_IDS)[number])
                  )
                  .map((chain) => (
                    <button
                      key={chain.value}
                      type="button"
                      onClick={() => {
                        setSelectedChain(chain.value);
                        setIsChainMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700"
                    >
                      <Image
                        src={getChainLogoUrl(Number(chain.value))}
                        alt={chain.label}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <span>{chain.label}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-good-ol-grey-300 relative" ref={eventTypeMenuRef}>
            <span className="whitespace-nowrap">Event Type</span>
            <button
              type="button"
              onClick={() => setIsEventTypeMenuOpen((open) => !open)}
              className="flex items-center gap-2 bg-good-ol-grey-800 border border-good-ol-grey-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yearn-blue"
            >
              {selectedEventType === 'all' ? (
                <span>All</span>
              ) : (
                <div className="flex items-center gap-2">
                  {selectedEventTypeOption ? (
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${selectedEventTypeOption.iconBg}`}
                    >
                      <span className={`${selectedEventTypeOption.iconColor} text-xs`}>
                        {selectedEventTypeOption.icon}
                      </span>
                    </div>
                  ) : null}
                  <span>{selectedEventTypeOption?.label ?? 'Selected'}</span>
                </div>
              )}
              <span className="text-good-ol-grey-400">▾</span>
            </button>
            {isEventTypeMenuOpen && (
              <div className="absolute z-20 top-full mt-2 w-56 rounded-lg border border-good-ol-grey-700 bg-good-ol-grey-800 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventType('all');
                    setIsEventTypeMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700 rounded-t-lg"
                >
                  All
                </button>
                {eventTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedEventType(option.value);
                      setIsEventTypeMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-white hover:bg-good-ol-grey-700"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${option.iconBg}`}>
                      <span className={`${option.iconColor} text-xs`}>{option.icon}</span>
                    </div>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-good-ol-grey-300">
            <input
              type="checkbox"
              checked={showRedundantEvents}
              onChange={(event) => setShowRedundantEvents(event.target.checked)}
              className="h-4 w-4 rounded border-good-ol-grey-600 bg-good-ol-grey-800 text-yearn-blue focus:ring-yearn-blue"
            />
            <span className="whitespace-nowrap">Show redundant events</span>
          </label>
        </div>
      </div>

      {isBackgroundLoading ? (
        <div className="mb-4 text-sm text-good-ol-grey-400">Loading more events...</div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {viewMode === 'vault' ? (
          <>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Total Events</div>
              <div className="text-2xl font-bold text-white font-numeric">
                {formatNumberWithCommas(limitedVaultEvents.length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Strategy Reports</div>
              <div className="text-2xl font-bold text-yearn-blue font-numeric">
                {formatNumberWithCommas(limitedVaultEvents.filter((e) => e.type === 'strategyReported').length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Debt Updates</div>
              <div className="text-2xl font-bold text-purple-500 font-numeric">
                {formatNumberWithCommas(limitedVaultEvents.filter((e) => e.type === 'debtUpdated').length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Strategy Changes</div>
              <div className="text-2xl font-bold text-orange-500 font-numeric">
                {formatNumberWithCommas(limitedVaultEvents.filter((e) => e.type === 'strategyChanged').length)}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Total Events</div>
              <div className="text-2xl font-bold text-white font-numeric">
                {formatNumberWithCommas(limitedUserEvents.length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Deposits</div>
              <div className="text-2xl font-bold text-up-only-green-500 font-numeric">
                {formatNumberWithCommas(limitedUserEvents.filter((e) => e.type === 'deposit').length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Withdrawals</div>
              <div className="text-2xl font-bold text-disco-salmon-500 font-numeric">
                {formatNumberWithCommas(limitedUserEvents.filter((e) => e.type === 'withdraw').length)}
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-good-ol-grey-400 mb-2">Transfers</div>
              <div className="text-2xl font-bold text-good-ol-grey-400 font-numeric">
                {formatNumberWithCommas(limitedUserEvents.filter((e) => e.type === 'transfer').length)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Activity Feed */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">
            {viewMode === 'vault' ? 'Vault Management Events' : 'User Transaction Feed'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-up-only-green-500 animate-pulse"></div>
              <span className="text-sm text-good-ol-grey-400">Live</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEventGuideOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-md border border-good-ol-grey-700 px-3 py-1 text-sm text-white hover:bg-good-ol-grey-800"
            >
              <span className="text-good-ol-grey-400">{isEventGuideOpen ? 'Hide' : 'Show'}</span>
              <span>Event Decoder</span>
              <span className="text-good-ol-grey-400">{isEventGuideOpen ? '▴' : '▾'}</span>
            </button>
          </div>
        </div>

        {isEventGuideOpen && (
          <div className="mb-4 card">
            <div className="mb-3 text-sm uppercase tracking-wide text-good-ol-grey-400">Event Decoder</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-good-ol-grey-500 mb-2">User Transactions</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-up-only-green-500/10">
                      <span className="text-up-only-green-500 text-sm">↓</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Deposit</div>
                      <div className="text-xs text-good-ol-grey-400">User adds assets to a vault</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-disco-salmon-500/10">
                      <span className="text-disco-salmon-500 text-sm">↑</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Withdraw</div>
                      <div className="text-xs text-good-ol-grey-400">User removes assets from a vault</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-good-ol-grey-500/10">
                      <span className="text-good-ol-grey-400 text-sm">↔</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Transfer</div>
                      <div className="text-xs text-good-ol-grey-400">User moves shares between addresses</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-good-ol-grey-500 mb-2">Vault Management</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-good-ol-grey-500/10">
                      <span className="text-good-ol-grey-400 text-sm">☑</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Show redundant events</div>
                      <div className="text-xs text-good-ol-grey-400">Include debt updates that occur from withdraw transactions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yearn-blue/10">
                      <span className="text-yearn-blue text-sm">📊</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Strategy Report</div>
                      <div className="text-xs text-good-ol-grey-400">
                        Accounting checkpoint where profit/loss is realized via report/process_report
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/10">
                      <span className="text-purple-500 text-sm">💰</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Debt Updated</div>
                      <div className="text-xs text-good-ol-grey-400">
                        Vault reallocates debt (assets moved in/out of strategies)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10">
                      <span className="text-orange-500 text-sm">🔄</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Strategy Changed</div>
                      <div className="text-xs text-good-ol-grey-400">
                        Strategy is added to or removed from the vault’s allocation set
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10">
                      <span className="text-red-500 text-sm">🛑</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Vault Shutdown</div>
                      <div className="text-xs text-good-ol-grey-400">
                        Vault is paused for safety; new deposits stop so users only withdraw
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {paginatedEvents.length > 0 ? (
          <div className="card p-0 overflow-hidden divide-y divide-good-ol-grey-700">
            {paginatedEvents.map((event) => {
              const strategyKey = event.strategy && event.chainId
                ? `${event.chainId}:${event.strategy.toLowerCase()}`
                : null;
              const strategyName = strategyKey ? loadedStrategyNames.get(strategyKey) : undefined;
              return <ActivityRow key={event.id} event={event} strategyName={strategyName} />;
            })}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12 text-good-ol-grey-400">
              No {viewMode === 'vault' ? 'vault management' : 'user transaction'} events found. Waiting for activity...
            </div>
          </div>
        )}

        {displayedEvents.length > PAGE_SIZE && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-good-ol-grey-300">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-md border border-good-ol-grey-700 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-good-ol-grey-800"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-good-ol-grey-700 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-good-ol-grey-800"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-good-ol-grey-700 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-good-ol-grey-800"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="rounded-md border border-good-ol-grey-700 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-good-ol-grey-800"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
