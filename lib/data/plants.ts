import { cache } from "react";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Plant, PlantComment, UserProfile } from "@/lib/types";

const plantSelect = `
  id,
  name,
  description,
  image_url,
  latitude,
  longitude,
  tags,
  status,
  created_at,
  created_by,
  user_profiles:user_profiles!plants_created_by_fkey (
    username,
    avatar_url
  )
`;

export const getApprovedPlants = cache(async (): Promise<Plant[]> => {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select(plantSelect)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Plant[]) ?? [];
});

export const getPlantById = cache(async (id: string): Promise<Plant | null> => {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select(plantSelect)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Plant;
});

export async function getPlantComments(plantId: string): Promise<PlantComment[]> {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
        id,
        content,
        created_at,
        user_id,
        plant_id,
        user_profiles:user_profiles!comments_user_id_fkey (
          username,
          avatar_url
        )
      `
    )
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as PlantComment[]) ?? [];
}

export async function getCurrentUserProfile() {
  if (!hasSupabaseEnv()) {
    return { user: null, profile: null as UserProfile | null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as UserProfile | null };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, username, avatar_url, is_admin")
    .eq("id", user.id)
    .single();

  return { user, profile: (profile as UserProfile | null) ?? null };
}

export async function requireUser() {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    redirect("/auth");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await requireUser();

  if (!profile?.is_admin) {
    redirect("/");
  }

  return { user, profile };
}

export async function getPendingPlants() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select(plantSelect)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Plant[]) ?? [];
}
