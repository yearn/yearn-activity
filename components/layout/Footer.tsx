export default function Footer() {
  return (
    <footer className="border-t border-good-ol-grey-700 bg-good-ol-grey-900">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-good-ol-grey-500">
            <p>Powered by Envio HyperIndex</p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://docs.yearn.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-good-ol-grey-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/yearn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-good-ol-grey-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/yearnfi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-good-ol-grey-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
