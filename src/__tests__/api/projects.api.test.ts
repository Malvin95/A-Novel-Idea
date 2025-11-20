import request from "supertest";
import projectHandler from "@/pages/api/projects/[id]";
import projectsHandler from "@/pages/api/projects/index";
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
  { path: "/api/projects", method: "get", handler: projectsHandler },
  { path: "/api/projects", method: "post", handler: projectsHandler },
  { path: "/api/projects/:id", method: "get", handler: projectHandler },
  { path: "/api/projects/:id", method: "patch", handler: projectHandler },
  { path: "/api/projects/:id", method: "delete", handler: projectHandler }
]);

describe("Projects API", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Disable mocks to test actual handler logic
    process.env = { ...originalEnv, USE_MOCKS: "false" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns all projects", async () => {
    const mockItems = [
      {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "AI-Powered Customer Analytics Platform" },
      },
    ];

    mockSend.mockResolvedValueOnce({ Items: mockItems, Count: 1, ScannedCount: 1 } as unknown);

    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.Items)).toBe(true);
    expect(response.body.Items.length).toBeGreaterThan(0);
  });

  it("creates a new project", async () => {
    const payload = { projectName: "New Project" };

    // Simulate DynamoDB PutItem response (service currently returns raw response)
    const createdItem = {
      Item: {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        projectName: { S: payload.projectName },
      },
    } as unknown;

    mockSend.mockResolvedValueOnce(createdItem);

    const response = await request(app).post("/api/projects").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Item");
    expect(response.body.Item.id.S).toBe("1");
    expect(response.body.Item.projectName.S).toBe(payload.projectName);
  });

  it("retrieves a project by id", async () => {
    const mockItem = {
      Item: {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "AI-Powered Customer Analytics Platform" },
      },
    } as unknown;

    mockSend.mockResolvedValueOnce(mockItem);

    const response = await request(app).get("/api/projects/01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6?dateCreated=2024-01-15T09:30:00.000Z");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Item");
    expect(response.body.Item.id.S).toBe("01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6");
  });

  it("updates a project", async () => {
    const updatedAttributes = {
      Attributes: {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "Updated AI Platform" },
      },
    } as unknown;

    mockSend.mockResolvedValueOnce(updatedAttributes);

    const response = await request(app)
      .patch("/api/projects/01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6?dateCreated=2024-01-15T09:30:00.000Z")
      .send({ projectName: "Updated AI Platform" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Attributes");
    expect(response.body.Attributes.projectName.S).toBe("Updated AI Platform");
  });

  it("deletes a project", async () => {
    // First call: delete returns empty response
    // Second call: subsequent get returns nothing (null) to simulate not found
    mockSend.mockResolvedValueOnce({} as unknown).mockResolvedValueOnce(null as unknown);

    const deleteResponse = await request(app).delete(
      "/api/projects/01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6?dateCreated=2024-01-15T09:30:00.000Z"
    );

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(
      "/api/projects/01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6?dateCreated=2024-01-15T09:30:00.000Z"
    );
    expect(getResponse.status).toBe(404);
  });
});

