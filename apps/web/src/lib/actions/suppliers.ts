"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseActionClient } from "@/lib/supabase/server";
import { supplierSchema } from "@/lib/validators";
import { supplierStatuses } from "@/lib/constants";

export async function createSupplier(input: unknown) {
  const parsed = supplierSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid supplier data." };
  }

  const supabase = createSupabaseActionClient();
  const { error } = await supabase.from("suppliers").insert(parsed.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/owner/suppliers");
  revalidatePath("/owner/pipeline");
  return { success: true };
}

export async function updateSupplierStatus(input: unknown) {
  const schema = z.object({
    id: z.string().uuid(),
    status: z.enum(supplierStatuses),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid status update." };
  }

  const supabase = createSupabaseActionClient();
  const { error } = await supabase
    .from("suppliers")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/owner/pipeline");
  revalidatePath(`/owner/suppliers/${parsed.data.id}`);
  return { success: true };
}

export async function addSupplierContact(input: unknown) {
  const schema = z.object({
    supplier_id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email().optional().nullable(),
    role: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid contact data." };
  }

  const supabase = createSupabaseActionClient();
  const { error } = await supabase.from("supplier_contacts").insert(parsed.data);
  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/owner/suppliers/${parsed.data.supplier_id}`);
  return { success: true };
}

export async function createSupplierTask(input: unknown) {
  const schema = z.object({
    supplier_id: z.string().uuid(),
    title: z.string().min(1),
    due_at: z.string().optional().nullable(),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid task data." };
  }

  const supabase = createSupabaseActionClient();
  const { error } = await supabase.from("tasks").insert({
    supplier_id: parsed.data.supplier_id,
    title: parsed.data.title,
    due_at: parsed.data.due_at ? new Date(parsed.data.due_at).toISOString() : null,
    status: "open",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/owner/suppliers/${parsed.data.supplier_id}`);
  revalidatePath("/owner/tasks");
  return { success: true };
}
