'use client';

import { Button } from "@/components/atoms/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import Input from "@/components/atoms/Input";
import { useState } from "react";
import { status } from "@/shared/enums";

interface NewClaimDialogButtonProps {
    onClaimCreated?: () => void;
}

export default function NewClaimDialogButton({ onClaimCreated }: NewClaimDialogButtonProps) {
    const [companyName, setCompanyName] = useState<string>("");
    const [associatedProject, setAssociatedProject] = useState<string>("");
    const [claimPeriod, setClaimPeriod] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/claims", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName,
                    associatedProject,
                    claimPeriod,
                    amount: parseFloat(amount),
                    status: status.DRAFT
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create claim: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Claim created:", data);

            // Close dialog and trigger refresh
            setOpen(false);
            onClaimCreated?.();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.error("Error creating claim:", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset form when dialog closes
            setCompanyName("");
            setAssociatedProject("");
            setClaimPeriod("");
            setAmount("");
            setError(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100">
                    New Claim
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Claim</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Fill in the claim details below. Click save when you&apos;re done.
                    </DialogDescription>
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-4 my-4">
                        <div className="grid gap-3">
                            <Input 
                                id="company-name" 
                                label="Company Name" 
                                value={companyName} 
                                onChange={setCompanyName}
                                type="text"
                                placeholder="Acme Corporation" />
                            <Input 
                                id="associated-project" 
                                label="Associated Project" 
                                value={associatedProject} 
                                onChange={setAssociatedProject}
                                type="text"
                                placeholder="Project Alpha" />
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
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
