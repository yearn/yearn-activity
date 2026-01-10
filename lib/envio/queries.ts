import { gql } from 'graphql-request';
import { envioClient } from './client';
import { SUPPORTED_CHAIN_IDS } from './constants';
import { unstable_cache } from 'next/cache';

export interface DepositEvent {
  id: string;
  sender: string;
  owner: string;
  assets: string;
  shares: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface WithdrawEvent {
  id: string;
  sender: string;
  receiver: string;
  owner: string;
  assets: string;
  shares: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface TransferEvent {
  id: string;
  sender: string;
  receiver: string;
  value: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface StrategyReportedEvent {
  id: string;
  strategy: string;
  gain: string;
  loss: string;
  current_debt: string;
  protocol_fees: string;
  total_fees: string;
  total_refunds: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface DebtUpdatedEvent {
  id: string;
  strategy: string;
  current_debt: string;
  new_debt: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface StrategyChangedEvent {
  id: string;
  strategy: string;
  change_type: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ShutdownEvent {
  id: string;
  vaultAddress: string;
  chainId: number;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export type ChainId = (typeof SUPPORTED_CHAIN_IDS)[number];

export interface ActivityResponse {
  deposits: DepositEvent[];
  withdrawals: WithdrawEvent[];
  transfers: TransferEvent[];
  strategyReports: StrategyReportedEvent[];
  debtUpdates: DebtUpdatedEvent[];
  strategyChanges: StrategyChangedEvent[];
  shutdowns: ShutdownEvent[];
}

// Get recent activity across all vaults
function mergeActivityResponses(responses: ActivityResponse[]): ActivityResponse {
  return responses.reduce<ActivityResponse>(
    (merged, response) => ({
      deposits: merged.deposits.concat(response.deposits),
      withdrawals: merged.withdrawals.concat(response.withdrawals),
      transfers: merged.transfers.concat(response.transfers),
      strategyReports: merged.strategyReports.concat(response.strategyReports),
      debtUpdates: merged.debtUpdates.concat(response.debtUpdates),
      strategyChanges: merged.strategyChanges.concat(response.strategyChanges),
      shutdowns: merged.shutdowns.concat(response.shutdowns),
    }),
    {
      deposits: [],
      withdrawals: [],
      transfers: [],
      strategyReports: [],
      debtUpdates: [],
      strategyChanges: [],
      shutdowns: [],
    }
  );
}

// Internal function without caching
async function _getRecentActivity(limit: number = 50, chainIds: ChainId[] = [1]): Promise<ActivityResponse> {
  const query = gql`
    query GetRecentActivity($limit: Int!, $chainIds: [Int!]!) {
      deposits: Deposit(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        sender
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      withdrawals: Withdraw(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        sender
        receiver
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      transfers: Transfer(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        sender
        receiver
        value
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      strategyReports: StrategyReported(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        strategy
        gain
        loss
        current_debt
        protocol_fees
        total_fees
        total_refunds
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      debtUpdates: DebtUpdated(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        strategy
        current_debt
        new_debt
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      strategyChanges: StrategyChanged(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        strategy
        change_type
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      shutdowns: Shutdown(
        where: { chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
      ) {
        id
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  if (chainIds.length <= 1) {
    return envioClient.request(query, { limit, chainIds });
  }

  const responses = await Promise.all(
    chainIds.map((chainId) => envioClient.request<ActivityResponse>(query, { limit, chainIds: [chainId] }))
  );

  return mergeActivityResponses(responses);
}

// Cached version with 30 second revalidation
export const getRecentActivity = unstable_cache(
  _getRecentActivity,
  ['recent-activity'],
  {
    revalidate: 30,
    tags: ['activity'],
  }
);

// Get user positions and history
export async function getUserActivity(userAddress: string, chainIds: ChainId[] = [1]): Promise<ActivityResponse> {
  const query = gql`
    query GetUserActivity($userAddress: String!, $chainIds: [Int!]!) {
      deposits: Deposit(
        where: { owner: { _eq: $userAddress }, chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: asc, blockNumber: asc, logIndex: asc }
      ) {
        id
        sender
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      withdrawals: Withdraw(
        where: { owner: { _eq: $userAddress }, chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: asc, blockNumber: asc, logIndex: asc }
      ) {
        id
        sender
        receiver
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  return envioClient.request(query, {
    userAddress: userAddress.toLowerCase(),
    chainIds,
  });
}

// Get vault-specific activity
export async function getVaultActivity(
  vaultAddress: string,
  limit: number = 100,
  offset: number = 0,
  chainIds: ChainId[] = [1]
): Promise<ActivityResponse> {
  const query = gql`
    query GetVaultActivity($vaultAddress: String!, $limit: Int!, $offset: Int!, $chainIds: [Int!]!) {
      deposits: Deposit(
        where: { vaultAddress: { _eq: $vaultAddress }, chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        sender
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
      withdrawals: Withdraw(
        where: { vaultAddress: { _eq: $vaultAddress }, chainId: { _in: $chainIds } }
        order_by: { blockTimestamp: desc, blockNumber: desc, logIndex: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        sender
        receiver
        owner
        assets
        shares
        vaultAddress
        chainId
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  return envioClient.request(query, {
    vaultAddress: vaultAddress.toLowerCase(),
    limit,
    offset,
    chainIds,
  });
}
