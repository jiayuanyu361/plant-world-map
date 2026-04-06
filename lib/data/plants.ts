import { cache } from "react";
import { redirect } from "next/navigation";
import { buildHomepagePlants, withPlantImage } from "@/lib/demo-atlas";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Plant, PlantAtlasInfo, PlantComment, UserProfile } from "@/lib/types";

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

const atlasSelect = `
  name,
  scientific_name,
  season,
  viewing_season,
  region,
  region_focus,
  habitat,
  flower_meaning,
  latitude,
  longitude,
  image_url
`;

const LOCAL_DEMO_PLANTS = buildHomepagePlants([]);

type ProfilePreview = Pick<UserProfile, "username" | "avatar_url">;

type PlantRow = Omit<Plant, "user_profiles" | "atlas"> & {
  user_profiles?: ProfilePreview | ProfilePreview[] | null;
};

type CommentRow = Omit<PlantComment, "user_profiles"> & {
  user_profiles?: ProfilePreview | ProfilePreview[] | null;
};

type AtlasRow = {
  name: string;
  scientific_name: string | null;
  season: string | null;
  viewing_season: string | null;
  region: string | null;
  region_focus: string | null;
  habitat: string | null;
  flower_meaning: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
};

type AtlasLookupEntry = PlantAtlasInfo & {
  image_url: string | null;
};

type AtlasLookup = {
  byExact: Map<string, AtlasLookupEntry>;
  byName: Map<string, AtlasLookupEntry>;
};

function normalizeProfileRelation(
  profile: ProfilePreview | ProfilePreview[] | null | undefined
): ProfilePreview | null {
  if (!profile) {
    return null;
  }

  return Array.isArray(profile) ? profile[0] ?? null : profile;
}

function normalizePlant(row: PlantRow): Plant {
  return {
    ...row,
    user_profiles: normalizeProfileRelation(row.user_profiles)
  };
}

function normalizeComment(row: CommentRow): PlantComment {
  return {
    ...row,
    user_profiles: normalizeProfileRelation(row.user_profiles)
  };
}

function normalizePlantKey(name: string) {
  return name.trim().toLowerCase();
}

function buildPlantCoordKey(name: string, latitude: number, longitude: number) {
  return `${normalizePlantKey(name)}|${latitude.toFixed(4)}|${longitude.toFixed(4)}`;
}

function normalizeAtlasEntry(row: AtlasRow): AtlasLookupEntry {
  return {
    scientific_name: row.scientific_name,
    season: row.season,
    viewing_season: row.viewing_season,
    region: row.region,
    region_focus: row.region_focus,
    habitat: row.habitat,
    flower_meaning: row.flower_meaning,
    image_url: row.image_url
  };
}

function buildAtlasLookup(rows: AtlasRow[] | null | undefined): AtlasLookup {
  const byExact = new Map<string, AtlasLookupEntry>();
  const byName = new Map<string, AtlasLookupEntry>();

  for (const row of rows ?? []) {
    const entry = normalizeAtlasEntry(row);
    byExact.set(buildPlantCoordKey(row.name, row.latitude, row.longitude), entry);

    const nameKey = normalizePlantKey(row.name);
    if (!byName.has(nameKey)) {
      byName.set(nameKey, entry);
    }
  }

  return { byExact, byName };
}

function mergePlantWithAtlas(plant: Plant, atlasLookup: AtlasLookup): Plant {
  const atlas = atlasLookup.byExact.get(buildPlantCoordKey(plant.name, plant.latitude, plant.longitude))
    ?? atlasLookup.byName.get(normalizePlantKey(plant.name))
    ?? null;

  return withPlantImage({
    ...plant,
    image_url: plant.image_url ?? atlas?.image_url ?? null,
    atlas
  });
}

function getDemoPlantById(id: string) {
  return LOCAL_DEMO_PLANTS.find((plant) => plant.id === id) ?? null;
}

export const getApprovedPlants = cache(async (): Promise<Plant[]> => {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const [{ data, error }, { data: atlasData, error: atlasError }] = await Promise.all([
    supabase
      .from("plants")
      .select(plantSelect)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase.from("atlas_entries").select(atlasSelect).eq("status", "approved")
  ]);

  if (error) {
    console.error(error);
    return [];
  }

  if (atlasError) {
    console.error(atlasError);
  }

  const atlasLookup = buildAtlasLookup((atlasData as AtlasRow[] | null) ?? []);
  return ((data as PlantRow[] | null) ?? []).map(normalizePlant).map((plant) => mergePlantWithAtlas(plant, atlasLookup));
});

export const getPlantById = cache(async (id: string): Promise<Plant | null> => {
  const demoPlant = getDemoPlantById(id);
  if (demoPlant) {
    return demoPlant;
  }

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

  const plant = normalizePlant(data as PlantRow);
  const { data: atlasData, error: atlasError } = await supabase
    .from("atlas_entries")
    .select(atlasSelect)
    .eq("status", "approved")
    .eq("name", plant.name);

  if (atlasError) {
    console.error(atlasError);
  }

  return mergePlantWithAtlas(plant, buildAtlasLookup((atlasData as AtlasRow[] | null) ?? []));
});

export async function getPlantComments(plantId: string): Promise<PlantComment[]> {
  if (plantId.startsWith("demo-")) {
    return [];
  }

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

  return ((data as CommentRow[] | null) ?? []).map(normalizeComment);
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

  return ((data as PlantRow[] | null) ?? []).map(normalizePlant).map(withPlantImage);
}
