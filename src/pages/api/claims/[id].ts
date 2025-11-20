import { getClaim, updateClaim, deleteClaim } from "@/services/claims/claims.service";
import type { NextApiRequest, NextApiResponse } from "next";
import { withMock } from "@/lib/api/withMock";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id, dateCreated } = req.query;

	try {
		if (req.method === "GET") {
			if (!dateCreated) {
				return res.status(400).json({ error: "dateCreated query parameter is required" });
			}
			const claim = await getClaim(id as string, dateCreated as string);
			return claim
			? res.status(200).json(claim)
			: res.status(404).json({ error: "Not found" });
		}

		if (req.method === "PATCH") {
			if (!dateCreated) {
				return res.status(400).json({ error: "dateCreated query parameter is required" });
			}
			const updated = await updateClaim(id as string, dateCreated as string, req.body);
			return res.status(200).json(updated);
		}

		if (req.method === "DELETE") {
			if (!dateCreated) {
				return res.status(400).json({ error: "dateCreated query parameter is required" });
			}
			await deleteClaim(id as string, dateCreated as string);
			return res.status(204).end();
		}

		return res.status(405).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
}

export default withMock(handler, 'claims');
