import { TaskQueueForm } from "@/components/owner/task-queue-form";
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

export default async function TasksPage() {
  const supabase = createSupabaseServerClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, due_at, suppliers(name)")
    .order("due_at", { ascending: true });

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Task queue</h1>
        <p className="text-muted-foreground">
          Track follow-ups, lab requests, and sampling actions.
        </p>
      </div>

      <TaskQueueForm suppliers={suppliers ?? []} />

      <div className="rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(tasks ?? []).map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {task.suppliers?.name ?? "—"}
                </TableCell>
                <TableCell>
                  {task.due_at ? new Date(task.due_at).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
