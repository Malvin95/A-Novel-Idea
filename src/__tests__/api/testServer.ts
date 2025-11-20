import express from "express";
import type { NextApiHandler } from "next";

export function createApiTestApp(routes: {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  handler: NextApiHandler;
}[]) {
  const app = express();
  app.use(express.json());

  routes.forEach(({ path, method, handler }) => {
    app[method](path, (req, res) => {
      (req as any).query = {
        ...(req.query || {}),
        ...(req.params || {})
      };
      return handler(req as any, res as any);
    });
  });

  return app;
}

