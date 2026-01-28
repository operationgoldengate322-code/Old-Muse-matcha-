import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role, stripe_customer_id, created_at")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/account");
  }
  return user;
}

export async function requireOwner() {
  const profile = await getProfile();
  if (!profile || profile.role !== "owner") {
    redirect("/account?error=owner_required");
  }
  return profile;
}
