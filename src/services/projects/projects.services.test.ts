import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject
} from "@/services/projects/projects.services";
import { Project } from "@/shared/interfaces";
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

describe("projects.services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all projects", async () => {
    const mockItems = [
      {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "AI-Powered Customer Analytics Platform" },
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      Count: 1,
      ScannedCount: 1,
    } as any);

    const result = await getProjects();

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-project-table-v2",
        }),
      })
    );
    expect(result).toHaveProperty("Items");
    expect(result).toHaveProperty("Count");
  });

  it("returns a project by id and dateCreated", async () => {
    const mockItem = {
      Item: {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "AI-Powered Customer Analytics Platform" },
      },
    };

    mockSend.mockResolvedValueOnce(mockItem as any);

    const result = await getProject("01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6", "2024-01-15T09:30:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-project-table-v2",
          Key: {
            id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
            dateCreated: { S: "2024-01-15T09:30:00.000Z" },
          },
        }),
      })
    );
    expect(result).toHaveProperty("Item");
  });

  it("creates a project", async () => {
    const payload: Project = {
      projectName: "New Research Project",
      dateCreated: "2024-01-15T09:30:00.000Z",
    };

    mockSend.mockResolvedValueOnce({} as any);

    const result = await createProject(payload);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-project-table-v2",
          Item: expect.objectContaining({
            projectName: { S: "New Research Project" },
          }),
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("updates an existing project", async () => {
    const testProject: Project = {
      projectName: "Updated AI Platform",
      dateCreated: "2024-01-15T09:30:00.000Z",
    };

    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
        dateCreated: { S: "2024-01-15T09:30:00.000Z" },
        projectName: { S: "Updated AI Platform" },
      },
    } as any);

    const result = await updateProject("01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6", "2024-01-15T09:30:00.000Z", testProject);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-project-table-v2",
          Key: {
            id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
            dateCreated: { S: "2024-01-15T09:30:00.000Z" },
          },
          UpdateExpression: expect.stringContaining("#projectName = :projectName"),
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("deletes a project", async () => {
    mockSend.mockResolvedValueOnce({} as any);

    await deleteProject("01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6", "2024-01-15T09:30:00.000Z");

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: "a-novel-project-table-v2",
          Key: {
            id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" },
            dateCreated: { S: "2024-01-15T09:30:00.000Z" },
          },
        }),
      })
    );
  });
});

