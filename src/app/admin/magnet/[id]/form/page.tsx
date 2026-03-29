import MagnetFormPage from '@/domain/admin/magnet/MagnetFormPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <MagnetFormPage magnetId={id} />;
};

export default Page;
