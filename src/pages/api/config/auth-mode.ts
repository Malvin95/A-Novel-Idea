import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const useMockAuth = process.env.USE_MOCK_AUTH === "true";

  return res.status(200).json({
    useMockAuth,
    mode: useMockAuth ? "mock" : "cognito",
  });
}
