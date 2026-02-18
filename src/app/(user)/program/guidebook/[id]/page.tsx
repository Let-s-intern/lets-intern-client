import { fetchGuidebookData } from '@/api/guidebook/guidebook';
import { getProgramPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const guidebook = await fetchGuidebookData(id);

  const pathname = getProgramPathname({
    id,
    programType: 'guidebook',
    title: guidebook.title,
  });

  redirect(pathname);
};

export default Page;
