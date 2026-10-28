import CompletePage from '@/domain/one-time-form/complete/ui/CompletePage';

// slug 검사는 상위 layout 이 한다
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return <CompletePage slug={slug} />;
};

export default Page;
