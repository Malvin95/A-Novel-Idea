import request from "supertest";
import claimHandler from "@/pages/api/claims/[id]";
import claimsHandler from "@/pages/api/claims/index";
import { createApiTestApp } from "./testServer";
import { ddbDocClient } from "@/lib/dynamo";

jest.mock("@/lib/dynamo", () => ({
  ddbDocClient: { send: jest.fn() },
}));

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

const mockSend = ddbDocClient.send as unknown as jest.Mock;

const app = createApiTestApp([
  { path: "/api/claims", method: "get", handler: claimsHandler },
  { path: "/api/claims", method: "post", handler: claimsHandler },
  { path: "/api/claims/:id", method: "get", handler: claimHandler },
  { path: "/api/claims/:id", method: "patch", handler: claimHandler },
  { path: "/api/claims/:id", method: "delete", handler: claimHandler }
]);

describe("Claims API", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Disable mocks to test actual handler logic
    process.env = { ...originalEnv, USE_MOCKS: "false" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("lists claims", async () => {
    const mockItems = [
      {
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        companyName: { S: "TechVision Solutions Ltd" },
        claimPeriod: { S: "2024-Q1" },
        amount: { N: "125000" },
        associatedProject: { S: "AI-Powered Customer Analytics Platform" },
        status: { S: "Approved" },
      },
    ];

    mockSend.mockResolvedValueOnce({ Items: mockItems, Count: 1, ScannedCount: 1 } as any);

    const response = await request(app).get("/api/claims");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.Items)).toBe(true);
    expect(response.body.Items.length).toBeGreaterThan(0);
  });

  it("creates a claim", async () => {
    const payload = {
      companyName: "Smart City Technologies",
      claimPeriod: "2024-Q4",
      amount: 275000,
      associatedProject: "IoT Smart City Infrastructure",
      status: "Draft",
    };

    const createdItem = {
      Item: {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: payload.companyName },
        claimPeriod: { S: payload.claimPeriod },
        amount: { N: payload.amount.toString() },
        associatedProject: { S: payload.associatedProject },
        status: { S: payload.status },
      },
    } as any;

    mockSend.mockResolvedValueOnce(createdItem);

    const response = await request(app).post("/api/claims").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Item");
    expect(response.body.Item.companyName.S).toBe(payload.companyName);
  });

  it("retrieves a claim by id", async () => {
    const mockItem = {
      Item: {
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        companyName: { S: "TechVision Solutions Ltd" },
        claimPeriod: { S: "2024-Q1" },
        amount: { N: "125000" },
        associatedProject: { S: "AI-Powered Customer Analytics Platform" },
        status: { S: "Approved" },
      },
    } as any;

    mockSend.mockResolvedValueOnce(mockItem);

    const response = await request(app).get(
      "/api/claims/01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f?dateCreated=2024-04-15T10:30:00.000Z"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Item");
    expect(response.body.Item.id.S).toBe("01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f");
  });

  it("updates a claim", async () => {
    const updatedAttributes = {
      Attributes: {
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        status: { S: "Approved" },
      },
    } as any;

    mockSend.mockResolvedValueOnce(updatedAttributes);

    const response = await request(app)
      .patch("/api/claims/01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f?dateCreated=2024-04-15T10:30:00.000Z")
      .send({ status: "Approved" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Attributes");
    expect(response.body.Attributes.status.S).toBe("Approved");
  });

  it("deletes a claim", async () => {
    // delete then subsequent get => not found
    mockSend.mockResolvedValueOnce({} as any).mockResolvedValueOnce(null as any);

    const deleteResponse = await request(app).delete(
      "/api/claims/01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f?dateCreated=2024-04-15T10:30:00.000Z"
    );

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(
      "/api/claims/01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f?dateCreated=2024-04-15T10:30:00.000Z"
    );
    expect(getResponse.status).toBe(404);
  });
});

describe("Claims API - Authorization", () => {
  const originalEnv = process.env;
  const { getServerSession } = require("next-auth/next");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, USE_MOCKS: "false" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns 401 when not authenticated", async () => {
    // Mock no session (not authenticated)
    getServerSession.mockResolvedValueOnce(null);

    const response = await request(app).get("/api/claims");

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Unauthorized");
  });

  it("returns 403 when user lacks permission to create claims", async () => {
    // Mock session with viewer role (no create permission)
    getServerSession.mockResolvedValueOnce({
      user: {
        id: "test-user-456",
        email: "viewer@example.com",
        name: "Viewer User",
        roles: ["viewer"],
      },
    });

    const payload = {
      companyName: "Test Company",
      claimPeriod: "2024-Q4",
      amount: 100000,
      associatedProject: "Test Project",
      status: "Draft",
    };

    const response = await request(app).post("/api/claims").send(payload);

    expect(response.status).toBe(403);
    expect(response.body.error).toContain("permission");
    expect(response.body.yourRoles).toEqual(["viewer"]);
  });

  it("allows employee to create claims", async () => {
    // Mock session with employee role (has create permission)
    getServerSession.mockResolvedValueOnce({
      user: {
        id: "test-user-789",
        email: "employee@example.com",
        name: "Employee User",
        roles: ["employee"],
      },
    });

    const payload = {
      companyName: "Test Company",
      claimPeriod: "2024-Q4",
      amount: 100000,
      associatedProject: "Test Project",
      status: "Draft",
    };

    const createdItem = {
      Item: {
        id: { S: "new-claim-id" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: payload.companyName },
        claimPeriod: { S: payload.claimPeriod },
        amount: { N: payload.amount.toString() },
        associatedProject: { S: payload.associatedProject },
        status: { S: payload.status },
      },
    } as any;

    mockSend.mockResolvedValueOnce(createdItem);

    const response = await request(app).post("/api/claims").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.Item.companyName.S).toBe(payload.companyName);
  });

  it("allows manager to create claims", async () => {
    // Mock session with manager role (has create permission)
    getServerSession.mockResolvedValueOnce({
      user: {
        id: "test-user-999",
        email: "manager@example.com",
        name: "Manager User",
        roles: ["manager"],
      },
    });

    const payload = {
      companyName: "Test Company",
      claimPeriod: "2024-Q4",
      amount: 100000,
      associatedProject: "Test Project",
      status: "Draft",
    };

    const createdItem = {
      Item: {
        id: { S: "new-claim-id-2" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: payload.companyName },
        claimPeriod: { S: payload.claimPeriod },
        amount: { N: payload.amount.toString() },
        associatedProject: { S: payload.associatedProject },
        status: { S: payload.status },
      },
    } as any;

    mockSend.mockResolvedValueOnce(createdItem);

    const response = await request(app).post("/api/claims").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.Item.companyName.S).toBe(payload.companyName);
  });
});

