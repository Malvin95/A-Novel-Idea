# A Novel Idea - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Development Workflow](#development-workflow)
3. [Deployment](#deployment)
4. [Environment Variables](#environment-variables)
5. [Architecture](#architecture)
6. [Technology Stack](#technology-stack)
7. [Project Structure](#project-structure)
8. [Authentication System](#authentication-system)
9. [API Documentation](#api-documentation)
10. [Database & Data Layer](#database--data-layer)
11. [Feature Flags & Mocking](#feature-flags--mocking)
12. [Testing Strategy](#testing-strategy)

---

## Project Overview

**A Novel Idea** is a full-stack Next.js application for managing R&D tax credit claims and projects. The application provides a dashboard interface for creating, viewing, updating, and deleting both projects and associated claims.

### Key Features
- 🔐 **Authentication** - AWS Cognito integration with mock auth for development
- 📊 **Dashboard** - Real-time project and claim management
- 🎯 **Claims Management** - Track R&D claims with status workflows (Draft → Submitted → Approved)
- 📁 **Project Tracking** - Organize claims by associated projects
- 🧪 **Development Mocking** - Feature-flagged mock data and authentication
- 🎨 **Design System** - Atomic design pattern with Storybook
- ✅ **Testing** - Unit, integration, and E2E tests

---

## Development Workflow

### Getting Started

1. **Clone repository**
   ```bash
   git clone https://github.com/Malvin95/A-Novel-Idea.git
   cd A-Novel-Idea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access application**
   - App: http://localhost:3000
   - Storybook: http://localhost:6006 (run `npm run storybook`)

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing
npm test                 # Run Jest tests
npx playwright test      # Run E2E tests
npm run test:watch       # Watch mode

# Storybook
npm run storybook        # Start Storybook
npm run build-storybook  # Build static Storybook
```

### Development with Mocks

**Full Mock Mode** (no AWS required):
```bash
# .env.local
USE_MOCKS=true
USE_MOCK_AUTH=true
```

**Partial Mock Mode**:
```bash
USE_MOCKS=true
USE_MOCK_AUTH=false
FEATURE_FLAGS_JSON={"projects":true,"claims":false}
```

**Production Mode** (real AWS services):
```bash
USE_MOCKS=false
USE_MOCK_AUTH=false
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-secret
COGNITO_ISSUER=your-issuer-url
```

### Coding Standards

**TypeScript**:
- Use explicit types (avoid `any`)
- Define interfaces in `src/shared/interfaces.ts`
- Use enums for fixed sets of values

**Components**:
- Follow Atomic Design (atoms → molecules → organisms)
- Use TypeScript for props
- Add Storybook stories for new components

**API Routes**:
- Wrap with `withMock` for feature flag support
- Use service layer for business logic
- Return proper HTTP status codes

**Styling**:
- Use TailwindCSS utility classes
- Follow existing patterns for consistency
- Support dark mode where applicable

---

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Vercel Deployment

The project is configured for Vercel deployment:

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - automatic on push to main

### Environment Variables (Production)

Required in Vercel environment:

```bash
# Database
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Authentication
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-secret
COGNITO_ISSUER=your-issuer
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# Feature Flags (should be false in production)
USE_MOCKS=false
USE_MOCK_AUTH=false
```

### AWS Setup

**DynamoDB Tables**:
1. Create `a-novel-project-table-v2` with keys: `id` (partition), `dateCreated` (sort)
2. Create `a-novel-claims-table-v2` with keys: `id` (partition), `dateCreated` (sort)

**Cognito**:
1. Create User Pool
2. Create App Client
3. Configure OAuth settings
4. Set callback URLs: `https://your-domain.com/api/auth/callback/cognito`

**IAM Permissions**:
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:Scan",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem"
  ],
  "Resource": [
    "arn:aws:dynamodb:region:account:table/a-novel-project-table-v2",
    "arn:aws:dynamodb:region:account:table/a-novel-claims-table-v2"
  ]
}
```

---

## Environment Variables

### Complete Environment Variable Reference

```bash
# ============================================
# AWS Configuration
# ============================================
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# ============================================
# Authentication (NextAuth.js + Cognito)
# ============================================
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_CLIENT_SECRET=your-cognito-client-secret
COGNITO_ISSUER=https://cognito-idp.region.amazonaws.com/user-pool-id
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# ============================================
# Feature Flags (Development)
# ============================================
# Global mock toggle - returns mock data from JSON/mockStore
USE_MOCKS=true

# Mock authentication - sign in with any email/password
USE_MOCK_AUTH=true

# Per-endpoint feature flags (JSON string)
FEATURE_FLAGS_JSON={"projects":true,"claims":false}

# Force mocks even in production (use with caution!)
DEV_ALWAYS_MOCK=false

# ============================================
# Vercel (Auto-populated)
# ============================================
VERCEL_OIDC_TOKEN=auto-populated-by-vercel
NOVEL_BLOB_READ_WRITE_TOKEN=auto-populated-by-vercel

# ============================================
# Node Environment
# ============================================
NODE_ENV=development
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│              React 19 + Next.js 16 (App Router)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                        │
│          (Authentication & Route Protection)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Routes Layer                         │
│         /api/projects, /api/claims, /api/auth               │
│              (withMock HOC for feature flags)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│       projects.services.ts, claims.service.ts                │
│          (Business logic & data transformation)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│         AWS DynamoDB (Production)                            │
│         Mock Store (Development)                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

- **Atomic Design**: Components organized as atoms → molecules → organisms
- **Server-Side Rendering**: Next.js App Router with React Server Components
- **API Route Pattern**: Pages API Routes with service layer separation
- **HOC Pattern**: `withMock` wrapper for feature-flagged endpoints
- **Repository Pattern**: Service layer abstracts data access

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **Styling**: TailwindCSS 4 + Radix UI
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5

### Backend
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4 + AWS Cognito
- **Database**: AWS DynamoDB
- **AWS SDK**: @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb

### Development
- **Testing**: Jest + React Testing Library + Playwright
- **Storybook**: Component documentation and testing
- **Linting**: ESLint 9
- **Package Manager**: npm

---

## Project Structure

```
A-Novel-Idea/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   ├── projects/         # Projects page
│   │   │   │   └── claims/           # Claims page
│   │   │   └── layout.tsx            # Dashboard layout
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Root redirect
│   │
│   ├── components/                   # UI Components (Atomic Design)
│   │   ├── atoms/                    # Basic UI elements
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── NavLink.tsx
│   │   │   ├── Typography.tsx
│   │   │   └── ui/                   # Shadcn components
│   │   ├── molecules/                # Composite components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── InfoCard.tsx
│   │   │   ├── NewProjectDialogeButton.tsx
│   │   │   ├── NewClaimDialogButton.tsx
│   │   │   ├── EditProjectDialogButton.tsx
│   │   │   ├── EditClaimDialogButton.tsx
│   │   │   └── DeleteDialogButton.tsx
│   │   ├── organisms/                # Complex components
│   │   │   ├── DashboardPanel.tsx
│   │   │   ├── ProjectsPanel.tsx
│   │   │   └── ClaimsPanel.tsx
│   │   └── providers/                # Context providers
│   │
│   ├── pages/                        # Pages Router (API only)
│   │   └── api/                      # API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth].ts  # NextAuth handler
│   │       ├── projects/
│   │       │   ├── index.ts          # GET, POST /api/projects
│   │       │   └── [id].ts           # GET, PATCH, DELETE /api/projects/:id
│   │       ├── claims/
│   │       │   ├── index.ts          # GET, POST /api/claims
│   │       │   └── [id].ts           # GET, PATCH, DELETE /api/claims/:id
│   │       ├── config/
│   │       │   └── auth-mode.ts      # GET /api/config/auth-mode
│   │       └── protected/
│   │           └── example.ts        # Protected API example
│   │
│   ├── services/                     # Business Logic Layer
│   │   ├── projects/
│   │   │   ├── projects.services.ts
│   │   │   └── projects.services.test.ts
│   │   ├── claims/
│   │   │   ├── claims.service.ts
│   │   │   └── claims.service.test.ts
│   │   └── stubData.ts               # Mock data
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── api/
│   │   │   └── withMock.ts           # Feature flag HOC
│   │   ├── auth/
│   │   │   ├── nextAuth.ts           # NextAuth config
│   │   │   └── server.ts             # Server-side auth helpers
│   │   ├── mocks/
│   │   │   ├── mockStore.ts          # In-memory mock data store
│   │   │   ├── projects.json         # Static mock projects
│   │   │   └── claims.json           # Static mock claims
│   │   ├── dynamo.ts                 # DynamoDB client
│   │   ├── featureFlags.ts           # Feature flag logic
│   │   └── utils.ts                  # Utility functions
│   │
│   ├── shared/                       # Shared types & constants
│   │   ├── interfaces.ts             # TypeScript interfaces
│   │   └── enums.ts                  # Enums (claim status)
│   │
│   ├── __tests__/                    # Test files
│   │   └── api/
│   │       ├── testServer.ts         # Test server helper
│   │       ├── projects.api.test.ts
│   │       ├── claims.api.test.ts
│   │       └── featureFlags.api.test.ts
│   │
│   └── middleware.ts                 # Next.js middleware (auth)
│
├── tests/                            # E2E tests
│   └── example.spec.ts
│
├── docs/                             # Documentation
│   ├── MOCK_AUTH.md
│   └── PROJECT_DOCUMENTATION.md
│
├── .storybook/                       # Storybook config
├── storybook-static/                 # Built Storybook
├── playwright-report/                # Playwright reports
├── public/                           # Static assets
│
├── .env.local                        # Local environment variables
├── .gitignore
├── API.md                            # API documentation
├── README.md
├── package.json
├── tsconfig.json
├── jest.config.ts
├── jest.setup.ts
├── playwright.config.ts
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── components.json                   # Shadcn config
```

---

## Authentication System

### Overview
The application uses **NextAuth.js** with AWS Cognito for production authentication and supports mock authentication for local development.

### Authentication Flow

```
User → Login Page → NextAuth.js → Cognito/Mock → JWT Token → Session Cookie
                                                      ↓
                                            Middleware checks cookie
                                                      ↓
                                         Protected routes accessible
```

### NextAuth Configuration

**Location**: `src/lib/auth/nextAuth.ts`

```typescript
const useMockAuth = process.env.USE_MOCK_AUTH === "true";

export const authOptions: NextAuthOptions = {
  providers: useMockAuth ? [CredentialsProvider] : [CognitoProvider],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: { signIn, redirect, jwt, session }
};
```

### Middleware Protection

**Location**: `src/middleware.ts`

- **Protected Routes**: `/dashboard/*` - requires authentication
- **Public Routes**: `/login`, `/register` - accessible without auth
- **Bypass**: `/api/auth/*` - NextAuth callback URLs

The middleware checks for NextAuth session cookies and redirects unauthenticated users to `/login`.

### Mock Authentication

**Feature**: `USE_MOCK_AUTH=true` in `.env.local`

Allows signing in with any email/password for development without AWS Cognito setup.

**See**: `docs/MOCK_AUTH.md` for full documentation.

---

## API Documentation

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://domain-not-yet-implemented/api` - A stretch goal

### API Endpoints

#### Projects API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | List all projects | No |
| POST | `/api/projects` | Create new project | No |
| GET | `/api/projects/:id` | Get project by ID | No |
| PATCH | `/api/projects/:id` | Update project | No |
| DELETE | `/api/projects/:id` | Delete project | No |

**Query Parameters (for specific project)**:
- `id` - Project ID
- `dateCreated` - ISO 8601 timestamp

**Request Body (POST/PATCH)**:
```json
{
  "projectName": "string"
}
```

**Response (GET single)**:
```json
{
  "Item": {
    "id": { "S": "uuid" },
    "dateCreated": { "S": "2024-01-01T00:00:00.000Z" },
    "projectName": { "S": "Project Alpha" }
  }
}
```

#### Claims API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/claims` | List all claims | No |
| POST | `/api/claims` | Create new claim | No |
| GET | `/api/claims/:id` | Get claim by ID | No |
| PATCH | `/api/claims/:id` | Update claim | No |
| DELETE | `/api/claims/:id` | Delete claim | No |

**Request Body (POST)**:
```json
{
  "companyName": "string",
  "claimPeriod": "string",
  "amount": number,
  "associatedProject": "string",
  "status": "Draft" | "Submitted" | "Approved"
}
```

**Request Body (PATCH)**:
```json
{
  "companyName": "string",      // optional
  "claimPeriod": "string",       // optional
  "amount": number,              // optional
  "associatedProject": "string", // optional
  "status": "Draft" | "Submitted" | "Approved" // optional
}
```

#### Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/signin` | Sign in page/handler |
| GET/POST | `/api/auth/signout` | Sign out handler |
| GET | `/api/auth/session` | Get current session |
| GET | `/api/auth/providers` | List auth providers |
| GET | `/api/auth/callback/:provider` | OAuth callback |

#### Config API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config/auth-mode` | Get auth mode (mock/cognito) |

**Response**:
```json
{
  "useMockAuth": true,
  "mode": "mock"
}
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

**Status Codes**:
- `200` - Success
- `201` - Created
- `204` - No Content (delete success)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Database & Data Layer

### DynamoDB Tables

#### Projects Table
**Table Name**: `a-novel-project-table-v2`

**Primary Key**:
- Partition Key: `id` (String)
- Sort Key: `dateCreated` (String)

**Attributes**:
- `id` - UUID v7
- `dateCreated` - ISO 8601 timestamp
- `projectName` - String

#### Claims Table
**Table Name**: `a-novel-claims-table-v2`

**Primary Key**:
- Partition Key: `id` (String)
- Sort Key: `dateCreated` (String)

**Attributes**:
- `id` - UUID v7
- `dateCreated` - ISO 8601 timestamp
- `companyName` - String
- `claimPeriod` - String (e.g., "2024-01")
- `amount` - Number
- `associatedProject` - String
- `status` - String (Draft|Submitted|Approved)

### DynamoDB Client

**Location**: `src/lib/dynamo.ts`

```typescript
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});
```

### Service Layer

**Projects Service**: `src/services/projects/projects.services.ts`
- `getProjects()` - Scan all projects
- `getProject(id, dateCreated)` - Get single project
- `createProject(data)` - Create new project
- `updateProject(id, dateCreated, data)` - Update project
- `deleteProject(id, dateCreated)` - Delete project

**Claims Service**: `src/services/claims/claims.service.ts`
- `getClaims()` - Scan all claims
- `getClaim(id, dateCreated)` - Get single claim
- `createClaim(data)` - Create new claim
- `updateClaim(id, dateCreated, data)` - Update claim (partial)
- `deleteClaim(id, dateCreated)` - Delete claim

### Data Types

**Location**: `src/shared/interfaces.ts`

```typescript
interface Project {
  id?: string;
  dateCreated: string;
  projectName: string;
}

interface Claim {
  id?: string;
  dateCreated?: string;
  companyName: string;
  claimPeriod: string;
  amount: number;
  associatedProject: string;
  status: status;
}

enum status {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved"
}
```

---

## Feature Flags & Mocking

### Feature Flag System

**Purpose**: Enable/disable mock data responses for development without external dependencies.

**Location**: `src/lib/featureFlags.ts`

```typescript
export function shouldUseMock(endpointName: string): boolean {
  // 1. Check per-endpoint flag in FEATURE_FLAGS_JSON
  // 2. Check global USE_MOCKS flag
  // 3. Default to mocks in development
  // 4. Respect DEV_ALWAYS_MOCK override
}
```

### Mock Wrapper

**Location**: `src/lib/api/withMock.ts`

Higher-order function that wraps API handlers:

```typescript
export function withMock(
  handler: NextApiHandler, 
  endpointName: string
): NextApiHandler {
  return async (req, res) => {
    if (shouldUseMock(endpointName)) {
      // Return mock data from mockStore or JSON files
      return res.json(mockData);
    }
    // Execute real handler
    return handler(req, res);
  };
}
```

### Mock Data Store

**Location**: `src/lib/mocks/mockStore.ts`

In-memory store for dynamic mock data supporting full CRUD operations:

```typescript
// Functions:
getMockProjects(), getMockClaims()
addMockProject(name), addMockClaim(data)
updateMockProject(id, dateCreated, data)
updateMockClaim(id, dateCreated, data)
deleteMockProject(id, dateCreated)
deleteMockClaim(id, dateCreated)
```

### Environment Variables

```bash
# Enable all mocks
USE_MOCKS=true

# Per-endpoint control
FEATURE_FLAGS_JSON={"projects":true,"claims":false}

# Force mocks in production (use with caution)
DEV_ALWAYS_MOCK=true

# Mock authentication
USE_MOCK_AUTH=true
```

### Mock vs Real Data Flow

```
API Request
    ↓
withMock HOC
    ↓
shouldUseMock() → true ─→ Mock Store/JSON → Response
                ↓ false
                ↓
         Real Handler → Service Layer → DynamoDB → Response
```

---

## Testing Strategy

### Test Organization

```
src/
├── __tests__/              # Integration tests
│   └── api/
│       ├── testServer.ts   # Express test server
│       ├── projects.api.test.ts
│       ├── claims.api.test.ts
│       └── featureFlags.api.test.ts
├── services/
│   ├── projects/
│   │   └── projects.services.test.ts
│   └── claims/
│       └── claims.service.test.ts
tests/
└── example.spec.ts         # E2E tests
```

### Unit Tests (Jest)

**Run**: `npm test`

**Configuration**: `jest.config.ts`

Tests service layer functions with mocked DynamoDB client:

```typescript
jest.mock("@/lib/dynamo", () => ({
  ddbDocClient: { send: jest.fn() }
}));

describe("projects.services", () => {
  it("returns all projects", async () => {
    mockSend.mockResolvedValueOnce({ Items: mockItems });
    const result = await getProjects();
    expect(result.Items.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests (Supertest)

Tests API routes end-to-end with mock Express server:

```typescript
const app = createApiTestApp([
  { path: "/api/projects", method: "get", handler: projectsHandler }
]);

describe("Projects API", () => {
  it("returns all projects", async () => {
    const response = await request(app).get("/api/projects");
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests (Playwright)

**Run**: `npx playwright test`

**Configuration**: `playwright.config.ts`

Tests full user workflows in actual browser:

```typescript
test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle(/A Novel/);
});
```

### Component Tests (Storybook)

**Run**: `npm run storybook`

Interactive component documentation and visual testing.

### Test Coverage

```bash
npm test -- --coverage
```

---

## Additional Resources

### Documentation
- [API Documentation](../API.md) - Detailed API reference
- [Mock Auth Guide](../docs/MOCK_AUTH.md) - Mock authentication setup
- [Next.js Docs](https://nextjs.org/docs) - Next.js documentation
- [NextAuth.js Docs](https://next-auth.js.org/) - Authentication documentation

### Component Library
- **Storybook**: Run `npm run storybook` to view component library
- **Radix UI**: https://www.radix-ui.com/
- **TailwindCSS**: https://tailwindcss.com/

### Testing
- **Jest**: https://jestjs.io/
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev/

---

## Troubleshooting

### Common Issues

**Build Errors**: "Cannot find module"
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript paths in `tsconfig.json`

**Authentication Fails**
- Verify `NEXTAUTH_SECRET` is set
- Check Cognito credentials are correct
- For mock auth, ensure `USE_MOCK_AUTH=true` and restart dev server

**DynamoDB Errors**
- Verify AWS credentials are set
- Check table names match (`a-novel-project-table-v2`, `a-novel-claims-table-v2`)
- Ensure IAM permissions allow DynamoDB operations

**Mock Data Not Working**
- Set `USE_MOCKS=true` in `.env.local`
- Restart dev server after changing env variables
- Check console for "🧪 Mock" log messages

**Tests Failing**
- Run `npm test -- --clearCache` to clear Jest cache
- Ensure `USE_MOCKS=false` in test environment
- Check mock implementations are correct

---

## Contributing

### Pull Request Process

1. Create feature branch from `main`
2. Make changes following coding standards
3. Add/update tests for new features
4. Run `npm test` and `npm run build` to verify
5. Update documentation as needed
6. Submit PR with clear description

### Commit Message Format

```
type(scope): description

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## License

This project is private and proprietary.

---

## Support

For questions or issues:
- Open GitHub Issue
- Contact project maintainer

---

**Last Updated**: November 20, 2025
**Version**: 0.1.0
