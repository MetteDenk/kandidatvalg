import { Visning, metadataFor } from "./visning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  return metadataFor({ slug: (await params).slug });
}

export default async function KandidatForside({ params }: P) {
  return <Visning adgang={{ slug: (await params).slug }} />;
}
