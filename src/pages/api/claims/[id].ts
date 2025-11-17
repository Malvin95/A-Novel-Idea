import { getClaim, updateClaim, deleteClaim } from "@/pages/services/claims/claims.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	try {
	if (req.method === "GET") {
		const claim = await getClaim(id as string);
		return claim
		? res.status(200).json(claim)
		: res.status(404).json({ error: "Not found" });
	}

	if (req.method === "PATCH") {
		const updated = await updateClaim(id as string, req.body);
		return res.status(200).json(updated);
	}

	if (req.method === "DELETE") {
		await deleteClaim(id as string);
		return res.status(204).end();
	}
		return res.status(405).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
}
