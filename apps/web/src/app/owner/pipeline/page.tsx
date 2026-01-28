import Link from "next/link";

import { SupplierStatusForm } from "@/components/owner/supplier-status-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierStatuses } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PipelinePage() {
  const supabase = createSupabaseServerClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, region, country, status, lead_score")
    .order("created_at", { ascending: false });

  const grouped = supplierStatuses.reduce<Record<string, typeof suppliers>>(
    (acc, status) => {
      acc[status] = (suppliers ?? []).filter(
        (supplier) => supplier.status === status
      );
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Move suppliers through the sourcing stages.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {supplierStatuses.map((status) => (
          <Card key={status} className="bg-background">
            <CardHeader>
              <CardTitle className="text-base capitalize">{status}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(grouped[status] ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No suppliers</p>
              ) : null}
              {(grouped[status] ?? []).map((supplier) => (
                <Card key={supplier.id} className="border border-border">
                  <CardContent className="space-y-2 p-4 text-sm">
                    <Link
                      href={`/owner/suppliers/${supplier.id}`}
                      className="font-medium hover:underline"
                    >
                      {supplier.name}
                    </Link>
                    <p className="text-muted-foreground">
                      {[supplier.region, supplier.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      Lead score: {supplier.lead_score ?? "—"}
                    </p>
                    <SupplierStatusForm
                      supplierId={supplier.id}
                      currentStatus={supplier.status}
                    />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
