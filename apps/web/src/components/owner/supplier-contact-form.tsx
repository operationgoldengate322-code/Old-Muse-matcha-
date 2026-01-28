"use client";

import * as React from "react";

import { addSupplierContact } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SupplierContactForm({ supplierId }: { supplierId: string }) {
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
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          role: String(formData.get("role") ?? ""),
          notes: String(formData.get("notes") ?? ""),
        };

        setMessage(null);
        startTransition(async () => {
          const result = await addSupplierContact(payload);
          if (result?.error) {
            setMessage(result.error);
            return;
          }
          setMessage("Contact added.");
          event.currentTarget.reset();
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="name" placeholder="Contact name" required />
        <Input name="email" placeholder="email@domain.com" />
        <Input name="role" placeholder="Role" />
      </div>
      <Textarea name="notes" placeholder="Notes" rows={3} />
      <div className="flex items-center justify-between">
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : <span />}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Add contact"}
        </Button>
      </div>
    </form>
  );
}
