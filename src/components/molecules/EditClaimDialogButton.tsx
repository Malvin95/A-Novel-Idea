'use client';

import { Button } from "@/components/atoms/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import Input from "@/components/atoms/Input";
import ProjectSelect from "@/components/molecules/ProjectSelect";
import { useState, useEffect } from "react";
import { Edit2Icon } from "lucide-react";
import { Claim } from "@/shared/interfaces";
import { status } from "@/shared/enums";

interface EditClaimDialogButtonProps {
    claim: Claim;
    onClaimUpdated?: () => void;
    variant?: "icon" | "button";
}

export default function EditClaimDialogButton({ claim, onClaimUpdated, variant = "icon" }: EditClaimDialogButtonProps) {
    const [companyName, setCompanyName] = useState<string>(claim.companyName || "");
    const [associatedProject, setAssociatedProject] = useState<string>(claim.associatedProject || "");
    const [claimPeriod, setClaimPeriod] = useState<string>(claim.claimPeriod || "");
    const [amount, setAmount] = useState<string>(String(claim.amount || ""));
    const [claimStatus, setClaimStatus] = useState<string>(claim.status || status.DRAFT);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when dialog opens with fresh claim data
    useEffect(() => {
        if (open) {
            setCompanyName(claim.companyName || "");
            setAssociatedProject(claim.associatedProject || "");
            setClaimPeriod(claim.claimPeriod || "");
            setAmount(String(claim.amount || ""));
            setClaimStatus(claim.status || status.DRAFT);
            setError(null);
        }
    }, [open, claim]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/claims/${claim.id}?dateCreated=${encodeURIComponent(claim.dateCreated || "")}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName,
                    associatedProject,
                    claimPeriod,
                    amount: parseFloat(amount),
                    status: claimStatus
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update claim: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Claim updated:", data);

            // Close dialog and trigger refresh
            setOpen(false);
            onClaimUpdated?.();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.error("Error updating claim:", msg);
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
                        Edit Claim
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Claim</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Update the claim details below. Click save when you&apos;re done.
                    </DialogDescription>
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-3">
                        <Input 
                            id="company-name" 
                            label="Company Name" 
                            value={companyName} 
                            onChange={setCompanyName}
                            type="text"
                            placeholder="Acme Corporation" />
                        <ProjectSelect
                            value={associatedProject}
                            onChange={setAssociatedProject}
                            label="Associated Project"
                            placeholder="Select a project"
                        />
                        <Input 
                            id="claim-period" 
                            label="Claim Period" 
                            value={claimPeriod} 
                            onChange={setClaimPeriod}
                            type="text"
                            placeholder="2025-01" />
                        <Input 
                            id="amount" 
                            label="Claim Amount" 
                            value={amount} 
                            onChange={setAmount}
                            type="number"
                            placeholder="10000" />
                        <div className="grid gap-2">
                            <label htmlFor="status" className="text-sm font-medium">Status</label>
                            <select
                                id="status"
                                value={claimStatus}
                                onChange={(e) => setClaimStatus(e.target.value)}
                                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <option value={status.DRAFT}>Draft</option>
                                <option value={status.SUBMITTED}>Submitted</option>
                                <option value={status.APPROVED}>Approved</option>
                            </select>
                        </div>
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
