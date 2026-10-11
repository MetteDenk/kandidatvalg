import { Visning, metadataFor } from "./visning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  return metadataFor((await params).slug);
}

export default async function KandidatForside({ params }: P) {
  return <Visning slug={(await params).slug} />;
}
