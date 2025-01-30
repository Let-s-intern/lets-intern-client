import { fetchLiveData } from '@/api/program';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import LiveCTAButtons from '@components/LiveCTAButtons';
import LiveView from '@components/LiveView';
import { redirect } from 'next/navigation';
const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id, title } = await params;

  const [live] = await Promise.all([fetchLiveData(id)]);

  const isDeprecated = isDeprecatedProgram(live);

  if (isDeprecated) {
    redirect(`/program/old/live/${id}`);
  }

  return (
    <>
      <LiveView live={live} />

      <LiveCTAButtons live={live} liveId={id} />
    </>
  );
};

export default Page;
