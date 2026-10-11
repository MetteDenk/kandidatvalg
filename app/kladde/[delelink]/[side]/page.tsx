import { Visning, metadataFor } from "../../../[slug]/visning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ delelink: string; side: string }> };

export async function generateMetadata({ params }: P) {
  return metadataFor({ delelink: (await params).delelink });
}

export default async function KladdeUnderside({ params }: P) {
  const { delelink, side } = await params;
  return <Visning adgang={{ delelink }} side={side} />;
}
