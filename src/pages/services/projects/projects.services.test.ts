import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject
} from "@/pages/services/projects/projects.services";
import { mockProjects } from "@/pages/services/stubData";
import { Project } from "@/shared/interfaces";

describe("projects.services", () => {
  it("returns all projects", async () => {
    const projects = await getProjects();

    expect(projects).toBe(mockProjects);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("returns a project by id", async () => {
    const project = await getProject("1");

    expect(project).toMatchObject({ id: "1" });
  });

  it("creates a project", async () => {
    const payload: Project = { name: "Created Project" };
    const created = await createProject(payload);

    expect(created).toMatchObject(payload);
    expect(created).toHaveProperty("id");
    expect(mockProjects).toContainEqual(created);
  });

  it("updates an existing project", async () => {
    const testProject = { name: "Updated Name" } as Partial<Project>
    const updated = await updateProject("1", testProject as Project);

    expect(updated).toMatchObject({ id: "1", name: "Updated Name" });
    expect(mockProjects.find((p) => p.id === "1")).toEqual(updated);
  });

  it("deletes a project", async () => {
    await deleteProject("1");

    expect(mockProjects.find((p) => p.id === "1")).toBeUndefined();
  });
});

