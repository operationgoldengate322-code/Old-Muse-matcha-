import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Owner settings</h1>
        <p className="text-muted-foreground">
          Configure billing, alerts, and team access.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team access</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Owner access is controlled through the profiles role field. Promote
          trusted operators to the <span className="font-medium">owner</span>{" "}
          role to unlock this portal.
        </CardContent>
      </Card>
    </div>
  );
}
