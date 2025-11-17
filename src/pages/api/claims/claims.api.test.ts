import request from "supertest";
import claimHandler from "@/pages/api/claims/[id]";
import claimsHandler from "@/pages/api/claims/index";
import { createApiTestApp } from "../testServer";

const app = createApiTestApp([
  { path: "/api/claims", method: "get", handler: claimsHandler },
  { path: "/api/claims", method: "post", handler: claimsHandler },
  { path: "/api/claims/:id", method: "get", handler: claimHandler },
  { path: "/api/claims/:id", method: "patch", handler: claimHandler },
  { path: "/api/claims/:id", method: "delete", handler: claimHandler }
]);

describe("Claims API", () => {
  it("lists claims", async () => {
    const response = await request(app).get("/api/claims");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("creates a claim", async () => {
    const payload = {
      companyName: "Test Co",
      claimPeriod: "2024-12",
      amount: 1000,
      associatedProject: "Project Alpha",
      status: "DRAFT"
    };

    const response = await request(app).post("/api/claims").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);
    expect(response.body).toHaveProperty("id");
  });

  it("retrieves a claim by id", async () => {
    const response = await request(app).get("/api/claims/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "1", companyName: expect.any(String) });
  });

  it("updates a claim", async () => {
    const response = await request(app)
      .patch("/api/claims/1")
      .send({ status: "APPROVED" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "1", status: "APPROVED" });
  });

  it("deletes a claim", async () => {
    const deleteResponse = await request(app).delete("/api/claims/1");

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get("/api/claims/1");
    expect(getResponse.status).toBe(404);
  });
});

