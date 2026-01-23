export const TRACKED_VAULTS = {
  USDC_1: '0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204',
  DAI_1: '0x028eC7330ff87667b6dfb0D94b954c820195336c',
  USDT_1: '0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa',
  USDS_1: '0x182863131F9a4630fF9E27830d945B1413e347E8',
  CRVUSD_2: '0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F',
  WETH_1: '0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0',
  WETH_2: '0xAc37729B76db6438CE62042AE1270ee574CA7571',
  WBTC_1: '0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708',
  USDC_2: '0xAe7d8Db82480E6d8e3873ecbF22cf17b3D8A7308',
  DAI_2: '0x92545bCE636E6eE91D88D2D017182cD0bd2fC22e',
  YBOLD: '0x9F4330700a36B29952869fac9b33f45EEdd8A3d8',
  SUSDAF: '0x89E93172AEF8261Db8437b90c3dCb61545a05317',
  YYB: '0x1F6f16945e395593d8050d6Cc33e4328a515B648',
  SKY: '0xaF71a4f5d93fb88B24C67760BCF9688a6C3A54D4',
  USDC_TRUE_YIELD: '0xb13CF163d916917d9cD6E836905cA5f12a1dEF4B',
  USDC_HORIZON: '0xc3BD0A2193c8F027B82ddE3611D18589ef3f62a9',
  WETH_HORIZON: '0x4d81C7d534D703E0a0AECaDF668C0E0253E1f1C3',
  CBBTC_HORIZON: '0x25f32eC89ce7732A4E9f8F3340a09259F823b7d3',
  CBETH_HORIZON: '0x989381F7eFb45F97E46BE9f390a69c5d94bf9e17',
  USND_ARB: '0x252b965400862d94BDa35FeCF7Ee0f204a53Cc36',
  USDC_E_2_ARB: '0x9FA306b1F4a6a83FEC98d8eBbaBEDfF78C407f6B',
  USDC_A_ARB: '0x6FAF8b7fFeE3306EfcFc2BA9Fec912b4d49834C1',
  USDT_A_ARB: '0xc0ba9bfED28aB46Da48d2B69316A3838698EF3f5',
  ARB_1: '0x7DEB119b92b76f78C212bc54FBBb34CEA75f4d4A',
  USDC_POLYGON: '0x34b9421Fe3d52191B64bC32ec1aB764dcBcDbF5e',
  USDC_E_POLYGON: '0xA013Fbd4b711f9ded6fB09C1c0d358E2FbC2EAA0',
  USDT_POLYGON: '0xBb287E6017d3DEb0e2E65061e8684eab21060123',
  DAI_POLYGON: '0x90b2f54C6aDDAD41b8f6c4fCCd555197BC0F773B',
  WETH_POLYGON: '0x305F25377d0a39091e99B975558b1bdfC3975654',
  WMATIC_POLYGON: '0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36',
} as const;

// Keep UI queries in sync with config.yaml.
export const SUPPORTED_CHAIN_IDS = [1, 8453, 42161, 137] as const;

export const VAULT_NAMES: Record<string, string> = {
  [TRACKED_VAULTS.USDC_1.toLowerCase()]: 'USDC-1 Vault (Ethereum)',
  [TRACKED_VAULTS.DAI_1.toLowerCase()]: 'DAI-1 Vault (Ethereum)',
  [TRACKED_VAULTS.USDT_1.toLowerCase()]: 'USDT-1 Vault (Ethereum)',
  [TRACKED_VAULTS.USDS_1.toLowerCase()]: 'USDS-1 Vault (Ethereum)',
  [TRACKED_VAULTS.CRVUSD_2.toLowerCase()]: 'CRVUSD-2 Vault (Ethereum)',
  [TRACKED_VAULTS.WETH_1.toLowerCase()]: 'WETH-1 Vault (Ethereum)',
  [TRACKED_VAULTS.WETH_2.toLowerCase()]: 'WETH-2 Vault (Ethereum)',
  [TRACKED_VAULTS.WBTC_1.toLowerCase()]: 'WBTC-1 Vault (Ethereum)',
  [TRACKED_VAULTS.USDC_2.toLowerCase()]: 'USDC-2 Vault (Ethereum)',
  [TRACKED_VAULTS.DAI_2.toLowerCase()]: 'DAI-2 Vault (Ethereum)',
  [TRACKED_VAULTS.YBOLD.toLowerCase()]: 'yBOLD Vault (Ethereum)',
  [TRACKED_VAULTS.SUSDAF.toLowerCase()]: 'sUSDaf Vault (Ethereum)',
  [TRACKED_VAULTS.YYB.toLowerCase()]: 'yYB Vault (Ethereum)',
  [TRACKED_VAULTS.SKY.toLowerCase()]: 'SKY Vault (Ethereum)',
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 'USDC True Yield Vault (Base)',
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 'USDC Horizon Vault (Base)',
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 'WETH Horizon Vault (Base)',
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 'cbBTC Horizon Vault (Base)',
  [TRACKED_VAULTS.CBETH_HORIZON.toLowerCase()]: 'cbETH Horizon Vault (Base)',
  [TRACKED_VAULTS.USND_ARB.toLowerCase()]: 'USND Vault (Arbitrum)',
  [TRACKED_VAULTS.USDC_E_2_ARB.toLowerCase()]: 'USDC.e-2 Vault (Arbitrum)',
  [TRACKED_VAULTS.USDC_A_ARB.toLowerCase()]: 'USDC-A Vault (Arbitrum)',
  [TRACKED_VAULTS.USDT_A_ARB.toLowerCase()]: 'USDT-A Vault (Arbitrum)',
  [TRACKED_VAULTS.ARB_1.toLowerCase()]: 'ARB-1 Vault (Arbitrum)',
  [TRACKED_VAULTS.USDC_POLYGON.toLowerCase()]: 'USDC Vault (Polygon)',
  [TRACKED_VAULTS.USDC_E_POLYGON.toLowerCase()]: 'USDC.e Vault (Polygon)',
  [TRACKED_VAULTS.USDT_POLYGON.toLowerCase()]: 'USDT Vault (Polygon)',
  [TRACKED_VAULTS.DAI_POLYGON.toLowerCase()]: 'DAI Vault (Polygon)',
  [TRACKED_VAULTS.WETH_POLYGON.toLowerCase()]: 'WETH Vault (Polygon)',
  [TRACKED_VAULTS.WMATIC_POLYGON.toLowerCase()]: 'WMATIC Vault (Polygon)',
};

export const VAULT_SYMBOLS: Record<string, string> = {
  [TRACKED_VAULTS.USDC_1.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.DAI_1.toLowerCase()]: 'DAI',
  [TRACKED_VAULTS.USDT_1.toLowerCase()]: 'USDT',
  [TRACKED_VAULTS.USDS_1.toLowerCase()]: 'USDS',
  [TRACKED_VAULTS.CRVUSD_2.toLowerCase()]: 'CRVUSD',
  [TRACKED_VAULTS.WETH_1.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.WETH_2.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.WBTC_1.toLowerCase()]: 'WBTC',
  [TRACKED_VAULTS.USDC_2.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.DAI_2.toLowerCase()]: 'DAI',
  [TRACKED_VAULTS.YBOLD.toLowerCase()]: 'yBOLD',
  [TRACKED_VAULTS.SUSDAF.toLowerCase()]: 'sUSDaf',
  [TRACKED_VAULTS.YYB.toLowerCase()]: 'yYB',
  [TRACKED_VAULTS.SKY.toLowerCase()]: 'SKY',
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 'cbBTC',
  [TRACKED_VAULTS.CBETH_HORIZON.toLowerCase()]: 'cbETH',
  [TRACKED_VAULTS.USND_ARB.toLowerCase()]: 'USND',
  [TRACKED_VAULTS.USDC_E_2_ARB.toLowerCase()]: 'USDC.e',
  [TRACKED_VAULTS.USDC_A_ARB.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.USDT_A_ARB.toLowerCase()]: 'USDT',
  [TRACKED_VAULTS.ARB_1.toLowerCase()]: 'ARB',
  [TRACKED_VAULTS.USDC_POLYGON.toLowerCase()]: 'USDC',
  [TRACKED_VAULTS.USDC_E_POLYGON.toLowerCase()]: 'USDC.e',
  [TRACKED_VAULTS.USDT_POLYGON.toLowerCase()]: 'USDT',
  [TRACKED_VAULTS.DAI_POLYGON.toLowerCase()]: 'DAI',
  [TRACKED_VAULTS.WETH_POLYGON.toLowerCase()]: 'WETH',
  [TRACKED_VAULTS.WMATIC_POLYGON.toLowerCase()]: 'WMATIC',
};

export const VAULT_DECIMALS: Record<string, number> = {
  [TRACKED_VAULTS.USDC_1.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDT_1.toLowerCase()]: 6,
  // Common ERC-20 18-decimal tokens
  [TRACKED_VAULTS.DAI_1.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDS_1.toLowerCase()]: 18,
  [TRACKED_VAULTS.CRVUSD_2.toLowerCase()]: 18,
  [TRACKED_VAULTS.WETH_1.toLowerCase()]: 18,
  [TRACKED_VAULTS.WETH_2.toLowerCase()]: 18,
  [TRACKED_VAULTS.WBTC_1.toLowerCase()]: 8,
  [TRACKED_VAULTS.USDC_2.toLowerCase()]: 6,
  [TRACKED_VAULTS.DAI_2.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 6,
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 18,
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 8,
  [TRACKED_VAULTS.CBETH_HORIZON.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDC_E_2_ARB.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDC_A_ARB.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDT_A_ARB.toLowerCase()]: 6,
  [TRACKED_VAULTS.ARB_1.toLowerCase()]: 18,
  [TRACKED_VAULTS.USDC_POLYGON.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDC_E_POLYGON.toLowerCase()]: 6,
  [TRACKED_VAULTS.USDT_POLYGON.toLowerCase()]: 6,
  [TRACKED_VAULTS.DAI_POLYGON.toLowerCase()]: 18,
  [TRACKED_VAULTS.WETH_POLYGON.toLowerCase()]: 18,
  [TRACKED_VAULTS.WMATIC_POLYGON.toLowerCase()]: 18,
};

export const VAULT_CHAIN_IDS: Record<string, (typeof SUPPORTED_CHAIN_IDS)[number]> = {
  [TRACKED_VAULTS.USDC_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.DAI_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDT_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDS_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.CRVUSD_2.toLowerCase()]: 1,
  [TRACKED_VAULTS.WETH_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.WETH_2.toLowerCase()]: 1,
  [TRACKED_VAULTS.WBTC_1.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDC_2.toLowerCase()]: 1,
  [TRACKED_VAULTS.DAI_2.toLowerCase()]: 1,
  [TRACKED_VAULTS.YBOLD.toLowerCase()]: 1,
  [TRACKED_VAULTS.SUSDAF.toLowerCase()]: 1,
  [TRACKED_VAULTS.YYB.toLowerCase()]: 1,
  [TRACKED_VAULTS.SKY.toLowerCase()]: 1,
  [TRACKED_VAULTS.USDC_TRUE_YIELD.toLowerCase()]: 8453,
  [TRACKED_VAULTS.USDC_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.WETH_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.CBBTC_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.CBETH_HORIZON.toLowerCase()]: 8453,
  [TRACKED_VAULTS.USND_ARB.toLowerCase()]: 42161,
  [TRACKED_VAULTS.USDC_E_2_ARB.toLowerCase()]: 42161,
  [TRACKED_VAULTS.USDC_A_ARB.toLowerCase()]: 42161,
  [TRACKED_VAULTS.USDT_A_ARB.toLowerCase()]: 42161,
  [TRACKED_VAULTS.ARB_1.toLowerCase()]: 42161,
  [TRACKED_VAULTS.USDC_POLYGON.toLowerCase()]: 137,
  [TRACKED_VAULTS.USDC_E_POLYGON.toLowerCase()]: 137,
  [TRACKED_VAULTS.USDT_POLYGON.toLowerCase()]: 137,
  [TRACKED_VAULTS.DAI_POLYGON.toLowerCase()]: 137,
  [TRACKED_VAULTS.WETH_POLYGON.toLowerCase()]: 137,
  [TRACKED_VAULTS.WMATIC_POLYGON.toLowerCase()]: 137,
};

export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
  747474: 'Katana',
};

export const getChainName = (chainId: number) => CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;

export const getChainLogoUrl = (chainId: number) =>
  `https://token-assets-one.vercel.app/api/chains/${chainId}/logo-32.png?fallback=true`;

export const VAULT_ASSET_TOKENS: Record<string, { chainId: number; tokenAddress: string }> = {
  [TRACKED_VAULTS.USDC_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  [TRACKED_VAULTS.DAI_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  [TRACKED_VAULTS.USDT_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  [TRACKED_VAULTS.USDS_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  },
  [TRACKED_VAULTS.CRVUSD_2.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
  },
  [TRACKED_VAULTS.WETH_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [TRACKED_VAULTS.WETH_2.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [TRACKED_VAULTS.WBTC_1.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  [TRACKED_VAULTS.USDC_2.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  [TRACKED_VAULTS.DAI_2.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  [TRACKED_VAULTS.YBOLD.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x6440f144b7e50d6a8439336510312d2f54beb01d',
  },
  [TRACKED_VAULTS.SUSDAF.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x9cf12ccd6020b6888e4d4c4e4c7aca33c1eb91f8',
  },
  [TRACKED_VAULTS.YYB.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x22222222aea0076fca927a3f44dc0b4fdf9479d6',
  },
  [TRACKED_VAULTS.SKY.toLowerCase()]: {
    chainId: 1,
    tokenAddress: '0x56072c95faa701256059aa122697b133aded9279',
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
  [TRACKED_VAULTS.CBETH_HORIZON.toLowerCase()]: {
    chainId: 8453,
    tokenAddress: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
  },
  [TRACKED_VAULTS.USND_ARB.toLowerCase()]: {
    chainId: 42161,
    tokenAddress: '0x4ecf61a6c2fab8a047ceb3b3b263b401763e9d49',
  },
  [TRACKED_VAULTS.USDC_E_2_ARB.toLowerCase()]: {
    chainId: 42161,
    tokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  },
  [TRACKED_VAULTS.USDC_A_ARB.toLowerCase()]: {
    chainId: 42161,
    tokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  },
  [TRACKED_VAULTS.USDT_A_ARB.toLowerCase()]: {
    chainId: 42161,
    tokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  },
  [TRACKED_VAULTS.ARB_1.toLowerCase()]: {
    chainId: 42161,
    tokenAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  },
  [TRACKED_VAULTS.USDC_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  },
  [TRACKED_VAULTS.USDC_E_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  },
  [TRACKED_VAULTS.USDT_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  [TRACKED_VAULTS.DAI_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  },
  [TRACKED_VAULTS.WETH_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  },
  [TRACKED_VAULTS.WMATIC_POLYGON.toLowerCase()]: {
    chainId: 137,
    tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  },
};

export const getTokenLogoUrl = (chainId: number, tokenAddress: string) =>
  `https://token-assets-one.vercel.app/api/tokens/${chainId}/${tokenAddress.toLowerCase()}/logo-32.png?fallback=true`;
