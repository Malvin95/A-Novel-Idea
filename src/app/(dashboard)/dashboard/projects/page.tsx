"use client";
import { useState } from "react";
import ProjectsPanel from "@/components/organisms/ProjectsPanel";
import { H1, P } from "@/components/atoms/Typography";
import NewProjectDialogButton from "@/components/molecules/NewProjectDialogeButton";

export default function ProjectsPage() {
  const [refreshProjects, setRefreshProjects] = useState<(() => void) | null>(null);

  const handleRefreshNeeded = (refreshFn: () => void) => {
    setRefreshProjects(() => refreshFn);
  };

  const handleProjectCreated = () => {
    if (refreshProjects) {
      refreshProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Projects</H1>
          <P>Manage your projects</P>
        </div>
        <NewProjectDialogButton onProjectCreated={handleProjectCreated} />
      </div>

      <ProjectsPanel onRefreshNeeded={handleRefreshNeeded} />
    </div>
  );
}

