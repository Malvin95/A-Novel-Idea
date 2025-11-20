'use client';

import { Button } from "@/components/atoms/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import Input from "@/components/atoms/Input";
import { useState, useEffect } from "react";
import { Edit2Icon } from "lucide-react";
import { Project } from "@/shared/interfaces";

interface EditProjectDialogButtonProps {
    project: Project;
    onProjectUpdated?: () => void;
    variant?: "icon" | "button";
}

export default function EditProjectDialogButton({ project, onProjectUpdated, variant = "icon" }: EditProjectDialogButtonProps) {
    const [projectName, setProjectName] = useState<string>(project.projectName || "");
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when dialog opens with fresh project data
    useEffect(() => {
        if (open) {
            setProjectName(project.projectName || "");
            setError(null);
        }
    }, [open, project.projectName]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${project.id}?dateCreated=${encodeURIComponent(project.dateCreated)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectName }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update project: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Project updated:", data);

            // Close dialog and trigger refresh
            setOpen(false);
            onProjectUpdated?.();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.error("Error updating project:", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === "icon" ? (
                    <Button variant="outline" size="icon" aria-label="Edit">
                        <Edit2Icon width="15" height="15" />
                    </Button>
                ) : (
                    <Button variant="outline">
                        Edit Project
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Update the project details below. Click save when you&apos;re done.
                    </DialogDescription>
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-3">
                        <Input 
                            id="project-name" 
                            label="Project Name" 
                            value={projectName} 
                            onChange={setProjectName}
                            type="text"
                            placeholder="My Project" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
