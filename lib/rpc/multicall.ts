import { createPublicClient, http, type Address } from 'viem';
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains';
import { parseEventId } from '@/lib/envio/utils';

const STRATEGY_NAME_ABI = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

const chainById = {
  1: mainnet,
  10: optimism,
  137: polygon,
  8453: base,
  42161: arbitrum,
} as const;

type SupportedChainId = keyof typeof chainById;

// Cache for public clients - use any to avoid complex viem type issues
const clientCache = new Map<number, any>();

function getPublicClient(chainId: SupportedChainId) {
  const cached = clientCache.get(chainId);
  if (cached) return cached;

  const chain = chainById[chainId];
  if (!chain) return null;

  const client = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });

  clientCache.set(chainId, client);
  return client;
}

export interface StrategyNameRequest {
  chainId: number;
  strategyAddress: string;
}

export interface StrategyNameResult {
  chainId: number;
  strategyAddress: string;
  name: string | null;
}

/**
 * Batch fetch strategy names using multicall pattern
 * Groups requests by chain and makes parallel calls
 */
export async function batchFetchStrategyNames(
  requests: StrategyNameRequest[]
): Promise<Map<string, string>> {
  const resultMap = new Map<string, string>();

  // Group by chain
  const requestsByChain = requests.reduce(
    (acc, req) => {
      if (!acc[req.chainId]) acc[req.chainId] = [];
      acc[req.chainId].push(req.strategyAddress);
      return acc;
    },
    {} as Record<number, string[]>
  );

  // Batch fetch per chain in parallel
  const chainPromises = Object.entries(requestsByChain).map(async ([chainIdStr, addresses]) => {
    const chainId = Number(chainIdStr) as SupportedChainId;
    const client = getPublicClient(chainId);

    if (!client) return [];

    // Use Promise.allSettled to handle individual failures gracefully
    const results = await Promise.allSettled(
      addresses.map(async (address) => {
        try {
          const name = await client.readContract({
            address: address as Address,
            abi: STRATEGY_NAME_ABI,
            functionName: 'name',
          });
          return { chainId, address, name };
        } catch {
          return { chainId, address, name: null };
        }
      })
    );

    return results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<any>).value);
  });

  const allResults = await Promise.all(chainPromises);

  // Build result map with chainId:address as key
  allResults.flat().forEach(({ chainId, address, name }) => {
    if (name) {
      const key = `${chainId}:${address.toLowerCase()}`;
      resultMap.set(key, name);
    }
  });

  return resultMap;
}

/**
 * Extract unique strategy requests from events
 */
export function extractStrategyRequests(
  events: Array<{
    id: string;
    type: string;
    chainId?: number;
    strategy?: string;
  }>
): StrategyNameRequest[] {
  const uniqueRequests = new Map<string, StrategyNameRequest>();

  events.forEach((event) => {
    const needsStrategyName =
      (event.type === 'debtUpdated' ||
        event.type === 'strategyReported' ||
        event.type === 'strategyChanged') &&
      event.strategy;

    if (needsStrategyName) {
      const chainId = event.chainId ?? parseEventId(event.id).chainId;
      const key = `${chainId}:${event.strategy!.toLowerCase()}`;
      if (!uniqueRequests.has(key)) {
        uniqueRequests.set(key, {
          chainId,
          strategyAddress: event.strategy!,
        });
      }
    }
  });

  return Array.from(uniqueRequests.values());
}
