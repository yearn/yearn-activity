import { formatAddress } from '@/lib/envio/utils';
import Link from 'next/link';

interface AddressDisplayProps {
  address: string;
  linkToUser?: boolean;
}

export default function AddressDisplay({ address, linkToUser = true }: AddressDisplayProps) {
  const formatted = formatAddress(address);

  if (linkToUser) {
    return (
      <Link
        href={`/user/${address}`}
        className="font-mono text-base text-good-ol-grey-200 hover:text-yearn-blue transition-colors"
      >
        {formatted}
      </Link>
    );
  }

  return <span className="font-mono text-base text-good-ol-grey-200">{formatted}</span>;
}
