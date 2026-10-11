"use server";

import { redirect } from "next/navigation";
import { redeemMagicLink } from "@/lib/auth";

export async function verifyMagicLinkAction(formData: FormData): Promise<void> {
  const userId = await redeemMagicLink(String(formData.get("token") ?? ""));
  if (!userId) redirect("/login/verify?fejl=1");
  redirect("/guide");
}
