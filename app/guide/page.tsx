import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { findEllerOpret, laes } from "@/lib/kandidat";
import { Guide } from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const k = await findEllerOpret(user.id, user.email);
  const { data, tekster, rettelser } = laes(k);
  return (
    <Guide
      startData={data}
      startTekster={tekster}
      startRettelser={rettelser}
      startSlug={k.slug}
      startOffentlig={k.published}
      startDelelink={k.delelink}
      harTekster={!!k.genereretAt}
      appUrl={process.env.APP_URL ?? ""}
    />
  );
}
