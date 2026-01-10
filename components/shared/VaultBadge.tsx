import { VAULT_ASSET_TOKENS, VAULT_SYMBOLS, getTokenLogoUrl } from '@/lib/envio/constants';
import { getEtherscanAddressUrl } from '@/lib/envio/utils';
import Image from 'next/image';

interface VaultBadgeProps {
  vaultAddress: string;
  chainId?: number;
}

export default function VaultBadge({ vaultAddress, chainId = 1 }: VaultBadgeProps) {
  const symbol = VAULT_SYMBOLS[vaultAddress.toLowerCase()] || 'Unknown';
  const href = getEtherscanAddressUrl(vaultAddress, chainId);
  const asset = VAULT_ASSET_TOKENS[vaultAddress.toLowerCase()];
  const logoSrc = asset ? getTokenLogoUrl(asset.chainId, asset.tokenAddress) : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="View token contract on Etherscan"
      className="inline-flex items-center rounded-md bg-yearn-blue/12 px-3 py-1.5 text-sm font-semibold text-yearn-blue ring-1 ring-inset ring-yearn-blue/30 hover:bg-yearn-blue/16 hover:ring-yearn-blue/50 transition-colors"
    >
      {logoSrc ? <Image src={logoSrc} alt={symbol} width={16} height={16} className="mr-2 h-4 w-4" /> : null}
      {symbol}
    </a>
  );
}
