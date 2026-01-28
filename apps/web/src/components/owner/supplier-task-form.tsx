"use client";

import * as React from "react";

import { createSupplierTask } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupplierTaskForm({ supplierId }: { supplierId: string }) {
  const [message, setMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <form
      className="grid gap-3 rounded-lg border border-border bg-background p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
          supplier_id: supplierId,
          title: String(formData.get("title") ?? ""),
          due_at: String(formData.get("due_at") ?? ""),
        };

        setMessage(null);
        startTransition(async () => {
          const result = await createSupplierTask(payload);
          if (result?.error) {
            setMessage(result.error);
            return;
          }
          setMessage("Task created.");
          event.currentTarget.reset();
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <Input name="title" placeholder="Follow up in 3 days" required />
        <Input name="due_at" type="date" />
      </div>
      <div className="flex items-center justify-between">
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : <span />}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Add task"}
        </Button>
      </div>
    </form>
  );
}
