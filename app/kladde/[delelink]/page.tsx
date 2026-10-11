// Kladden via et hemmeligt delelink. Kun læseadgang, ingen login.
import { Visning, metadataFor } from "../../[slug]/visning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ delelink: string }> };

export async function generateMetadata({ params }: P) {
  return metadataFor({ delelink: (await params).delelink });
}

export default async function KladdeForside({ params }: P) {
  return <Visning adgang={{ delelink: (await params).delelink }} />;
}
