import { createProject, getProjects } from "@/pages/services/projects/projects.services";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === "GET") {
			const projects = await getProjects();
			return res.status(200).json(projects);
		}

		if (req.method === "POST") {
			const body = req.body; // JSON body
			const project = await createProject(body);
			return res.status(201).json(project);
		}

		return res.status(405).end(`Method ${req.method} Not Allowed`);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
