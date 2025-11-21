# Testing with Authentication & Authorization

## Overview

The test suite has been updated to work with the new NextAuth session-based authentication and role-based authorization system.

## Test Setup

### Mocking NextAuth Session

All API tests mock `getServerSession` from `next-auth/next` to simulate authenticated users:

```typescript
// Mock NextAuth to return authenticated session with admin role
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      roles: ["admin"], // Admin has all permissions
    },
  })),
}));
```

### Default Test User

By default, tests run with an **admin** user who has full permissions. This allows existing tests to continue working without modification.

## Authorization Tests

### Testing Different Roles

The `claims.api.test.ts` includes specific authorization tests that verify role-based access control:

```typescript
describe("Claims API - Authorization", () => {
  const { getServerSession } = require("next-auth/next");

  it("returns 401 when not authenticated", async () => {
    // Mock no session
    getServerSession.mockResolvedValueOnce(null);
    
    const response = await request(app).get("/api/claims");
    expect(response.status).toBe(401);
  });

  it("returns 403 when user lacks permission", async () => {
    // Mock viewer role (no create permission)
    getServerSession.mockResolvedValueOnce({
      user: {
        id: "test-user-456",
        email: "viewer@example.com",
        roles: ["viewer"],
      },
    });
    
    const response = await request(app).post("/api/claims").send(payload);
    expect(response.status).toBe(403);
  });

  it("allows employee to create claims", async () => {
    // Mock employee role (has create permission)
    getServerSession.mockResolvedValueOnce({
      user: {
        roles: ["employee"],
      },
    });
    
    const response = await request(app).post("/api/claims").send(payload);
    expect(response.status).toBe(201);
  });
});
```

## Test Structure

### 1. Basic CRUD Tests (with Admin)
Tests basic functionality with an admin user who has all permissions:
- ✅ List claims
- ✅ Create claim
- ✅ Get claim by ID
- ✅ Update claim
- ✅ Delete claim

### 2. Authorization Tests
Tests access control with different roles:
- ✅ 401 when not authenticated
- ✅ 403 when viewer tries to create
- ✅ 201 when employee creates
- ✅ 201 when manager creates
- ✅ 201 when admin creates

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test claims.api.test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Test Results

Current test suite status:

```
Test Suites: 5 passed, 5 total
Tests:       26 passed, 26 total
Time:        ~22s
```

### Test Files:
- ✅ `claims.api.test.ts` - Claims API with authorization (10 tests)
- ✅ `projects.api.test.ts` - Projects API (5 tests)
- ✅ `featureFlags.api.test.ts` - Feature flags (3 tests)
- ✅ `claims.service.test.ts` - Claims service layer (4 tests)
- ✅ `projects.services.test.ts` - Projects service layer (4 tests)

## Adding New Tests

### Testing with Specific Roles

To test with a specific role, mock the session in your test:

```typescript
it("tests specific role behavior", async () => {
  const { getServerSession } = require("next-auth/next");
  
  getServerSession.mockResolvedValueOnce({
    user: {
      id: "test-user",
      email: "test@example.com",
      name: "Test User",
      roles: ["manager"], // Use specific role
    },
  });
  
  // Your test code...
});
```

### Available Test Roles

Use these role names in your tests:
- `"admin"` - Full access
- `"manager"` - Manage projects/claims, approve claims
- `"employee"` - Create own claims, view projects
- `"viewer"` - Read-only access

### Testing Unauthenticated Requests

```typescript
it("requires authentication", async () => {
  const { getServerSession } = require("next-auth/next");
  
  // Mock no session
  getServerSession.mockResolvedValueOnce(null);
  
  const response = await request(app).get("/api/protected");
  expect(response.status).toBe(401);
});
```

## Mock Cleanup

Always clear mocks in `beforeEach`:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv, USE_MOCKS: "false" };
});
```

This ensures:
- Session mocks are reset between tests
- Each test starts with a clean state
- No test pollution

## Best Practices

### ✅ DO:
- Mock `getServerSession` for all API tests
- Clear mocks in `beforeEach`
- Test both success and failure cases
- Test with different roles when relevant
- Use descriptive test names

### ❌ DON'T:
- Forget to mock NextAuth (tests will fail)
- Use real authentication in tests
- Share state between tests
- Test with only admin role (test authorization too!)

## Debugging Tests

### Common Issues

**Issue**: `getServerSession is not a function`
```
Solution: Ensure NextAuth mock is before other imports
```

**Issue**: Tests pass locally but fail in CI
```
Solution: Check environment variables are mocked properly
```

**Issue**: Session mock not working
```
Solution: Clear mocks in beforeEach and check mock implementation
```

### Verbose Test Output

```bash
# See detailed test output
npm test -- --verbose

# See console.logs in tests
npm test -- --silent=false
```

## Future Enhancements

Potential test improvements:

1. **Integration Tests**: Test full authentication flow
2. **E2E Tests**: Test with real Cognito (staging)
3. **Permission Matrix Tests**: Verify complete permission matrix
4. **Token Expiry Tests**: Test session expiration handling
5. **Multi-Role Tests**: Test users with multiple roles

## Related Documentation

- **Authorization Guide**: `docs/MINIMAL_COGNITO_ROLES.md`
- **API Routes**: `src/pages/api/claims/index.ts`
- **Test Helper**: `src/__tests__/api/testServer.ts`
