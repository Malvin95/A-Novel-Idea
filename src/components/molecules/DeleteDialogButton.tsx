'use client';

import { Button } from "@/components/atoms/ui/button";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/atoms/dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteDialogButtonProps {
  itemName: string;
  itemType: "project" | "claim";
  onConfirmDelete: () => void | Promise<void>;
  variant?: "icon" | "button";
}

export default function DeleteDialogButton({ 
  itemName, 
  itemType, 
  onConfirmDelete,
  variant = "icon"
}: DeleteDialogButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirmDelete();
      setOpen(false);
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="outline" size="icon" aria-label="Delete">
            <Trash2 width="15" height="15" />
          </Button>
        ) : (
          <Button variant="destructive">
            Delete {itemType}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemType === "project" ? "Project" : "Claim"}?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete <strong>{itemName}</strong>? 
          This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
