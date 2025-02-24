import { z } from 'zod';
import ProgramDetailLegacyPage from '../../ProgramDetailLegacyPage';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  return <ProgramDetailLegacyPage programId={id} programType="live" />;
};

export default Page;
