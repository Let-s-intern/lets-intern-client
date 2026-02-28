import MagnetPostPage from '@/domain/admin/blog/magnet/MagnetPostPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <MagnetPostPage magnetId={id} />;
};

export default Page;
