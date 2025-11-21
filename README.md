## Fun Fact

This project has been deployed and [you can view it here](https://anovelidea.vercel.app/).

Logging in currently works via Cognito (other methods will soon be implemented!). *Please reach out to me Directly to get the login details!!*

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

## Quick start for mocked development (TL;DR)

```powershell
#$env:USE_MOCKS='true'; USE_MOCK_AUTH=true
npm run dev
```

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

To run dev forcing DB behavior (ensure DB credentials are available):

```powershell
#$env:USE_MOCKS='false'; npm run dev
npm run dev
```

See `src/lib/featureFlags.ts` and `src/lib/api/withMock.ts` for implementation details.

# Reflections

## Architecture Decisions
For development I decided to use next JS as the react framework that would allow me to easily set up a project that would also utilise AWS features as nextJS Integrates with AWS very well, I then decided to use TailwindCSS as it easily allows me to style components in a clear in Direct way and I further used Shadcn which is radix under the hood, allowing me to use a component library to quickly build the dashboard, whilst also having more flexibility and control over styling.
For the backend, I used NextJS API routing with NextAuth and AWS Cognito, DynamoDB for databasing, and some of the AWS SDK for easy connection to DynamoDB. 

My heavy focus on using NextJS was primarily because of the serverless infrastructure provided by Vercel, which allows your code to be easily deployed to via GitHub. Since it typically runs the backend of the application on AWS Lambdas, it made the ground-up development of the application a very good fit for the requirements of this coding challenge. Add on top of that the fact that ReactJS integrates directly with and is managed by Vercel, NextJS was the logical decision.

API handling would be done via the projects structure, which meant that handling routing of the application and data handling for CRUD actions would be easier since data could easily be handled via the next API request and response handlers that would know a route based on the project files location
e.g. `C:/*/app/api/projects/index.ts` would handle `http://localhost:3000/api/projects`
And from there we could do our own CRUD actions if we specified them. And even further specifying `http://localhost:3000/api/projects/12345` would allow us to perform actions on a specific item.


## AI Usage
To build the app, I did utilise AI to handle a lot of repetitive or heavy lifting tasks I used it for:
- handling the pr checklists 
- handling commit messages generated (CoPilot)
- whenever I needed to ‘rubber duck’ and understand what the logic for something could be.
- being able to bugsniff
- handle that generation of frontend components
- Generate tests and documentation

There are a couple of ways that AI would have been implemented, either by my conceptual understanding of what would be needed and a first pass implementation, or by asking the AI how it would handle something that has already been built, but there has been a blocker that has halted my progress.
Before anything would be committed, I would then read over everything to know: what has been changed, how the change affects the code base, and why it has been changed. Additionally, this would all be done iteratively, so features would have been focused on and started out small so that each merge could be understood and would be trackable.
The risks I did spot could be a further issue with removing my hands from the wheel and almost letting AI build the app top to bottom without understanding what has been implemented. Although the idea of it seems like a dream, it would be hollow, as you run possible security risks and code that isn’t the most human-readable. Despite this, I’ve tried to ensure that the code has had my input firmly throughout.

## Improvements
With more time, I would have hoped to have implemented a lot more concerning the authentication so that it's not just Cognito doing a lot of the heavy lifting, but instead NextAuth that would also be able to handle the logging in easily, this would allow the UI to be consistent and clean. I would also like to have cleaned up the UI so that the UI is a bit more effectively readable and human-friendly. 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).