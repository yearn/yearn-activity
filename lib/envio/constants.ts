export const TRACKED_VAULTS = {
  USDC: '0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204',
  DAI: '0x028eC7330ff87667b6dfb0D94b954c820195336c',
  USDT: '0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa',
  USDS: '0x182863131F9a4630fF9E27830d945B1413e347E8',
  CRVUSD: '0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F',
  WETH: '0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0',
  USDC_TRUE_YIELD: '0xb13CF163d916917d9cD6E836905cA5f12a1dEF4B',
  USDC_HORIZON: '0xc3BD0A2193c8F027B82ddE3611D18589ef3f62a9',
  WETH_HORIZON: '0x4d81C7d534D703E0a0AECaDF668C0E0253E1f1C3',
  CBBTC_HORIZON: '0x25f32eC89ce7732A4E9f8F3340a09259F823b7d3',
} as const;

// Keep UI queries in sync with config.yaml.
export const SUPPORTED_CHAIN_IDS = [1, 8453] as const;

export const VAULT_NAMES: Record<string, string> = {
  [TRACKED_VAULTS.USDC.toLowerCase()]: 'USDC Vault',
  [TRACKED_VAULTS.DAI.toLowerCase()]: 'DAI Vault',
  [TRACKED_VAULTS.USDT.toLowerCase()]: 'USDT Vault',
  [TRACKED_VAULTS.USDS.toLowerCase()]: 'USDS Vault',
  [TRACKED_VAULTS.CRVUSD.toLowerCase()]: 'CRVUSD Vault',
  [TRACKED_VAULTS.WETH.toLowerCase()]: 'WETH Vault',
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 'USDC True Yield Vault (Base)',
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 'USDC Horizon Vault (Base)',
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 'WETH Horizon Vault (Base)',
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 'cbBTC Horizon Vault (Base)',
};

export const VAULT_SYMBOLS: Record<string, string> = {
  [TRACKED_VAULTS.USDC.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.DAI.toLowerCase()]: 'DAI',
  [TRACKED_VAULTS.USDT.toLowerCase()]: 'USDT',
  [TRACKED_VAULTS.USDS.toLowerCase()]: 'USDS',
  [TRACKED_VAULTS.CRVUSD.toLowerCase()]: 'CRVUSD',
  [TRACKED_VAULTS.WETH.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 'cbBTC',
};

export const VAULT_DECIMALS: Record<string, number> = {
  [TRACKED_VAULTS.USDC.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDT.toLowerCase()]: 6,
  // Common ERC-20 18-decimal tokens
  [TRACKED_VAULTS.DAI.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDS.toLowerCase()]: 18,
  [TRACKED_VAULTS.CRVUSD.toLowerCase()]: 18,
  [TRACKED_VAULTS.WETH.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 6,
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 18,
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 8,
};

export const VAULT_CHAIN_IDS: Record<string, (typeof SUPPORTED_CHAIN_IDS)[number]> = {
  [TRACKED_VAULTS.USDC.toLowerCase()]: 1,
  [TRACKED_VAULTS.DAI.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDT.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDS.toLowerCase()]: 1,
  [TRACKED_VAULTS.CRVUSD.toLowerCase()]: 1,
  [TRACKED_VAULTS.WETH.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 8453,
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 8453,
};

export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
  747474: 'Katana',
};

export const getChainName = (chainId: number) => CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;

export const getChainLogoUrl = (chainId: number) =>
  `https://token-assets-one.vercel.app/api/chains/${chainId}/logo-32.png?fallback=true`;

export const VAULT_ASSET_TOKENS: Record<string, { chainId: number; tokenAddress: string }> = {
  [TRACKED_VAULTS.USDC.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  [TRACKED_VAULTS.DAI.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  [TRACKED_VAULTS.USDT.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  [TRACKED_VAULTS.USDS.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  },
  [TRACKED_VAULTS.CRVUSD.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
  },
  [TRACKED_VAULTS.WETH.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: {
    chainId: 8453,
    tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54BDA02913',
  },
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: {
    chainId: 8453,
    tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54BDA02913',
  },
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: {
    chainId: 8453,
    tokenAddress: '0x4200000000000000000000000000000000000006',
  },
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: {
    chainId: 8453,
    tokenAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
  },
};

export const getTokenLogoUrl = (chainId: number, tokenAddress: string) =>
  `https://token-assets-one.vercel.app/api/tokens/${chainId}/${tokenAddress.toLowerCase()}/logo-32.png?fallback=true`;
