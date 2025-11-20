import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { shouldUseMock } from "../featureFlags";

export function withMock(handler: NextApiHandler, endpointName: string): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const useMock = shouldUseMock(endpointName);

    if (useMock) {
      try {
        const mockPath = path.join(process.cwd(), "src", "lib", "mocks", `${endpointName}.json`);
        if (fs.existsSync(mockPath)) {
          const json = fs.readFileSync(mockPath, "utf-8");
          const payload = JSON.parse(json);
          return res.status(200).json(payload);
        }

        // fallback to dynamic import of a module export
        try {
          // import relative to src/lib/mocks
          // note: dynamic import path must be relative to this file at build/runtime
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
