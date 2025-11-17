import { createClaim, getClaims } from "@/pages/services/claims.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === "GET") {
			const claims = await getClaims();
			return res.status(200).json(claims);
		}

		if (req.method === "POST") {
			const body = req.body; // JSON body
			const claim = await createClaim(body);
			return res.status(201).json(claim);
		}

		return res.status(405).end(`Method ${req.method} Not Allowed`);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
