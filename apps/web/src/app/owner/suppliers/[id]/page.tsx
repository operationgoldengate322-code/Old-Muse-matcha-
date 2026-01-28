import { notFound } from "next/navigation";

import { SupplierContactForm } from "@/components/owner/supplier-contact-form";
import { SupplierStatusForm } from "@/components/owner/supplier-status-form";
import { SupplierTaskForm } from "@/components/owner/supplier-task-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SupplierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select(
      "id, name, country, region, website, instagram, email, notes, lead_score, moq, status, created_at"
    )
    .eq("id", params.id)
    .single();

  if (!supplier) {
    notFound();
  }

  const { data: contacts } = await supabase
    .from("supplier_contacts")
    .select("id, name, email, role, notes")
    .eq("supplier_id", supplier.id);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, due_at")
    .eq("supplier_id", supplier.id)
    .order("due_at", { ascending: true });

  const { data: outreach } = await supabase
    .from("outreach_messages")
    .select("id, subject, channel, status, sent_at")
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Supplier</p>
          <h1 className="text-3xl font-semibold tracking-tight">{supplier.name}</h1>
          <p className="text-muted-foreground">
            {[supplier.region, supplier.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <Badge variant="outline">{supplier.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Email:</span>{" "}
              {supplier.email ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Website:</span>{" "}
              {supplier.website ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Instagram:</span>{" "}
              {supplier.instagram ?? "—"}
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Lead score:</span>{" "}
              {supplier.lead_score ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">MOQ:</span>{" "}
              {supplier.moq ? `${supplier.moq}kg` : "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Created:</span>{" "}
              {new Date(supplier.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-foreground">Notes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {supplier.notes ?? "No notes yet."}
            </p>
          </div>
          <SupplierStatusForm
            supplierId={supplier.id}
            currentStatus={supplier.status}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contacts</h2>
          <SupplierContactForm supplierId={supplier.id} />
          <div className="space-y-3">
            {(contacts ?? []).map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <CardTitle>{contact.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{contact.role ?? "Role not set"}</p>
                  <p>{contact.email ?? "No email"}</p>
                  {contact.notes ? <p>{contact.notes}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <SupplierTaskForm supplierId={supplier.id} />
          <div className="space-y-3">
            {(tasks ?? []).map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Status: {task.status}</p>
                  {task.due_at ? (
                    <p>Due {new Date(task.due_at).toLocaleDateString()}</p>
                  ) : (
                    <p>No due date</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Outreach history</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(outreach ?? []).map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle>{message.subject ?? "Draft message"}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Channel: {message.channel ?? "email"}</p>
                <p>Status: {message.status}</p>
                {message.sent_at ? (
                  <p>Sent {new Date(message.sent_at).toLocaleDateString()}</p>
                ) : (
                  <p>Not sent</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
