"use client";

import * as React from "react";

import { createSupplierTask } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SupplierOption = {
  id: string;
  name: string;
};

export function TaskQueueForm({ suppliers }: { suppliers: SupplierOption[] }) {
  const [message, setMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <form
      className="grid gap-3 rounded-lg border border-border bg-background p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const supplierId = String(formData.get("supplierId") ?? "");
        const title = String(formData.get("title") ?? "");
        const dueAt = String(formData.get("due_at") ?? "");

        setMessage(null);
        startTransition(async () => {
          const result = await createSupplierTask({
            supplier_id: supplierId,
            title,
            due_at: dueAt,
          });
          if (result?.error) {
            setMessage(result.error);
            return;
          }
          setMessage("Task queued.");
          event.currentTarget.reset();
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_2fr_1fr]">
        <select
          name="supplierId"
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
        >
          <option value="">Select supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <Input name="title" placeholder="Request COA" required />
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
