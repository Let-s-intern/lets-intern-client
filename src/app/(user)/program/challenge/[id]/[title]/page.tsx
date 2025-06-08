import { fetchChallengeData } from '@/api/challenge';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  getBaseUrlFromServer,
  getChallengeTitle,
  getProgramPathname,
} from '@/utils/url';
import ChallengeCTAButtons from '@components/ChallengeCTAButtons';
import ChallengeMarketingView from '@components/ChallengeMarketingView';
import ChallengeView from '@components/ChallengeView';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = await fetchChallengeData(id);
  const url =
    getBaseUrlFromServer() +
    getProgramPathname({
      id,
      programType: 'challenge',
      title: program.title,
    });
  const title = getChallengeTitle(program);

  return {
    title,
    description: program.shortDesc,
    openGraph: {
      title,
      description: program.shortDesc || undefined,
      url,
      images: [
        {
          url: program.thumbnail ?? '',
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id } = await params;

  const [challenge] = await Promise.all([fetchChallengeData(id)]);

  const isDeprecated = isDeprecatedProgram(challenge);

  if (isDeprecated) {
    redirect(`/program/old/challenge/${id}`);
  }

  return (
    <>
      {parseInt(id) > 75 && challenge.challengeType === 'MARKETING' ? (
        <ChallengeMarketingView challenge={challenge} />
      ) : (
        <ChallengeView challenge={challenge} />
      )}
      <ChallengeCTAButtons challenge={challenge} challengeId={id} />
    </>
  );
};

export default Page;
