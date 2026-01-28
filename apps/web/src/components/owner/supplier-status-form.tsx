"use client";

import * as React from "react";

import { updateSupplierStatus } from "@/lib/actions/suppliers";
import { supplierStatuses } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function SupplierStatusForm({
  supplierId,
  currentStatus,
}: {
  supplierId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = React.useState(currentStatus);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        {supplierStatuses.map((statusValue) => (
          <option key={statusValue} value={statusValue}>
            {statusValue}
          </option>
        ))}
      </select>
      <Button
        disabled={isPending}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const result = await updateSupplierStatus({
              id: supplierId,
              status,
            });
            if (result?.error) {
              setMessage(result.error);
              return;
            }
            setMessage("Status updated.");
          });
        }}
      >
        {isPending ? "Saving..." : "Update status"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
