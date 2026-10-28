import OneTimeFormPage from '@/domain/one-time-form/ui/OneTimeFormPage';

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return <OneTimeFormPage slug={slug} />;
};

export default Page;
