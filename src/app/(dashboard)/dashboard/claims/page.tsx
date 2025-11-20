import ClaimsPanel from "@/components/organisms/ClaimsPanel";
import { H1, P } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Claims</H1>
          <P>View and manage your claims</P>
        </div>
        <Button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100">
          New Claim
        </Button>
      </div>

      <ClaimsPanel />
    </div>
  );
}

