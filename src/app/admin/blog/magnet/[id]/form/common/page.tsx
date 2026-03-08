import CommonFormPage from '@/domain/admin/blog/magnet/CommonFormPage';
import { fetchCommonForm } from '@/domain/admin/blog/magnet/mock';

const Page = async () => {
  const initialData = await fetchCommonForm();

  return <CommonFormPage initialData={initialData} />;
};

export default Page;
