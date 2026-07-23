import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { z } from 'zod';
import ProgramDetailLegacyPage from '../../ProgramDetailLegacyPage';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <ProgramDetailLegacyPage programId={id} programType="live" />
    </AsyncBoundary>
  );
};

export default Page;
