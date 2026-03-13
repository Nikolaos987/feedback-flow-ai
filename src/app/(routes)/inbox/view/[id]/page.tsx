import FeedbackDetailPage from "@/components/features/inbox/inboxItemDetail";

export default async function InboxItemPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params
  return <FeedbackDetailPage id={id} />;
}
