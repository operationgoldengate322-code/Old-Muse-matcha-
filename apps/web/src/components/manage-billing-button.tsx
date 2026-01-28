"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function ManageBillingButton() {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const response = await fetch("/api/stripe/portal", {
            method: "POST",
          });
          if (response.status === 401) {
            window.location.href = "/account";
            return;
          }
          const data = await response.json();
          if (data?.url) {
            window.location.href = data.url;
          }
        });
      }}
    >
      {isPending ? "Opening..." : "Manage billing"}
    </Button>
  );
}
