import { deleteProject, getProject, updateProject } from "@/pages/services/projects/projects.services";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id, dateCreated } = req.query;

	try {
	if (req.method === "GET") {
		const project = await getProject(id as string, dateCreated as string);
		return project
		? res.status(200).json(project)
		: res.status(404).json({ error: "Not found" });
	}

	if (req.method === "PATCH") {
		const updated = await updateProject(id as string, dateCreated as string, req.body);
		return res.status(200).json(updated);
	}

	if (req.method === "DELETE") {
		await deleteProject(id as string, dateCreated as string);
		return res.status(204).end();
	}
		return res.status(405).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
}
