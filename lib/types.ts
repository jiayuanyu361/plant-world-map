export type PlantStatus = "pending" | "approved" | "rejected";

export type PlantAtlasInfo = {
  scientific_name?: string | null;
  season?: string | null;
  viewing_season?: string | null;
  region?: string | null;
  region_focus?: string | null;
  habitat?: string | null;
  flower_meaning?: string | null;
};

export type UserProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

export type Plant = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  tags: string[];
  status: PlantStatus;
  created_at: string;
  created_by: string | null;
  atlas?: PlantAtlasInfo | null;
  user_profiles?: Pick<UserProfile, "username" | "avatar_url"> | null;
};

export type PlantComment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  plant_id: string;
  user_profiles?: Pick<UserProfile, "username" | "avatar_url"> | null;
};
