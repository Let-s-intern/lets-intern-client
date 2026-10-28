import MyApplicationPage from '@/domain/one-time-form/my/ui/MyApplicationPage';

// slug 검사는 상위 layout 이 한다
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return <MyApplicationPage slug={slug} />;
};

export default Page;
