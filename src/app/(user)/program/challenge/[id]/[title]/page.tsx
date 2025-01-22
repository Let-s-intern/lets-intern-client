import { fetchChallengeData } from '@/api/challenge';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import ChallengeCTAButtons from '@components/ChallengeCTAButtons';
import ChallengeView from '@components/ChallengeView';
import { redirect } from 'next/navigation';
const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id, title } = await params;

  const [challenge] = await Promise.all([fetchChallengeData(id)]);

  const isDeprecated = isDeprecatedProgram(challenge);

  if (isDeprecated) {
    redirect(`/program/old/challenge/${id}`);
  }

  return (
    <>
      <ChallengeView challenge={challenge} />

      <ChallengeCTAButtons challenge={challenge} challengeId={id} />
    </>
  );
};

export default Page;
