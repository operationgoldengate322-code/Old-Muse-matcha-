import { ResearchIntake } from "@/components/owner/research-intake";

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Research</h1>
        <p className="text-muted-foreground">
          Paste a URL or notes to auto-extract supplier information.
        </p>
      </div>
      <ResearchIntake />
    </div>
  );
}
