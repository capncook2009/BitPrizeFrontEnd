## 🏎️ &nbsp; Quickstart

### Running Development Server

Run the development server through `pnpm dev`.

Open [http://localhost:3000](http://localhost:3000) on your browser to see the resulting app.

### App Structure

The app follows the following structure:

- `pages` - All of the pages in the app!
- `components` - React components that make up the contents of the pages.
- `hooks` - App-specific hooks not included in other hook packages.
- `constants` - Constant values, references and configurations to deploy and run this app.
- `vaultLists` - Any default vault lists for the app.

### Data Configuration

Most of the data on the app comes from the `useSelectedVaults()` hook from the `hyperstructure-react-hooks` package. That hook returns a `Vaults` object from `hyperstructure-client-js`.

Using various hooks from `hyperstructure-react-hooks`, the app uses these `Vaults` or `Vault` objects to query all necessary data.

Viem Clients are configured through `wagmi` in the `/pages/_app.tsx` file. These can be fetched throughout the app with the `usePublicClient()` or `usePublicClients()` hooks.

### Environment Setup

Add your RPC URLs to `.env.local` for testing. A `.env.example` file is available for reference.

If none are provided, the app will use public RPCs which could potentially get rate-limited.
