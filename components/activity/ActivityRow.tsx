'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import {
  formatUnits,
  formatCurrency,
  parseEventId,
  getRelativeTime,
  getRelativeTimeFromBlockNumber,
  getEtherscanTxUrl,
  formatAddress,
} from '@/lib/envio/utils';
import { VAULT_DECIMALS, VAULT_SYMBOLS, getChainName, getChainLogoUrl } from '@/lib/envio/constants';
import VaultBadge from '@/components/shared/VaultBadge';

interface ActivityRowProps {
  event: {
    id: string;
    type: 'deposit' | 'withdraw' | 'transfer' | 'strategyReported' | 'debtUpdated' | 'strategyChanged' | 'shutdown' | 'roleSet';
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
  };
  strategyName?: string | null;
}

const YEARN_OPS_SENDER = '0x283132390ea87d6ecc20255b59ba94329ee17961';

export default function ActivityRow({ event, strategyName }: ActivityRowProps) {
  const parsed = parseEventId(event.id);
  const chainId = event.chainId ?? parsed.chainId;
  const blockNumberFromField =
    typeof event.blockNumber === 'string'
      ? parseInt(event.blockNumber, 10)
      : typeof event.blockNumber === 'number'
        ? event.blockNumber
        : NaN;
  const blockNumber = Number.isFinite(blockNumberFromField) ? blockNumberFromField : parsed.blockNumber;
  const relativeTimeFromTimestamp = event.blockTimestamp ? getRelativeTime(event.blockTimestamp) : '';
  const relativeTime = relativeTimeFromTimestamp || getRelativeTimeFromBlockNumber(blockNumber);
  const decimals = VAULT_DECIMALS[event.vaultAddress.toLowerCase()] ?? 18;
  const vaultSymbol = VAULT_SYMBOLS[event.vaultAddress.toLowerCase()] || 'Unknown';
  const etherscanUrl = event.transactionHash ? getEtherscanTxUrl(event.transactionHash, chainId) : null;
  const chainLogoSrc = Number.isFinite(chainId) ? getChainLogoUrl(chainId) : null;
  const chainName = Number.isFinite(chainId) ? getChainName(chainId) : 'Unknown chain';
  const shouldShowStrategyName =
    (event.type === 'debtUpdated' || event.type === 'strategyReported' || event.type === 'strategyChanged') &&
    !!event.strategy;
  const isYearnOpsEvent =
    (event.type === 'deposit' || event.type === 'withdraw') &&
    !!event.sender &&
    event.sender.toLowerCase() === YEARN_OPS_SENDER;

  // Get event-specific display data - memoized to avoid recalculation
  const display = useMemo(() => {
    switch (event.type) {
      case 'deposit':
        return {
          icon: '↓',
          iconBg: 'bg-up-only-green-500/10',
          iconColor: 'text-up-only-green-500',
          label: 'Deposit',
          amount: event.assets ? `+${formatCurrency(formatUnits(event.assets, decimals), 2)}` : '+0.00',
          symbol: vaultSymbol,
        };
      case 'withdraw':
        return {
          icon: '↑',
          iconBg: 'bg-disco-salmon-500/10',
          iconColor: 'text-disco-salmon-500',
          label: 'Withdraw',
          amount: event.assets ? `-${formatCurrency(formatUnits(event.assets, decimals), 2)}` : '-0.00',
          symbol: vaultSymbol,
        };
      case 'transfer':
        return {
          icon: '↔',
          iconBg: 'bg-good-ol-grey-500/10',
          iconColor: 'text-good-ol-grey-400',
          label: 'Transfer',
          amount: event.value ? formatCurrency(formatUnits(event.value, decimals), 2) : '0.00',
          symbol: vaultSymbol,
        };
      case 'strategyReported':
        const hasGain = event.gain && BigInt(event.gain) > 0n;
        const hasLoss = event.loss && BigInt(event.loss) > 0n;
        return {
          icon: '📊',
          iconBg: 'bg-yearn-blue/10',
          iconColor: 'text-yearn-blue',
          label: 'Strategy Report',
          amount: hasGain
            ? formatCurrency(formatUnits(event.gain!, decimals), 2)
            : hasLoss
              ? formatCurrency(formatUnits(event.loss!, decimals), 2)
              : '0.00',
          symbol: hasGain ? `${vaultSymbol} gain` : hasLoss ? `${vaultSymbol} loss` : vaultSymbol,
        };
      case 'debtUpdated':
        const debtDelta = event.debt_delta ? BigInt(event.debt_delta) : null;
        const debtDeltaAbs = debtDelta !== null ? (debtDelta < 0n ? -debtDelta : debtDelta) : null;
        const debtDeltaSign = debtDelta !== null ? (debtDelta > 0n ? '+' : debtDelta < 0n ? '-' : '') : '';
        const debtDeltaDisplay =
          debtDeltaAbs !== null ? formatCurrency(formatUnits(debtDeltaAbs, decimals), 2) : '0.00';
        return {
          icon: '💰',
          iconBg: 'bg-purple-500/10',
          iconColor: 'text-purple-500',
          label: 'Debt Updated',
          amount: `${debtDeltaSign}${debtDeltaDisplay}`,
          symbol: `${vaultSymbol} debt`,
        };
      case 'strategyChanged':
        const changeTypeLabels: { [key: string]: string } = {
          '0': 'Added',
          '1': 'Revoked',
        };
        const changeLabel = event.change_type ? changeTypeLabels[event.change_type] || 'Changed' : 'Changed';
        return {
          icon: '🔄',
          iconBg: 'bg-orange-500/10',
          iconColor: 'text-orange-500',
          label: `Strategy ${changeLabel}`,
          amount: event.strategy ? `${event.strategy.slice(0, 6)}...${event.strategy.slice(-4)}` : '',
          symbol: '',
        };
      case 'shutdown':
        return {
          icon: '🛑',
          iconBg: 'bg-red-500/10',
          iconColor: 'text-red-500',
          label: 'Vault Shutdown',
          amount: 'Emergency',
          symbol: '',
        };
      case 'roleSet':
        const roleLabels: { [key: string]: string } = {
          '1': 'ADD_STRATEGY_MANAGER',
          '2': 'REVOKE_STRATEGY_MANAGER',
          '4': 'FORCE_REVOKE_MANAGER',
          '8': 'ACCOUNTANT_MANAGER',
          '16': 'QUEUE_MANAGER',
          '32': 'REPORTING_MANAGER',
          '64': 'DEBT_MANAGER',
          '128': 'MAX_DEBT_MANAGER',
          '256': 'DEPOSIT_LIMIT_MANAGER',
          '512': 'WITHDRAW_LIMIT_MANAGER',
          '1024': 'MINIMUM_IDLE_MANAGER',
          '2048': 'PROFIT_UNLOCK_MANAGER',
          '4096': 'DEBT_PURCHASER',
          '8192': 'EMERGENCY_MANAGER',
        };
        const roleLabel = event.role ? roleLabels[event.role] || `Role ${event.role}` : 'Role';
        return {
          icon: '👤',
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-500',
          label: 'Role Change',
          amount: event.account ? `${event.account.slice(0, 6)}...${event.account.slice(-4)}` : '',
          symbol: roleLabel,
        };
      default:
        return {
          icon: '❓',
          iconBg: 'bg-good-ol-grey-500/10',
          iconColor: 'text-good-ol-grey-500',
          label: event.type,
          amount: '',
          symbol: '',
        };
    }
  }, [event.type, event.assets, event.value, event.gain, event.loss, event.debt_delta, event.change_type, event.strategy, event.account, event.role, decimals, vaultSymbol]);

  const debtDeltaValue = event.debt_delta ? BigInt(event.debt_delta) : null;
  const debtAmountClass =
    event.type === 'debtUpdated'
      ? debtDeltaValue && debtDeltaValue !== 0n
        ? debtDeltaValue < 0n
          ? 'text-up-only-green-500'
          : 'text-disco-salmon-500'
        : 'text-white'
      : 'text-white';
  const amountClass =
    event.type === 'deposit'
      ? 'text-up-only-green-500'
      : event.type === 'withdraw'
        ? 'text-disco-salmon-500'
        : event.type === 'debtUpdated'
          ? debtAmountClass
          : 'text-white';

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-start md:items-center py-4 px-4 hover:bg-good-ol-grey-800/50 transition-colors gap-3 md:gap-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${display.iconBg}`}>
            <span className={`${display.iconColor} text-lg`}>{display.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-[1.2rem] font-semibold text-white">{display.label}</div>
              {isYearnOpsEvent ? (
                <span className="inline-flex rounded-full border border-yearn-blue/30 bg-yearn-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yearn-blue">
                  Yearn ops
                </span>
              ) : null}
            </div>
            <div className="text-base text-good-ol-grey-300">{relativeTime}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <VaultBadge vaultAddress={event.vaultAddress} chainId={chainId} />
          <div className="flex items-center justify-center border border-good-ol-grey-700 rounded-full px-2 py-1">
            {chainLogoSrc ? (
              <Image src={chainLogoSrc} alt={chainName} width={16} height={16} className="h-4 w-4" />
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wide text-good-ol-grey-300">
                Chain
              </span>
            )}
          </div>
        </div>

        {etherscanUrl && (
          <a
            href={etherscanUrl}
            title="View transaction on Etherscan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-yearn-blue hover:underline"
          >
            View tx →
          </a>
        )}
      </div>

      <div className="px-0 md:px-4 text-left min-w-0">
        {shouldShowStrategyName ? (
          <div className="flex flex-col items-start">
            <div className="text-sm uppercase tracking-wide text-good-ol-grey-400">Strategy</div>
            <div className="text-[1.1rem] font-semibold text-white truncate">
              {strategyName || (event.strategy ? formatAddress(event.strategy) : 'Unknown')}
            </div>
          </div>
        ) : (
          <div className="h-0 md:h-6" />
        )}
      </div>

      <div className="text-right w-full md:w-44 flex-shrink-0">
        <div className={`text-[1.15rem] font-semibold font-numeric ${amountClass}`}>
          {display.amount} {display.symbol}
        </div>
      </div>
    </div>
  );
}
