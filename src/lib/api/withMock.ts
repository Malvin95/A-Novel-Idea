import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { shouldUseMock } from "../featureFlags";
import { 
  getMockProjects, 
  addMockProject, 
  updateMockProject, 
  deleteMockProject,
  getMockClaims, 
  addMockClaim,
  updateMockClaim,
  deleteMockClaim
} from "../mocks/mockStore";

export function withMock(handler: NextApiHandler, endpointName: string): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const useMock = shouldUseMock(endpointName);

    if (useMock) {
      try {
        // Handle different HTTP methods with in-memory mock store
        if (endpointName === "projects") {
          if (req.method === "GET") {
            const data = getMockProjects();
            return res.status(200).json(data);
          }
          if (req.method === "POST") {
            const { projectName } = req.body;
            const result = addMockProject(projectName);
            return res.status(201).json(result);
          }
          if (req.method === "PATCH") {
            const { id, dateCreated } = req.query;
            const result = updateMockProject(id as string, dateCreated as string, req.body);
            if (!result) return res.status(404).json({ error: "Not found" });
            return res.status(200).json(result);
          }
          if (req.method === "DELETE") {
            const { id, dateCreated } = req.query;
            const success = deleteMockProject(id as string, dateCreated as string);
            if (!success) return res.status(404).json({ error: "Not found" });
            return res.status(204).end();
          }
        }

        if (endpointName === "claims") {
          if (req.method === "GET") {
            const data = getMockClaims();
            return res.status(200).json(data);
          }
          if (req.method === "POST") {
            const result = addMockClaim(req.body);
            return res.status(201).json(result);
          }
          if (req.method === "PATCH") {
            const { id, dateCreated } = req.query;
            const result = updateMockClaim(id as string, dateCreated as string, req.body);
            if (!result) return res.status(404).json({ error: "Not found" });
            return res.status(200).json(result);
          }
          if (req.method === "DELETE") {
            const { id, dateCreated } = req.query;
            const success = deleteMockClaim(id as string, dateCreated as string);
            if (!success) return res.status(404).json({ error: "Not found" });
            return res.status(204).end();
          }
        }

        // Fallback to static JSON files for other endpoints
        const mockPath = path.join(process.cwd(), "src", "lib", "mocks", `${endpointName}.json`);
        if (fs.existsSync(mockPath)) {
          const json = fs.readFileSync(mockPath, "utf-8");
          const payload = JSON.parse(json);
          return res.status(200).json(payload);
        }

        // fallback to dynamic import of a module export
        try {
          const mod = await import(`../mocks/${endpointName}`);
          const data = mod.default ?? mod.data;
          if (data) return res.status(200).json(data);
        } catch (err) {
          // ignore
        }

        return res.status(404).json({ message: `No mock for ${endpointName}` });
      } catch (err) {
        console.error("withMock error", err);
        return res.status(500).json({ message: "Error reading mock" });
      }
    }

    return handler(req, res);
  };
}

export default withMock;
