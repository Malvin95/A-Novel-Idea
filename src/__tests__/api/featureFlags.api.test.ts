import request from "supertest";
import projectsHandler from "@/pages/api/projects/index";
import claimsHandler from "@/pages/api/claims/index";
import { createApiTestApp } from "./testServer";
import { ddbDocClient } from "@/lib/dynamo";

jest.mock("@/lib/dynamo", () => ({
  ddbDocClient: { send: jest.fn() },
}));

const mockSend = ddbDocClient.send as unknown as jest.Mock;

const app = createApiTestApp([
  { path: "/api/projects", method: "get", handler: projectsHandler },
  { path: "/api/claims", method: "get", handler: claimsHandler },
]);

describe("Feature flag mock behavior", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    // reset to ensure default test environment
    process.env.USE_MOCKS = originalEnv.USE_MOCKS;
    process.env.FEATURE_FLAGS_JSON = originalEnv.FEATURE_FLAGS_JSON;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns mock json when USE_MOCKS=true", async () => {
    process.env.USE_MOCKS = "true";

    const projRes = await request(app).get("/api/projects");
    expect(projRes.status).toBe(200);
    expect(Array.isArray(projRes.body.Items)).toBe(true);
    expect(projRes.body.Items.length).toBeGreaterThan(0);
    // mock file has Project Alpha
    expect(projRes.body.Items[0].name.S).toBe("Project Alpha");

    const claimsRes = await request(app).get("/api/claims");
    expect(claimsRes.status).toBe(200);
    expect(Array.isArray(claimsRes.body.Items)).toBe(true);
    expect(claimsRes.body.Items[0].reference.S).toBe("CLAIM-001");
  });

  it("calls DB path when USE_MOCKS=false", async () => {
    process.env.USE_MOCKS = "false";

    const dbProjects = [
      { id: { S: "db-1" }, name: { S: "DB Project" } },
    ];

    mockSend.mockResolvedValueOnce({ Items: dbProjects, Count: 1 } as any);

    const projRes = await request(app).get("/api/projects");
    expect(projRes.status).toBe(200);
    expect(Array.isArray(projRes.body.Items)).toBe(true);
    expect(projRes.body.Items[0].id.S).toBe("db-1");
  });
});
