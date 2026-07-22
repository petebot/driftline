import { PersonDetailPage } from "@/components/driftline/person-detail-page";

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonDetailPage id={id} />;
}
