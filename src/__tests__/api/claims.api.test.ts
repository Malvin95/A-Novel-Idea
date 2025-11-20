import request from "supertest";
import claimHandler from "@/pages/api/claims/[id]";
import claimsHandler from "@/pages/api/claims/index";
import { createApiTestApp } from "./testServer";
import { ddbDocClient } from "@/lib/dynamo";

jest.mock("@/lib/dynamo", () => ({
  ddbDocClient: { send: jest.fn() },
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
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: "Test Company" },
        claimPeriod: { S: "2024-01" },
        amount: { N: "1000" },
        associatedProject: { S: "Project Alpha" },
        status: { S: "DRAFT" },
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
      companyName: "Test Co",
      claimPeriod: "2024-12",
      amount: 1000,
      associatedProject: "Project Alpha",
      status: "DRAFT",
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
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: "Test Company" },
        claimPeriod: { S: "2024-01" },
        amount: { N: "1000" },
        associatedProject: { S: "Project Alpha" },
        status: { S: "DRAFT" },
      },
    } as any;

    mockSend.mockResolvedValueOnce(mockItem);

    const response = await request(app).get(
      "/api/claims/1?dateCreated=2024-01-01T00:00:00.000Z"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Item");
    expect(response.body.Item.id.S).toBe("1");
  });

  it("updates a claim", async () => {
    const updatedAttributes = {
      Attributes: {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        status: { S: "APPROVED" },
      },
    } as any;

    mockSend.mockResolvedValueOnce(updatedAttributes);

    const response = await request(app)
      .patch("/api/claims/1?dateCreated=2024-01-01T00:00:00.000Z")
      .send({ status: "APPROVED" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Attributes");
    expect(response.body.Attributes.status.S).toBe("APPROVED");
  });

  it("deletes a claim", async () => {
    // delete then subsequent get => not found
    mockSend.mockResolvedValueOnce({} as any).mockResolvedValueOnce(null as any);

    const deleteResponse = await request(app).delete(
      "/api/claims/1?dateCreated=2024-01-01T00:00:00.000Z"
    );

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(
      "/api/claims/1?dateCreated=2024-01-01T00:00:00.000Z"
    );
    expect(getResponse.status).toBe(404);
  });
});

