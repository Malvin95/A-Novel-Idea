import { status } from "@/shared/enums";
import { createClaim, deleteClaim, getClaim, getClaims, updateClaim } from "./claims.service";
import { Claim } from "@/shared/interfaces";
import { ddbDocClient } from "@/lib/dynamo";

jest.mock("@/lib/dynamo", () => ({
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
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        companyName: { S: "TechVision Solutions Ltd" },
        claimPeriod: { S: "2024-Q1" },
        amount: { N: "125000" },
        associatedProject: { S: "AI-Powered Customer Analytics Platform" },
        status: { S: status.APPROVED },
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
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        companyName: { S: "TechVision Solutions Ltd" },
        claimPeriod: { S: "2024-Q1" },
        amount: { N: "125000" },
        associatedProject: { S: "AI-Powered Customer Analytics Platform" },
        status: { S: status.APPROVED },
      },
    };

    mockSend.mockResolvedValueOnce(mockItem as any);

    const result = await getClaim("01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f", "2024-04-15T10:30:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
            dateCreated: { S: "2024-04-15T10:30:00.000Z" },
          },
        }),
      })
    );
    expect(result).toHaveProperty("Item");
  });

  it("creates a claim", async () => {
    const payload: Claim = {
      companyName: "Smart City Technologies",
      claimPeriod: "2024-Q4",
      amount: 275000,
      associatedProject: "IoT Smart City Infrastructure",
      status: status.DRAFT,
    };

    mockSend.mockResolvedValueOnce({} as any);

    const result = await createClaim(payload);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Item: expect.objectContaining({
            companyName: { S: "Smart City Technologies" },
            claimPeriod: { S: "2024-Q4" },
            amount: { N: "275000" },
            associatedProject: { S: "IoT Smart City Infrastructure" },
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
        id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
        dateCreated: { S: "2024-04-15T10:30:00.000Z" },
        status: { S: status.APPROVED },
      },
    } as unknown);

    const result = await updateClaim("01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f", "2024-04-15T10:30:00.000Z", testClaim);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
            dateCreated: { S: "2024-04-15T10:30:00.000Z" },
          },
          UpdateExpression: expect.stringContaining("#status = :status"),
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("deletes a claim", async () => {
    mockSend.mockResolvedValueOnce({} as any);

    await deleteClaim("01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f", "2024-04-15T10:30:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-claims-table-v2",
          Key: {
            id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" },
            dateCreated: { S: "2024-04-15T10:30:00.000Z" },
          },
        }),
      })
    );
  });
});

