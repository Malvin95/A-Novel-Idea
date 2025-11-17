import { Project } from "@/shared/interfaces";
import { mockProjects } from "../stubData";

export async function getProjects() {
    return mockProjects;
}

export async function getProject(id: string) {
    return mockProjects.find(p => p.id === id);
}

export async function createProject(data: Project) {
    const newProject = { id: Date.now().toString(), ...data };
    mockProjects.push(newProject);
    return newProject;
}

export async function updateProject(id: string, data: Project) {
    const idx = mockProjects.findIndex(p => p.id === id);
    mockProjects[idx] = { ...mockProjects[idx], ...data };
    return mockProjects[idx];
}

export async function deleteProject(id: string) {
    const idx = mockProjects.findIndex(p => p.id === id);
    mockProjects.splice(idx, 1);
}
  