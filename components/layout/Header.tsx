import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-good-ol-grey-700 bg-good-ol-grey-900/95 backdrop-blur">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/yearn-logo.svg"
                alt="Yearn Finance"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <div className="text-2xl font-bold">
                <span className="text-white">Live</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-lg font-medium text-good-ol-grey-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/activity"
                className="text-lg font-medium text-good-ol-grey-400 hover:text-white transition-colors"
              >
                Activity
              </Link>
              <Link
                href="/vaults"
                className="text-lg font-medium text-good-ol-grey-400 hover:text-white transition-colors"
              >
                Vaults
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://yearn.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/yearn-logo.svg"
                alt="Yearn Finance"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
