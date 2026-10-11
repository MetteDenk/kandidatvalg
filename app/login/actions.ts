"use server";

import { redirect } from "next/navigation";
import { requestMagicLink, logout } from "@/lib/auth";

export async function requestMagicLinkAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  try {
    await requestMagicLink(email);
  } catch {
    redirect("/login?fejl=1");
  }
  redirect("/login?sendt=1");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/");
}
