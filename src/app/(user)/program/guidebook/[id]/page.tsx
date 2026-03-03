import { fetchPublicGuidebookData } from '@/api/program';
import { mapPublicGuidebook } from '@/domain/program/guidebook/utils/publicGuidebookMapping';
import { getProgramPathname } from '@/utils/url';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const apiData = await fetchPublicGuidebookData(id);
  const guidebook = mapPublicGuidebook(apiData);

  const pathname = getProgramPathname({
    id,
    programType: 'guidebook',
    title: guidebook.title,
  });

  redirect(pathname);
};

export default Page;
