import { TRACKED_VAULTS, VAULT_CHAIN_IDS, VAULT_NAMES, VAULT_SYMBOLS, getChainName } from '@/lib/envio/constants';
import VaultBadge from '@/components/shared/VaultBadge';
import { getEtherscanAddressUrl } from '@/lib/envio/utils';

export default function VaultsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#14233c_0%,#0b0f17_45%,#07090d_100%)] text-white">
      <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Yearn V3 Vaults</h1>
        <p className="text-lg text-good-ol-grey-400">
          All tracked Yearn V3 vaults on Ethereum Mainnet and Base.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(TRACKED_VAULTS).map(([symbol, address]) => {
          const lowerAddress = address.toLowerCase();
          const chainId = VAULT_CHAIN_IDS[lowerAddress] ?? 1;
          const assetSymbol = VAULT_SYMBOLS[lowerAddress] ?? symbol;
          return (
          <div key={address} className="card hover:border-yearn-blue/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <VaultBadge vaultAddress={address} chainId={chainId} />
                  <h3 className="text-xl font-bold text-white">
                    {VAULT_NAMES[lowerAddress]}
                  </h3>
                </div>
                <div className="text-sm text-good-ol-grey-400 font-mono">{address}</div>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={getEtherscanAddressUrl(address, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-good-ol-grey-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-good-ol-grey-500 mb-1">Type</div>
                  <div className="text-sm text-white">Yearn V3 Vault</div>
                </div>
                <div>
                  <div className="text-xs text-good-ol-grey-500 mb-1">Asset</div>
                  <div className="text-sm text-white">{assetSymbol}</div>
                </div>
                <div>
                  <div className="text-xs text-good-ol-grey-500 mb-1">Network</div>
                  <div className="text-sm text-white">{getChainName(chainId)}</div>
                </div>
                <div>
                  <div className="text-xs text-good-ol-grey-500 mb-1">Version</div>
                  <div className="text-sm text-white">V3</div>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
      </div>
    </div>
  );
}
