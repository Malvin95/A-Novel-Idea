import { Claim } from "@/shared/interfaces";
import { mockClaims } from "./stubData";

export async function getClaims() {
    return mockClaims;
}

export async function getClaim(id: string) {
    return mockClaims.find(p => p.id === id);
}

export async function createClaim(data: Claim) {
    const newProject = { id: Date.now().toString(), ...data };
    mockClaims.push(newProject);
    return newProject;
}

export async function updateClaim(id: string, data: Claim) {
    const idx = mockClaims.findIndex(p => p.id === id);
    mockClaims[idx] = { ...mockClaims[idx], ...data };
    return mockClaims[idx];
}

export async function deleteClaim(id: string) {
    const idx = mockClaims.findIndex(p => p.id === id);
    mockClaims.splice(idx, 1);
}