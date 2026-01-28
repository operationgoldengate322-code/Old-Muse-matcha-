"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { saveOutreachMessage } from "@/lib/actions/outreach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const composerSchema = z.object({
  supplierId: z.string().min(1),
  brandVoice: z.string().min(1),
  goal: z.string().min(1),
});

type ComposerValues = z.infer<typeof composerSchema>;

type SupplierOption = {
  id: string;
  name: string;
  country: string | null;
  region: string | null;
  website: string | null;
  email: string | null;
  notes: string | null;
  lead_score: number | null;
};

export function OutreachComposer({ suppliers }: { suppliers: SupplierOption[] }) {
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);
  const [isGenerating, startGenerating] = React.useTransition();
  const [isSaving, startSaving] = React.useTransition();

  const { register, handleSubmit, formState, watch } = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      brandVoice:
        "Warm, thoughtful, minimal. Prioritize relationships and clarity over sales.",
      goal: "Introduce Old Muse Matcha and request samples + MOQ details.",
    },
  });
  const supplierId = watch("supplierId");

  const onGenerate = handleSubmit(async (values) => {
    const supplier = suppliers.find((item) => item.id === values.supplierId);
    if (!supplier) {
      setStatus("Select a supplier first.");
      return;
    }
    setStatus(null);
    startGenerating(async () => {
      const response = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier,
          brandVoice: values.brandVoice,
          goal: values.goal,
        }),
      });
      const data = await response.json();
      setSubject(data?.subject ?? "");
      setBody(data?.body ?? "");
      setStatus(response.ok ? "Draft generated." : data?.error ?? "AI failed.");
    });
  });

  const onSave = () => {
    setStatus(null);
    startSaving(async () => {
      if (!supplierId) {
        setStatus("Select a supplier before saving.");
        return;
      }
      const result = await saveOutreachMessage({
        supplier_id: supplierId,
        subject,
        body,
      });
      if (result?.error) {
        setStatus(result.error);
        return;
      }
      setStatus("Draft saved.");
    });
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={onGenerate} className="grid gap-4 rounded-lg border border-border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Supplier</label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
              {...register("supplierId")}
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {formState.errors.supplierId ? (
              <p className="text-xs text-destructive">
                {formState.errors.supplierId.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal</label>
            <Input {...register("goal")} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand voice</label>
          <Textarea rows={3} {...register("brandVoice")} />
        </div>
        <div className="flex items-center justify-between">
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : <span />}
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate draft"}
          </Button>
        </div>
      </form>

      <div className="grid gap-3 rounded-lg border border-border bg-background p-6">
        <Input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject"
        />
        <Textarea
          rows={8}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Email body"
        />
        <div className="flex items-center justify-between">
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : <span />}
          <Button variant="secondary" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
