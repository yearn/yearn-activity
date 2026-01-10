# Yearn Finance Live Stats

Real-time activity dashboard for Yearn Finance V3 vaults

## Features

- **Real-time Activity Feed**: Live feed of deposits and withdrawals across all tracked vaults
- **Protocol Statistics**: Overview of all tracked Yearn V3 vaults
- **User Activity**: Track individual user transactions and positions
- **Vault Details**: Information about each tracked vault

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Envio HyperIndex** - Blazing-fast blockchain indexer
- **GraphQL** - Query language for the Envio API

## Prerequisites

1. **Node.js 18+** and **pnpm** installed
2. **Envio Indexer** running locally or hosted

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# For local development with Envio
ENVIO_GRAPHQL_URL=http://localhost:8080/v1/graphql

# For production (hosted Envio)
# ENVIO_GRAPHQL_URL=https://indexer.hyperindex.xyz/YOUR_INDEXER_ID/v1/graphql
```

### 3. Start the Envio Indexer

In a separate terminal, start the Envio indexer:

```bash
pnpm envio dev
```

This will:
- Start the indexer and begin syncing blockchain data
- Launch Hasura GraphQL console at http://localhost:8080

Wait for the indexer to sync some data before proceeding.

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                      # Next.js 15 App Router
│   ├── page.tsx             # Homepage with dashboard
│   ├── activity/            # Activity feed page
│   ├── vaults/              # Vaults overview page
│   └── user/[address]/      # Individual user page
├── components/
│   ├── layout/              # Header, Footer
│   ├── activity/            # Activity-related components
│   └── shared/              # Reusable components
├── lib/
│   └── envio/               # Envio integration
│       ├── client.ts        # GraphQL client
│       ├── queries.ts       # GraphQL queries
│       ├── utils.ts         # Utility functions
│       └── constants.ts     # Vault addresses
└── config.yaml              # Envio indexer configuration
```

## Tracked Vaults

The following Yearn V3 vaults are currently indexed on Ethereum Mainnet:

- **USDC Vault**: `0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`
- **DAI Vault**: `0x028eC7330ff87667b6dfb0D94b954c820195336c`
- **USDT Vault**: `0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`
- **USDS Vault**: `0x182863131F9a4630fF9E27830d945B1413e347E8`
- **CRVUSD Vault**: `0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F`
- **WETH Vault**: `0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`

## Enhancing Your Envio Indexer

The app currently works with basic event data, but you can add more fields to unlock additional features:

### Quick Start: Add Transaction Hash

To enable Etherscan links, add the `transactionHash` field:

```typescript
// In your Envio handler
DepositEvent.loader({
  requiredEntities: [],
  handler: ({ event, context }) => {
    context.Deposit.set({
      id: event.chainId + "_" + event.block.number + "_" + event.logIndex,
      transactionHash: event.transaction.hash, // Enables Etherscan links
      blockTimestamp: event.block.timestamp,   // Accurate time display
      blockNumber: event.block.number,         // Better sorting
      sender: event.params.sender,
      owner: event.params.owner,
      assets: event.params.assets,
      shares: event.params.shares,
      vaultAddress: event.srcAddress,
    });
  },
});
```

### Recommended Fields

See [ENVIO_SCHEMA_GUIDE.md](./ENVIO_SCHEMA_GUIDE.md) for a comprehensive list of fields you can add:
- **Transaction context**: timestamps, gas costs, block data
- **Financial data**: USD values, share prices, TVL
- **User analytics**: position tracking, ROI calculations
- **Enhanced UX**: ENS names, vault symbols
- **Performance metrics**: APY, earnings, strategy data

## Adding More Vaults

To track additional vaults:

1. Add the vault address to `config.yaml` under the `contracts` section
2. Restart the Envio indexer
3. Add the vault to `lib/envio/constants.ts`

## Customization

### Fonts

The app is configured to use **Aeonik** font (Yearn's brand font). To add the actual fonts:

1. Download Aeonik from [cotypefoundry.com](https://cotypefoundry.com)
2. Place `.woff2` files in `public/fonts/`
3. Update `app/fonts.ts` with the correct paths

### Colors

The app uses Yearn's official brand colors defined in `tailwind.config.ts`:

- **Yearn Blue**: `#0675F9`
- **Good ol' Grey** scale (100-900)
- **Secondary colors**: Metaverse Sunset, Disco Salmon, Tokyo Party, Up Only Green

## API Routes

The app uses Next.js Server Components for data fetching. You can also create API routes:

```typescript
// app/api/activity/route.ts
import { getRecentActivity } from '@/lib/envio/queries';

export async function GET() {
  const data = await getRecentActivity(50);
  return Response.json(data);
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `ENVIO_GRAPHQL_URL`: Your hosted Envio endpoint
4. Deploy

### Deploy Envio Indexer

For production, use Envio's hosted service:

1. Push your indexer to GitHub
2. Connect to Envio's hosted service
3. Get your production GraphQL endpoint
4. Update environment variables

## Performance

- **Server-side caching**: 30-second revalidation for activity feeds
- **Client-side caching**: Use SWR or TanStack Query for real-time updates
- **Incremental Static Regeneration**: Pages automatically update

## Troubleshooting

### "Unable to load activity data"

- Make sure the Envio indexer is running: `pnpm envio dev`
- Check that `ENVIO_GRAPHQL_URL` is correctly set in `.env.local`
- Verify the indexer has synced data by visiting http://localhost:8080

### "No activity found"

- Wait for the indexer to sync blockchain data
- Check the Hasura console to verify data is being indexed
- Ensure the tracked vaults have recent transactions

### GraphQL errors

- Check that the GraphQL endpoint is accessible
- Verify the Envio indexer is running
- Review error messages in the browser console

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Envio Documentation](https://docs.envio.dev)
- [Yearn Finance](https://yearn.fi)
- [Specification](./spec.md)

## License

MIT