import { status } from "@/shared/enums";
import { createClaim, deleteClaim, getClaim, getClaims, updateClaim } from "./claims.service";
import { Claim } from "@/shared/interfaces";
import { ddbDocClient } from "@/pages/api/lib/dynamo";

jest.mock("@/pages/api/lib/dynamo", () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v7: jest.fn(() => "mock-uuid-v7"),
}));

const mockSend = ddbDocClient.send as jest.MockedFunction<typeof ddbDocClient.send>;

describe("claims.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all claims", async () => {
    const mockItems = [
      {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: "Test Company" },
        claimPeriod: { S: "2024-01" },
        amount: { N: "1000" },
        associatedProject: { S: "Project Alpha" },
        status: { S: status.DRAFT },
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      Count: 1,
      ScannedCount: 1,
    } as any);

    const result = await getClaims();

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
        }),
      })
    );
    expect(result).toHaveProperty("Items");
    expect(result).toHaveProperty("Count");
  });

  it("returns a claim by id and dateCreated", async () => {
    const mockItem = {
      Item: {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        companyName: { S: "Test Company" },
        claimPeriod: { S: "2024-01" },
        amount: { N: "1000" },
        associatedProject: { S: "Project Alpha" },
        status: { S: status.DRAFT },
      },
    };

    mockSend.mockResolvedValueOnce(mockItem as any);

    const result = await getClaim("1", "2024-01-01T00:00:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "1" },
            dateCreated: { S: "2024-01-01T00:00:00.000Z" },
          },
        }),
      })
    );
    expect(result).toHaveProperty("Item");
  });

  it("creates a claim", async () => {
    const payload: Claim = {
      companyName: "Claim Co",
      claimPeriod: "2024-11",
      amount: 5000,
      associatedProject: "Project Beta",
      status: status.DRAFT,
    };

    mockSend.mockResolvedValueOnce({} as any);

    const result = await createClaim(payload);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Item: expect.objectContaining({
            companyName: { S: "Claim Co" },
            claimPeriod: { S: "2024-11" },
            amount: { N: "5000" },
            associatedProject: { S: "Project Beta" },
            status: { S: status.DRAFT },
          }),
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("updates a claim", async () => {
    const testClaim = { status: status.APPROVED } as Partial<Claim>;

    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: { S: "1" },
        dateCreated: { S: "2024-01-01T00:00:00.000Z" },
        status: { S: status.APPROVED },
      },
    } as unknown);

    const result = await updateClaim("1", "2024-01-01T00:00:00.000Z", testClaim);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "1" },
            dateCreated: { S: "2024-01-01T00:00:00.000Z" },
          },
          UpdateExpression: expect.stringContaining("#status = :status"),
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("deletes a claim", async () => {
    mockSend.mockResolvedValueOnce({} as any);

    await deleteClaim("1", "2024-01-01T00:00:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "1" },
            dateCreated: { S: "2024-01-01T00:00:00.000Z" },
          },
        }),
      })
    );
  });
});

