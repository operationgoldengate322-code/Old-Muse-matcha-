import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default async function OwnerDashboardPage() {
  const supabase = createSupabaseServerClient();
  const weekStart = startOfWeek(new Date()).toISOString();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, lead_score, moq, created_at");

  const { data: outreach } = await supabase
    .from("outreach_messages")
    .select("id, status, sent_at");

  const newSuppliers =
    suppliers?.filter((supplier) => {
      const created = new Date(supplier.created_at).getTime();
      return created >= new Date(weekStart).getTime();
    }).length ?? 0;

  const sentOutreach =
    outreach?.filter((message) => message.status === "sent" || message.status === "replied")
      .length ?? 0;

  const repliedOutreach =
    outreach?.filter((message) => message.status === "replied").length ?? 0;

  const replyRate =
    sentOutreach > 0 ? Math.round((repliedOutreach / sentOutreach) * 100) : 0;

  const moqValues =
    suppliers?.map((supplier) => supplier.moq).filter(Boolean) ?? [];
  const avgMoq =
    moqValues.length > 0
      ? Math.round(moqValues.reduce((acc, value) => acc + value, 0) / moqValues.length)
      : 0;

  const leadScores = suppliers?.map((supplier) => supplier.lead_score ?? 0) ?? [];
  const leadDistribution = {
    low: leadScores.filter((score) => score < 4).length,
    medium: leadScores.filter((score) => score >= 4 && score < 8).length,
    high: leadScores.filter((score) => score >= 8).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Owner dashboard</h1>
        <p className="text-muted-foreground">
          Weekly supplier pipeline and outreach performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>New suppliers this week</CardDescription>
            <CardTitle className="text-2xl">{newSuppliers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Outreach sent</CardDescription>
            <CardTitle className="text-2xl">{sentOutreach}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Reply rate</CardDescription>
            <CardTitle className="text-2xl">{replyRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average MOQ</CardDescription>
            <CardTitle className="text-2xl">
              {avgMoq > 0 ? `${avgMoq}kg` : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead score distribution</CardTitle>
          <CardDescription>Low / medium / high scores</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {leadDistribution.low}
            </p>
            <p>Low (0-3)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {leadDistribution.medium}
            </p>
            <p>Medium (4-7)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {leadDistribution.high}
            </p>
            <p>High (8-10)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
