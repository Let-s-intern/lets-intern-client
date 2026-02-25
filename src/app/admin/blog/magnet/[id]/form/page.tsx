import { fetchMagnetForm } from '@/domain/admin/blog/magnet/mock';
import MagnetFormPage from '@/domain/admin/blog/magnet/MagnetFormPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const initialData = await fetchMagnetForm(Number(id));

  return <MagnetFormPage magnetId={id} initialData={initialData} />;
};

export default Page;
