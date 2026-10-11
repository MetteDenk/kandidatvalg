import { Visning, metadataFor } from "../visning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ slug: string; side: string }> };

export async function generateMetadata({ params }: P) {
  return metadataFor((await params).slug);
}

export default async function KandidatUnderside({ params }: P) {
  const { slug, side } = await params;
  return <Visning slug={slug} side={side} />;
}
