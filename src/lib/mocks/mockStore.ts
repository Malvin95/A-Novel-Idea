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
    { id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" }, projectName: { S: "AI-Powered Customer Analytics Platform" }, dateCreated: { S: "2024-01-15T09:30:00.000Z" } },
    { id: { S: "01939c60-1f3b-7c4d-8e5f-d2e3f4a5b6c7" }, projectName: { S: "Quantum Computing Research Initiative" }, dateCreated: { S: "2024-03-22T14:15:00.000Z" } },
    { id: { S: "01939c61-2g4c-7d5e-9f6g-e3f4a5b6c7d8" }, projectName: { S: "Blockchain Supply Chain Tracker" }, dateCreated: { S: "2024-05-10T11:45:00.000Z" } },
    { id: { S: "01939c62-3h5d-7e6f-0g7h-f4a5b6c7d8e9" }, projectName: { S: "Machine Learning Medical Diagnostics" }, dateCreated: { S: "2024-06-18T08:20:00.000Z" } },
    { id: { S: "01939c63-4i6e-7f7g-1h8i-a5b6c7d8e9f0" }, projectName: { S: "IoT Smart City Infrastructure" }, dateCreated: { S: "2024-07-25T16:00:00.000Z" } },
    { id: { S: "01939c64-5j7f-7g8h-2i9j-b6c7d8e9f0a1" }, projectName: { S: "Advanced Robotics Automation System" }, dateCreated: { S: "2024-09-03T10:30:00.000Z" } },
    { id: { S: "01939c65-6k8g-7h9i-3j0k-c7d8e9f0a1b2" }, projectName: { S: "Green Energy Optimization Software" }, dateCreated: { S: "2024-10-12T13:45:00.000Z" } },
    { id: { S: "01939c66-7l9h-7i0j-4k1l-d8e9f0a1b2c3" }, projectName: { S: "Cybersecurity Threat Detection Platform" }, dateCreated: { S: "2024-11-20T15:20:00.000Z" } }
  ],
  claims: [
    { id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" }, companyName: { S: "TechVision Solutions Ltd" }, claimPeriod: { S: "2024-Q1" }, amount: { N: "125000" }, associatedProject: { S: "AI-Powered Customer Analytics Platform" }, status: { S: "Approved" }, dateCreated: { S: "2024-04-15T10:30:00.000Z" } },
    { id: { S: "01939c71-2b3c-7d4e-5f6g-2b3c4d5e6f7g" }, companyName: { S: "Quantum Innovations Inc" }, claimPeriod: { S: "2024-Q2" }, amount: { N: "250000" }, associatedProject: { S: "Quantum Computing Research Initiative" }, status: { S: "Submitted" }, dateCreated: { S: "2024-07-20T14:15:00.000Z" } },
    { id: { S: "01939c72-3c4d-7e5f-6g7h-3c4d5e6f7g8h" }, companyName: { S: "BlockChain Systems Corp" }, claimPeriod: { S: "2024-Q2" }, amount: { N: "180000" }, associatedProject: { S: "Blockchain Supply Chain Tracker" }, status: { S: "Approved" }, dateCreated: { S: "2024-08-05T11:45:00.000Z" } },
    { id: { S: "01939c73-4d5e-7f6g-7h8i-4d5e6f7g8h9i" }, companyName: { S: "MedTech Diagnostics Ltd" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "320000" }, associatedProject: { S: "Machine Learning Medical Diagnostics" }, status: { S: "Submitted" }, dateCreated: { S: "2024-09-18T08:20:00.000Z" } },
    { id: { S: "01939c74-5e6f-7g7h-8i9j-5e6f7g8h9i0j" }, companyName: { S: "Smart City Technologies" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "275000" }, associatedProject: { S: "IoT Smart City Infrastructure" }, status: { S: "Draft" }, dateCreated: { S: "2024-10-25T16:00:00.000Z" } },
    { id: { S: "01939c75-6f7g-7h8i-9j0k-6f7g8h9i0j1k" }, companyName: { S: "Robotics Automation Group" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "195000" }, associatedProject: { S: "Advanced Robotics Automation System" }, status: { S: "Draft" }, dateCreated: { S: "2024-11-03T10:30:00.000Z" } },
    { id: { S: "01939c76-7g8h-7i9j-0k1l-7g8h9i0j1k2l" }, companyName: { S: "GreenTech Energy Solutions" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "210000" }, associatedProject: { S: "Green Energy Optimization Software" }, status: { S: "Approved" }, dateCreated: { S: "2024-11-12T13:45:00.000Z" } },
    { id: { S: "01939c77-8h9i-7j0k-1l2m-8h9i0j1k2l3m" }, companyName: { S: "CyberGuard Security Ltd" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "165000" }, associatedProject: { S: "Cybersecurity Threat Detection Platform" }, status: { S: "Submitted" }, dateCreated: { S: "2024-11-20T15:20:00.000Z" } },
    { id: { S: "01939c78-9i0j-7k1l-2m3n-9i0j1k2l3m4n" }, companyName: { S: "TechVision Solutions Ltd" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "142000" }, associatedProject: { S: "AI-Powered Customer Analytics Platform" }, status: { S: "Approved" }, dateCreated: { S: "2024-10-08T09:15:00.000Z" } },
    { id: { S: "01939c79-0j1k-7l2m-3n4o-0j1k2l3m4n5o" }, companyName: { S: "BlockChain Systems Corp" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "198000" }, associatedProject: { S: "Blockchain Supply Chain Tracker" }, status: { S: "Draft" }, dateCreated: { S: "2024-11-28T11:30:00.000Z" } }
  ]
};

export function getMockProjects() {
  return { Items: store.projects };
}

export function addMockProject(projectName: string) {
  // Generate a simple UUID-like ID
  const newId = `0193${Math.random().toString(36).substring(2, 15)}`;
  const newProject = {
    id: { S: newId },
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
    { id: { S: "01939c5f-8e2a-7a3b-9f4e-c1d2e3f4a5b6" }, projectName: { S: "AI-Powered Customer Analytics Platform" }, dateCreated: { S: "2024-01-15T09:30:00.000Z" } },
    { id: { S: "01939c60-1f3b-7c4d-8e5f-d2e3f4a5b6c7" }, projectName: { S: "Quantum Computing Research Initiative" }, dateCreated: { S: "2024-03-22T14:15:00.000Z" } },
    { id: { S: "01939c61-2g4c-7d5e-9f6g-e3f4a5b6c7d8" }, projectName: { S: "Blockchain Supply Chain Tracker" }, dateCreated: { S: "2024-05-10T11:45:00.000Z" } },
    { id: { S: "01939c62-3h5d-7e6f-0g7h-f4a5b6c7d8e9" }, projectName: { S: "Machine Learning Medical Diagnostics" }, dateCreated: { S: "2024-06-18T08:20:00.000Z" } },
    { id: { S: "01939c63-4i6e-7f7g-1h8i-a5b6c7d8e9f0" }, projectName: { S: "IoT Smart City Infrastructure" }, dateCreated: { S: "2024-07-25T16:00:00.000Z" } },
    { id: { S: "01939c64-5j7f-7g8h-2i9j-b6c7d8e9f0a1" }, projectName: { S: "Advanced Robotics Automation System" }, dateCreated: { S: "2024-09-03T10:30:00.000Z" } },
    { id: { S: "01939c65-6k8g-7h9i-3j0k-c7d8e9f0a1b2" }, projectName: { S: "Green Energy Optimization Software" }, dateCreated: { S: "2024-10-12T13:45:00.000Z" } },
    { id: { S: "01939c66-7l9h-7i0j-4k1l-d8e9f0a1b2c3" }, projectName: { S: "Cybersecurity Threat Detection Platform" }, dateCreated: { S: "2024-11-20T15:20:00.000Z" } }
  ];
  store.claims = [
    { id: { S: "01939c70-1a2b-7c3d-4e5f-1a2b3c4d5e6f" }, companyName: { S: "TechVision Solutions Ltd" }, claimPeriod: { S: "2024-Q1" }, amount: { N: "125000" }, associatedProject: { S: "AI-Powered Customer Analytics Platform" }, status: { S: "Approved" }, dateCreated: { S: "2024-04-15T10:30:00.000Z" } },
    { id: { S: "01939c71-2b3c-7d4e-5f6g-2b3c4d5e6f7g" }, companyName: { S: "Quantum Innovations Inc" }, claimPeriod: { S: "2024-Q2" }, amount: { N: "250000" }, associatedProject: { S: "Quantum Computing Research Initiative" }, status: { S: "Submitted" }, dateCreated: { S: "2024-07-20T14:15:00.000Z" } },
    { id: { S: "01939c72-3c4d-7e5f-6g7h-3c4d5e6f7g8h" }, companyName: { S: "BlockChain Systems Corp" }, claimPeriod: { S: "2024-Q2" }, amount: { N: "180000" }, associatedProject: { S: "Blockchain Supply Chain Tracker" }, status: { S: "Approved" }, dateCreated: { S: "2024-08-05T11:45:00.000Z" } },
    { id: { S: "01939c73-4d5e-7f6g-7h8i-4d5e6f7g8h9i" }, companyName: { S: "MedTech Diagnostics Ltd" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "320000" }, associatedProject: { S: "Machine Learning Medical Diagnostics" }, status: { S: "Submitted" }, dateCreated: { S: "2024-09-18T08:20:00.000Z" } },
    { id: { S: "01939c74-5e6f-7g7h-8i9j-5e6f7g8h9i0j" }, companyName: { S: "Smart City Technologies" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "275000" }, associatedProject: { S: "IoT Smart City Infrastructure" }, status: { S: "Draft" }, dateCreated: { S: "2024-10-25T16:00:00.000Z" } },
    { id: { S: "01939c75-6f7g-7h8i-9j0k-6f7g8h9i0j1k" }, companyName: { S: "Robotics Automation Group" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "195000" }, associatedProject: { S: "Advanced Robotics Automation System" }, status: { S: "Draft" }, dateCreated: { S: "2024-11-03T10:30:00.000Z" } },
    { id: { S: "01939c76-7g8h-7i9j-0k1l-7g8h9i0j1k2l" }, companyName: { S: "GreenTech Energy Solutions" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "210000" }, associatedProject: { S: "Green Energy Optimization Software" }, status: { S: "Approved" }, dateCreated: { S: "2024-11-12T13:45:00.000Z" } },
    { id: { S: "01939c77-8h9i-7j0k-1l2m-8h9i0j1k2l3m" }, companyName: { S: "CyberGuard Security Ltd" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "165000" }, associatedProject: { S: "Cybersecurity Threat Detection Platform" }, status: { S: "Submitted" }, dateCreated: { S: "2024-11-20T15:20:00.000Z" } },
    { id: { S: "01939c78-9i0j-7k1l-2m3n-9i0j1k2l3m4n" }, companyName: { S: "TechVision Solutions Ltd" }, claimPeriod: { S: "2024-Q3" }, amount: { N: "142000" }, associatedProject: { S: "AI-Powered Customer Analytics Platform" }, status: { S: "Approved" }, dateCreated: { S: "2024-10-08T09:15:00.000Z" } },
    { id: { S: "01939c79-0j1k-7l2m-3n4o-0j1k2l3m4n5o" }, companyName: { S: "BlockChain Systems Corp" }, claimPeriod: { S: "2024-Q4" }, amount: { N: "198000" }, associatedProject: { S: "Blockchain Supply Chain Tracker" }, status: { S: "Draft" }, dateCreated: { S: "2024-11-28T11:30:00.000Z" } }
  ];
}
