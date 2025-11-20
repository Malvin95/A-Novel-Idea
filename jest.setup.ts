import { mockClaims, mockProjects } from "@/services/stubData";

const initialProjects = mockProjects.map((project) => ({ ...project }));
const initialClaims = mockClaims.map((claim) => ({ ...claim }));

export function resetMockData() {
  mockProjects.splice(0, mockProjects.length, ...initialProjects.map((project) => ({ ...project })));
  mockClaims.splice(0, mockClaims.length, ...initialClaims.map((claim) => ({ ...claim })));
}

beforeEach(() => {
  resetMockData();
});

