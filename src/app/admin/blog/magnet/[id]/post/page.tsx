import { fetchMagnetPost } from '@/domain/admin/blog/magnet/mock';
import MagnetPostPage from '@/domain/admin/blog/magnet/MagnetPostPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const initialData = await fetchMagnetPost(Number(id));

  return <MagnetPostPage magnetId={id} initialData={initialData} />;
};

export default Page;
