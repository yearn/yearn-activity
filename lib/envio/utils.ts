/**
 * Parse event ID to extract block number and log index
 * Format: {chainId}_{blockNumber}_{logIndex}
 */
export function parseEventId(eventId: string): {
  chainId: number;
  blockNumber: number;
  logIndex: number;
} {
  const parts = eventId.split('_');
  return {
    chainId: parseInt(parts[0]),
    blockNumber: parseInt(parts[1]),
    logIndex: parseInt(parts[2]),
  };
}

/**
 * Merge and sort events chronologically.
 * Prefers blockTimestamp when present (cross-chain safe), falls back to blockNumber + logIndex.
 */
export function sortEventsChronologically<
  T extends { id: string; blockTimestamp?: string | number | bigint; blockNumber?: string | number; chainId?: number }
>(events: T[]): T[] {
  return events.sort((a, b) => {
    const aTs = a.blockTimestamp ? parseTimestampToSeconds(a.blockTimestamp) : null;
    const bTs = b.blockTimestamp ? parseTimestampToSeconds(b.blockTimestamp) : null;

    if (aTs !== null && bTs !== null && aTs !== bTs) {
      return aTs - bTs;
    }

    const aChainId = a.chainId ?? parseEventId(a.id).chainId;
    const bChainId = b.chainId ?? parseEventId(b.id).chainId;

    if (aChainId !== bChainId && (aTs === null || bTs === null)) {
      return 0;
    }

    const aBlock = typeof a.blockNumber === 'string' ? parseInt(a.blockNumber, 10) : Number(a.blockNumber);
    const bBlock = typeof b.blockNumber === 'string' ? parseInt(b.blockNumber, 10) : Number(b.blockNumber);

    if (Number.isFinite(aBlock) && Number.isFinite(bBlock) && aBlock !== bBlock) {
      return aBlock - bBlock;
    }

    const aData = parseEventId(a.id);
    const bData = parseEventId(b.id);
    if (aData.blockNumber !== bData.blockNumber) {
      return aData.blockNumber - bData.blockNumber;
    }
    return aData.logIndex - bData.logIndex;
  });
}

/**
 * Format number with comma separators (for counts/statistics)
 * Examples: 1000 -> "1,000", 1234567 -> "1,234,567"
 */
export function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (!Number.isFinite(num)) {
    return '0';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(num);
}

/**
 * Format currency value with commas and decimals
 * Examples: "1000000.5" -> "1,000,000.5", "2500.123456" -> "2,500.123456"
 */
export function formatCurrency(value: string | number, decimals?: number): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  if (!Number.isFinite(num)) {
    return '0';
  }

  if (decimals !== undefined) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(num);
  }

  let maxDecimals = 6;
  if (typeof value === 'string' && value.includes('.')) {
    const decimalPart = value.split('.')[1];
    maxDecimals = decimalPart ? decimalPart.length : 0;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(maxDecimals, 18),
  });

  return formatter.format(num);
}

/**
 * Format large numbers with decimals and comma separators
 */
export function formatUnits(value: string | bigint, decimals: number = 6): string {
  const bigValue = typeof value === 'string' ? BigInt(value) : value;
  const divisor = 10n ** BigInt(decimals);
  const whole = bigValue / divisor;
  const fraction = bigValue % divisor;

  if (fraction === BigInt(0)) {
    return formatNumberWithCommas(whole.toString());
  }

  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  const fullValue = `${whole}.${fractionStr}`;

  return formatCurrency(fullValue);
}

/**
 * Format address to shortened version
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getExplorerBaseUrl(chainId: number = 1): string {
  const baseUrls: Record<number, string> = {
    1: 'https://etherscan.io',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    137: 'https://polygonscan.com',
    8453: 'https://basescan.org',
    747474: 'https://katanascan.com/',
  };

  return baseUrls[chainId] || 'https://etherscan.io';
}

function parseTimestampToSeconds(blockTimestamp: string | number | bigint): number | null {
  // Prefer BigInt parsing to avoid precision loss for ms/us/ns inputs.
  if (typeof blockTimestamp === 'bigint') {
    const raw = blockTimestamp;
    if (raw <= 0n) return null;
    if (raw > 100_000_000_000_000_000n) return Number(raw / 1_000_000_000n); // ns
    if (raw > 100_000_000_000_000n) return Number(raw / 1_000_000n); // µs
    if (raw > 100_000_000_000n) return Number(raw / 1_000n); // ms
    return Number(raw); // seconds
  }

  if (typeof blockTimestamp === 'string') {
    const trimmed = blockTimestamp.trim();
    if (/^\d+$/.test(trimmed)) {
      return parseTimestampToSeconds(BigInt(trimmed));
    }
  }

  const raw = typeof blockTimestamp === 'string' ? Number(blockTimestamp) : blockTimestamp;
  if (!Number.isFinite(raw) || raw <= 0) return null;

  // Heuristic based on magnitude:
  // seconds  ~ 1e9
  // ms       ~ 1e12
  // µs       ~ 1e15
  // ns       ~ 1e18
  if (raw > 1e17) return Math.floor(raw / 1e9);
  if (raw > 1e14) return Math.floor(raw / 1e6);
  if (raw > 1e11) return Math.floor(raw / 1e3);
  return Math.floor(raw);
}

/**
 * Get relative time string based on a block timestamp (preferred).
 * Envio timestamps are typically seconds since epoch (BigInt serialized to string),
 * but some deployments may return ms/us/ns; handle those too.
 */
export function getRelativeTime(blockTimestamp: string | number | bigint): string {
  const timestampSeconds = parseTimestampToSeconds(blockTimestamp);
  if (!timestampSeconds) {
    return '';
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const secondsAgo = nowSeconds - timestampSeconds;

  // If in the future or very recent, show "just now"
  if (secondsAgo <= 0 || secondsAgo < 60) {
    return 'just now';
  }
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes}m ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    return `${days}d ago`;
  }
}

/**
 * Get relative time string based on block number (fallback).
 * Uses estimated current block and 12s block time.
 */
export function getRelativeTimeFromBlockNumber(blockNumber: number): string {
  // Ethereum mainnet average: ~12 seconds per block
  // Approximate current block (Dec 2025): ~24,000,000
  // This is a rough estimate and should be updated or fetched dynamically
  const ESTIMATED_CURRENT_BLOCK = 24_000_000;
  const SECONDS_PER_BLOCK = 12;

  const blockDifference = ESTIMATED_CURRENT_BLOCK - blockNumber;

  // If block is in the future or very recent, show "just now"
  if (blockDifference <= 0 || blockDifference < 5) {
    return 'just now';
  }

  const secondsAgo = blockDifference * SECONDS_PER_BLOCK;

  if (secondsAgo < 60) {
    return 'just now';
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes}m ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    return `${days}d ago`;
  }
}

/**
 * Get Etherscan transaction URL
 */
export function getEtherscanTxUrl(txHash: string, chainId: number = 1): string {
  return `${getExplorerBaseUrl(chainId)}/tx/${txHash}`;
}

/**
 * Get Etherscan address URL
 */
export function getEtherscanAddressUrl(address: string, chainId: number = 1): string {
  return `${getExplorerBaseUrl(chainId)}/address/${address}`;
}

/**
 * Extract transaction hash from event ID (deprecated)
 * Event ID format: {chainId}_{blockNumber}_{logIndex}
 *
 * @deprecated Use the transactionHash field directly from the event data instead
 */
export function getTransactionHash(eventId: string): string {
  // This function is deprecated - use the transactionHash field from Envio event data
  return eventId;
}
