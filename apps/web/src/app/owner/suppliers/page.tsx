import Link from "next/link";

import { SupplierCreateForm } from "@/components/owner/supplier-create-form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SuppliersPage() {
  const supabase = createSupabaseServerClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, country, region, status, lead_score, moq, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Suppliers</h1>
        <p className="text-muted-foreground">
          Track matcha mills, brokers, and direct farming partners.
        </p>
      </div>

      <SupplierCreateForm />

      <div className="rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lead score</TableHead>
              <TableHead>MOQ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(suppliers ?? []).map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/owner/suppliers/${supplier.id}`}
                    className="hover:underline"
                  >
                    {supplier.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {[supplier.region, supplier.country].filter(Boolean).join(", ")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{supplier.status}</Badge>
                </TableCell>
                <TableCell>{supplier.lead_score ?? "—"}</TableCell>
                <TableCell>{supplier.moq ? `${supplier.moq}kg` : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
