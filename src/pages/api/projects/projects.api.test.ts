import request from "supertest";
import projectHandler from "@/pages/api/projects/[id]";
import projectsHandler from "@/pages/api/projects/index";
import { createApiTestApp } from "../testServer";

const app = createApiTestApp([
  { path: "/api/projects", method: "get", handler: projectsHandler },
  { path: "/api/projects", method: "post", handler: projectsHandler },
  { path: "/api/projects/:id", method: "get", handler: projectHandler },
  { path: "/api/projects/:id", method: "patch", handler: projectHandler },
  { path: "/api/projects/:id", method: "delete", handler: projectHandler }
]);

describe("Projects API", () => {
  it("returns all projects", async () => {
    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("creates a new project", async () => {
    const payload = { name: "New Project" };
    const response = await request(app).post("/api/projects").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);
    expect(response.body).toHaveProperty("id");
  });

  it("retrieves a project by id", async () => {
    const response = await request(app).get("/api/projects/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "1", name: expect.any(String) });
  });

  it("updates a project", async () => {
    const response = await request(app)
      .patch("/api/projects/1")
      .send({ name: "Renamed Project" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "1", name: "Renamed Project" });
  });

  it("deletes a project", async () => {
    const deleteResponse = await request(app).delete("/api/projects/1");

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get("/api/projects/1");
    expect(getResponse.status).toBe(404);
  });
});

