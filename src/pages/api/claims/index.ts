import { createClaim, getClaims } from "@/services/claims/claims.service";
import type { NextApiRequest, NextApiResponse } from "next";
import { withMock } from "@/lib/api/withMock";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Check authentication
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res.status(401).json({ error: "Unauthorized - Must be signed in" });
		}
		
		const roles = session.user.roles || [];
		
		if (req.method === "GET") {
			// Any authenticated user can read claims
			const claims = await getClaims();
			return res.status(200).json(claims);
		}

		if (req.method === "POST") {
			// Only admin, manager, or employee can create claims
			const canCreate = roles.includes("admin") || 
			                  roles.includes("manager") || 
			                  roles.includes("employee");
			
			if (!canCreate) {
				return res.status(403).json({ 
					error: "Forbidden - You don't have permission to create claims",
					yourRoles: roles,
					requiredRoles: ["admin", "manager", "employee"]
				});
			}
			
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

export default withMock(handler, 'claims');
