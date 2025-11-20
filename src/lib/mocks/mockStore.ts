// In-memory mock data store for development
// This simulates a database by keeping state in memory during the dev session

interface DynamoItem {
  [key: string]: { S?: string; N?: string; BOOL?: boolean; };
}

interface MockStore {
  projects: DynamoItem[];
  claims: DynamoItem[];
}

const store: MockStore = {
  projects: [
    { id: { S: "1" }, name: { S: "Project Alpha" }, dateCreated: { S: "2025-01-01T00:00:00Z" } },
    { id: { S: "2" }, name: { S: "Project Beta" }, dateCreated: { S: "2025-02-01T00:00:00Z" } }
  ],
  claims: [
    { id: { S: "1" }, reference: { S: "CLAIM-001" }, dateCreated: { S: "2025-03-01T00:00:00Z" } },
    { id: { S: "2" }, reference: { S: "CLAIM-002" }, dateCreated: { S: "2025-04-01T00:00:00Z" } }
  ]
};

export function getMockProjects() {
  return { Items: store.projects };
}

export function addMockProject(projectName: string) {
  const newId = String(store.projects.length + 1);
  const newProject = {
    id: { S: newId },
    name: { S: projectName },
    projectName: { S: projectName },
    dateCreated: { S: new Date().toISOString() }
  };
  store.projects.push(newProject);
  return { Item: newProject };
}

export function getMockClaims() {
  return { Items: store.claims };
}

export function updateMockProject(id: string, dateCreated: string, updates: Record<string, unknown>) {
  const index = store.projects.findIndex(p => p.id.S === id && p.dateCreated.S === dateCreated);
  if (index === -1) return null;
  
  // Apply updates to the project
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'string') {
      store.projects[index][key] = { S: updates[key] as string };
    } else if (typeof updates[key] === 'number') {
      store.projects[index][key] = { N: String(updates[key]) };
    } else if (typeof updates[key] === 'boolean') {
      store.projects[index][key] = { BOOL: updates[key] as boolean };
    }
  });
  
  return { Attributes: store.projects[index] };
}

export function deleteMockProject(id: string, dateCreated: string) {
  const index = store.projects.findIndex(p => p.id.S === id && p.dateCreated.S === dateCreated);
  if (index === -1) return false;
  store.projects.splice(index, 1);
  return true;
}

export function addMockClaim(claimData: Record<string, unknown>) {
  const newId = String(store.claims.length + 1);
  const newClaim: DynamoItem = {
    id: { S: newId },
    reference: { S: (claimData.reference as string) || `CLAIM-${String(newId).padStart(3, '0')}` },
    dateCreated: { S: new Date().toISOString() },
    companyName: { S: (claimData.companyName as string) || "" },
    associatedProject: { S: (claimData.associatedProject as string) || "" },
    claimPeriod: { S: (claimData.claimPeriod as string) || "" },
    amount: { N: String(claimData.amount || 0) },
    status: { S: (claimData.status as string) || "Draft" }
  };
  store.claims.push(newClaim);
  return { Item: newClaim };
}

export function updateMockClaim(id: string, dateCreated: string, updates: Record<string, unknown>) {
  const index = store.claims.findIndex(c => c.id.S === id && c.dateCreated.S === dateCreated);
  if (index === -1) return null;
  
  // Apply updates to the claim
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'string') {
      store.claims[index][key] = { S: updates[key] as string };
    } else if (typeof updates[key] === 'number') {
      store.claims[index][key] = { N: String(updates[key]) };
    } else if (typeof updates[key] === 'boolean') {
      store.claims[index][key] = { BOOL: updates[key] as boolean };
    }
  });
  
  return { Attributes: store.claims[index] };
}

export function deleteMockClaim(id: string, dateCreated: string) {
  const index = store.claims.findIndex(c => c.id.S === id && c.dateCreated.S === dateCreated);
  if (index === -1) return false;
  store.claims.splice(index, 1);
  return true;
}

export function resetMockStore() {
  store.projects = [
    { id: { S: "1" }, name: { S: "Project Alpha" }, dateCreated: { S: "2025-01-01T00:00:00Z" } },
    { id: { S: "2" }, name: { S: "Project Beta" }, dateCreated: { S: "2025-02-01T00:00:00Z" } }
  ];
  store.claims = [
    { id: { S: "1" }, reference: { S: "CLAIM-001" }, dateCreated: { S: "2025-03-01T00:00:00Z" } },
    { id: { S: "2" }, reference: { S: "CLAIM-002" }, dateCreated: { S: "2025-04-01T00:00:00Z" } }
  ];
}
