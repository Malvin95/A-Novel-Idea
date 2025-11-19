import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "@/lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession(req, res);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({
    message: "This is protected data",
    user: session.user,
    accessToken: (session as any).accessToken || null,
  });
}
