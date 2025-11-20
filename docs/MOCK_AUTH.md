# Mock Authentication for Development

## Overview

This application supports **mock authentication** for local development, allowing you to bypass AWS Cognito and sign in with any email/password combination. This is useful for:

- 🚀 Faster development without Cognito setup
- 🧪 Testing authentication flows
- 👥 Simulating different users
- 🔧 Debugging auth-related features

## How to Enable

Add the following to your `.env.local` file:

```bash
USE_MOCK_AUTH=true
```

## How It Works

When `USE_MOCK_AUTH=true`:

1. **NextAuth.js** switches from the Cognito provider to a Credentials provider
2. The **login page** accepts any email/password and creates a session
3. The **Header** shows "🧪 Mock Auth Mode" indicator
4. All authentication flows work identically to production

## Usage

### Sign In with Mock Auth

1. Navigate to `/login`
2. Enter **any email address** (e.g., `dev@example.com`)
3. Enter **any password** (not validated)
4. Click "Sign in"
5. You'll be redirected to `/dashboard` with a valid session

### Mock User Details

The mock user will have:
- **ID**: `mock-user-123`
- **Email**: Whatever you entered
- **Name**: Username part of the email (before @)

### Example

```
Email: alice@example.com
Password: anything

Results in:
{
  id: "mock-user-123",
  email: "alice@example.com",
  name: "alice"
}
```

## Switching Back to Cognito

To use real AWS Cognito authentication:

```bash
USE_MOCK_AUTH=false
# or remove the variable entirely
```

Then restart your development server.

## Security Notes

⚠️ **Important**: Mock authentication is **only for development**

- The mock provider is controlled by an environment variable
- It will NOT work in production (requires Cognito credentials)
- Never commit `USE_MOCK_AUTH=true` to production environments
- The login page shows a clear "🧪 Mock Auth Mode" indicator

## Combining with API Mocks

You can use mock auth alongside API endpoint mocks:

```bash
# .env.local
USE_MOCK_AUTH=true    # Mock authentication
USE_MOCKS=true        # Mock API responses
```

This gives you a **fully mocked development environment** without requiring:
- AWS Cognito setup
- DynamoDB tables
- Any external services

## API Endpoint

The auth mode can be checked via:

```
GET /api/config/auth-mode
```

Response:
```json
{
  "useMockAuth": true,
  "mode": "mock"
}
```

## Troubleshooting

### "Session not found" after enabling mock auth

1. Clear your browser cookies
2. Restart the Next.js dev server
3. Try signing in again

### Mock auth not working

1. Ensure `USE_MOCK_AUTH=true` is in `.env.local`
2. Restart your dev server (`npm run dev`)
3. Check the console for "🧪 Mock" log messages
4. Verify no Cognito errors in the terminal

## Code Implementation

The mock auth is implemented in:
- `src/lib/auth/nextAuth.ts` - Provider switching logic
- `src/app/(auth)/login/page.tsx` - Login UI adaptations
- `src/pages/api/config/auth-mode.ts` - Auth mode API
- `.env.local` - Environment configuration
