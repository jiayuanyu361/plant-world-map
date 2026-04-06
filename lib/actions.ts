"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin, requireUser } from "@/lib/data/plants";
import { toTagArray } from "@/lib/utils";

async function getSiteUrl() {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

async function uploadPlantImage(file: File) {
  const supabase = await createSupabaseServerClient();
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const filePath = `plants/${randomUUID()}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("plant-images")
    .upload(filePath, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("plant-images").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "");
  const supabase = await createSupabaseServerClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        username
      }
    }
  });

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth?message=注册成功，请检查邮箱确认链接");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createPlantAction(formData: FormData) {
  const { user } = await requireUser();
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const tags = toTagArray(String(formData.get("tags") ?? ""));
  const imageFile = formData.get("image");

  if (!name || !description || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    redirect("/submit?error=请完整填写表单");
  }

  let imageUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadPlantImage(imageFile);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plants").insert({
    name,
    description,
    latitude,
    longitude,
    tags,
    image_url: imageUrl,
    status: "pending",
    created_by: user.id
  });

  if (error) {
    redirect(`/submit?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/submit?message=植物已提交，等待管理员审核");
}

export async function createCommentAction(formData: FormData) {
  const { user } = await requireUser();
  const plantId = String(formData.get("plantId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    redirect(`/plants/${plantId}?error=评论不能为空`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").insert({
    plant_id: plantId,
    user_id: user.id,
    content
  });

  if (error) {
    redirect(`/plants/${plantId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/plants/${plantId}`);
  redirect(`/plants/${plantId}`);
}

export async function reviewPlantAction(formData: FormData) {
  await requireAdmin();
  const plantId = String(formData.get("plantId") ?? "");
  const status = String(formData.get("status") ?? "");
  const supabase = await createSupabaseServerClient();

  if (!["approved", "rejected"].includes(status)) {
    redirect("/admin?error=非法状态");
  }

  const { error } = await supabase
    .from("plants")
    .update({ status })
    .eq("id", plantId);

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
