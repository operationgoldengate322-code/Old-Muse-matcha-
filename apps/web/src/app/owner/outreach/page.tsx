import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OutreachComposer } from "@/components/owner/outreach-composer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function OutreachPage() {
  const supabase = createSupabaseServerClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, country, region, website, email, notes, lead_score")
    .order("created_at", { ascending: false });

  const { data: outreach } = await supabase
    .from("outreach_messages")
    .select("id, subject, status, sent_at, suppliers(name)")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Outreach composer</h1>
        <p className="text-muted-foreground">
          Generate personalized emails and log outreach history.
        </p>
      </div>

      <OutreachComposer suppliers={suppliers ?? []} />

      <div className="grid gap-4 md:grid-cols-2">
        {(outreach ?? []).map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <CardTitle>{message.subject ?? "Draft message"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Supplier: {message.suppliers?.name ?? "Unknown"}</p>
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
  );
}
