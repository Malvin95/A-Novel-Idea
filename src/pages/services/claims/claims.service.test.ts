
import { mockClaims } from "@/pages/services/stubData";
import { status } from "@/shared/enums";
import { createClaim, deleteClaim, getClaim, getClaims, updateClaim } from "./claims.service";
import { Claim } from "@/shared/interfaces";

describe("claims.service", () => {
  it("returns all claims", async () => {
    const claims = await getClaims();

    expect(claims).toBe(mockClaims);
    expect(claims.length).toBeGreaterThan(0);
  });

  it("returns a claim by id", async () => {
    const claim = await getClaim("1");

    expect(claim).toMatchObject({ id: "1" });
  });

  it("creates a claim", async () => {
    const payload: Claim = {
      companyName: "Claim Co",
      claimPeriod: "2024-11",
      amount: 5000,
      associatedProject: "Project Beta",
      status: status.DRAFT
    };

    const created = await createClaim(payload);

    expect(created).toMatchObject(payload);
    expect(created).toHaveProperty("id");
    expect(mockClaims).toContainEqual(created);
  });

  it("updates a claim", async () => {
    const testClaim = { status: status.APPROVED } as Partial<Claim>;

    const updated = await updateClaim("1", testClaim as Claim);

    expect(updated).toMatchObject({ id: "1", status: status.APPROVED });
    expect(mockClaims.find((c) => c.id === "1")).toEqual(updated);
  });

  it("deletes a claim", async () => {
    await deleteClaim("1");

    expect(mockClaims.find((c) => c.id === "1")).toBeUndefined();
  });
});

