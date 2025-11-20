"use client";
import { useState } from "react";
import ClaimsPanel from "@/components/organisms/ClaimsPanel";
import { H1, P } from "@/components/atoms/Typography";
import NewClaimDialogButton from "@/components/molecules/NewClaimDialogButton";

export default function ClaimsPage() {
  const [refreshClaims, setRefreshClaims] = useState<(() => void) | null>(null);

  const handleRefreshNeeded = (refreshFn: () => void) => {
    setRefreshClaims(() => refreshFn);
  };

  const handleClaimCreated = () => {
    if (refreshClaims) {
      refreshClaims();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Claims</H1>
          <P>View and manage your claims</P>
        </div>
        <NewClaimDialogButton onClaimCreated={handleClaimCreated} />
      </div>

      <ClaimsPanel onRefreshNeeded={handleRefreshNeeded} />
    </div>
  );
}

