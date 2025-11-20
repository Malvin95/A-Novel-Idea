import { H3 } from "../atoms/Typography";
import { Project, Claim } from "@/shared/interfaces";
import DeleteDialogButton from "./DeleteDialogButton";
import EditProjectDialogButton from "./EditProjectDialogButton";
import EditClaimDialogButton from "./EditClaimDialogButton";

interface InfoCardProps {
  item: Project | Claim;
  type: "project" | "claim";
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
}

export default function InfoCard({ item, type, onEdit, onDelete }: InfoCardProps) {
  const renderProjectContent = (project: Project) => (
    <>
      <H3>{project.projectName || "Untitled Project"}</H3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Date Created: {project.dateCreated || "N/A"}
      </p>
    </>
  );

  const renderClaimContent = (claim: Claim) => (
    <>
      <H3>{claim.companyName || "Untitled Company"}</H3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Associated Project: {claim.associatedProject || "N/A"}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Claim Period: {claim.claimPeriod || "N/A"}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Claim Amount: {claim.amount ?? "N/A"}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Current Status: {claim.status || "N/A"}
      </p>
    </>
  );

  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex">
        <div className="flex-1">
          {type === "project" ? renderProjectContent(item as Project) : renderClaimContent(item as Claim)}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2 md:flex-row">
          {type === "project" && onEdit && (
            <EditProjectDialogButton
              project={item as Project}
              onProjectUpdated={onEdit}
              variant="icon"
            />
          )}
          {type === "claim" && onEdit && (
            <EditClaimDialogButton
              claim={item as Claim}
              onClaimUpdated={onEdit}
              variant="icon"
            />
          )}
          {onDelete && (
            <DeleteDialogButton
              itemName={
                type === "project" 
                  ? (item as Project).projectName || "this project"
                  : (item as Claim).companyName || "this claim"
              }
              itemType={type}
              onConfirmDelete={onDelete}
              variant="icon"
            />
          )}
        </div>
      </div>
    </div>
  );
}
