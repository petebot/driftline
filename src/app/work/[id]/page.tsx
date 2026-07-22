import { WorkDetailPage } from "@/components/driftline/work-detail-page";

export default async function WorkItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkDetailPage id={id} />;
}
