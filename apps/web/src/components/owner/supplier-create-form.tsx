"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createSupplier } from "@/lib/actions/suppliers";
import { supplierSchema, type SupplierInput } from "@/lib/validators";
import { supplierStatuses } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SupplierCreateForm() {
  const [status, setStatus] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierInput>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      status: "discovered",
    },
  });
  const statusField = register("status");

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    const result = await createSupplier(values);
    if (result?.error) {
      setMessage(result.error);
      return;
    }
    setMessage("Supplier created.");
    reset({ status: "discovered" });
    setStatus("discovered");
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-border bg-background p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Supplier name</label>
          <Input placeholder="Hoshino Tea" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="sales@hoshinotea.jp" {...register("email")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Website</label>
          <Input placeholder="https://example.com" {...register("website")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input placeholder="Japan" {...register("country")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Input placeholder="Uji, Kyoto" {...register("region")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Lead score (0-10)</label>
          <Input type="number" min={0} max={10} {...register("lead_score")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">MOQ (kg)</label>
          <Input type="number" min={0} {...register("moq")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
            {...statusField}
            onChange={(event) => {
              setStatus(event.target.value);
              statusField.onChange(event);
            }}
            value={status ?? "discovered"}
          >
            {supplierStatuses.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea rows={3} {...register("notes")} />
      </div>
      <div className="flex items-center justify-between">
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : <span />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add supplier"}
        </Button>
      </div>
    </form>
  );
}
