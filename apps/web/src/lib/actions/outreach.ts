"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseActionClient } from "@/lib/supabase/server";

export async function saveOutreachMessage(input: unknown) {
  const schema = z.object({
    supplier_id: z.string().uuid(),
    subject: z.string().min(1),
    body: z.string().min(1),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid outreach payload." };
  }

  const supabase = createSupabaseActionClient();
  const { error } = await supabase.from("outreach_messages").insert({
    supplier_id: parsed.data.supplier_id,
    subject: parsed.data.subject,
    body: parsed.data.body,
    channel: "email",
    status: "draft",
    metadata_json: { source: "ai" },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/owner/outreach");
  return { success: true };
}
