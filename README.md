This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


## Feature-flagged mocked endpoints (dev)

This project supports returning developer-specified mock payloads from API routes when running in development. Use feature flags to control whether an API route returns a mock payload or runs the real handler (which hits the DB).

Environment variables (recommended):

- `USE_MOCKS` — global toggle (`true`/`false`). When `true`, API routes using the mock wrapper will return mock JSON files found under `src/lib/mocks/*.json`.
- `USE_MOCK_AUTH` — enable mock authentication (`true`/`false`). When `true`, you can sign in with any email/password without AWS Cognito. [Learn more](docs/MOCK_AUTH.md)
- `FEATURE_FLAGS_JSON` — optional JSON string mapping per-endpoint flags, for example: `{"projects":true,"claims":false}`.
- `DEV_ALWAYS_MOCK` — set `true` to force mocks even when `NODE_ENV=production` (use with caution).

Examples:

Create a `.env.local` with:

```dotenv
USE_MOCKS=true
USE_MOCK_AUTH=true
FEATURE_FLAGS_JSON={"projects":true,"claims":true}
```

Mock files are stored in `src/lib/mocks/` and are served when mocking is enabled. The API wrapper used by routes is `src/lib/api/withMock.ts`.

To run development with mocks enabled:

```powershell
#$env:USE_MOCKS='true'; npm run dev
npm run dev
```

To run dev forcing DB behavior (ensure DB credentials are available):

```powershell
#$env:USE_MOCKS='false'; npm run dev
npm run dev
```

See `src/lib/featureFlags.ts` and `src/lib/api/withMock.ts` for implementation details.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
