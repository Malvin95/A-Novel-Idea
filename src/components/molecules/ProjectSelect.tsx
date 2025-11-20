'use client';

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";

interface Project {
  id?: string;
  dateCreated?: string;
  projectName: string;
}

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function ProjectSelect({
  value,
  onChange,
  label = "Associated Project",
  placeholder = "Select a project",
  disabled = false,
}: ProjectSelectProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        
        // Handle both DynamoDB format and mock format
        const projectList = data.Items || data || [];
        
        // Extract project names from DynamoDB format or use directly
        const formattedProjects = projectList.map((item: Record<string, unknown>) => ({
          id: (item.id as { S: string })?.S || (item.id as string),
          dateCreated: (item.dateCreated as { S: string })?.S || (item.dateCreated as string),
          projectName: (item.projectName as { S: string })?.S || (item.projectName as string),
        }));
        
        setProjects(formattedProjects);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load projects";
        setError(errorMsg);
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading projects..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <div className="px-2 py-1.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : projects.length === 0 && !loading ? (
            <div className="px-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              No projects available
            </div>
          ) : (
            projects.map((project) => (
              <SelectItem key={`${project.id}-${project.dateCreated}`} value={project.projectName}>
                {project.projectName}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
