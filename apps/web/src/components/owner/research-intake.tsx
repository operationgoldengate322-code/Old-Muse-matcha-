"use client";

import * as React from "react";

import { createSupplier } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ResearchResult = {
  name: string;
  region: string | null;
  country: string | null;
  website: string | null;
  emails: string[];
  socials: string[];
  product_notes: string;
  moq: string | null;
  pricing_hints: string | null;
  quality_signals: string[];
};

function extractMoq(moq: string | null) {
  if (!moq) return undefined;
  const match = moq.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export function ResearchIntake() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<ResearchResult | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Research intake</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input
            placeholder="Paste a URL or supplier description"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button
            disabled={isPending}
            onClick={() => {
              setStatus(null);
              if (!input.trim()) {
                setStatus("Add a URL or description first.");
                return;
              }
              startTransition(async () => {
                const response = await fetch("/api/ai/research", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ input }),
                });
                const data = await response.json();
                if (!response.ok) {
                  setStatus(data?.error ?? "Research failed.");
                  return;
                }
                setResult(data?.data ?? null);
                setStatus("Research completed.");
              });
            }}
          >
            {isPending ? "Researching..." : "Run research"}
          </Button>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>Extracted supplier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="text-lg font-semibold text-foreground">{result.name}</p>
            <p>
              {[result.region, result.country].filter(Boolean).join(", ") || "—"}
            </p>
            <p>{result.website ?? "No website"}</p>
            <p>{result.emails?.[0] ?? "No email found"}</p>
            <p>{result.product_notes}</p>
            <p>MOQ: {result.moq ?? "Unknown"}</p>
            <p>Pricing: {result.pricing_hints ?? "Unknown"}</p>
            <div className="flex flex-wrap gap-2">
              {(result.quality_signals ?? []).map((signal) => (
                <span
                  key={signal}
                  className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {signal}
                </span>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={async () => {
                setStatus(null);
                const response = await createSupplier({
                  name: result.name,
                  country: result.country,
                  region: result.region,
                  website: result.website,
                  email: result.emails?.[0] ?? null,
                  notes: [
                    result.product_notes,
                    result.pricing_hints,
                    result.socials?.join(", "),
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  status: "discovered",
                  moq: extractMoq(result.moq),
                });
                if (response?.error) {
                  setStatus(response.error);
                  return;
                }
                setStatus("Supplier saved to CRM.");
              }}
            >
              Save to suppliers
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
