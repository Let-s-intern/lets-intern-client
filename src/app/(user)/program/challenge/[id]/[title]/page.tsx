import { fetchChallengeData } from '@/api/challenge/challenge';
import ChallengeCTAButtons from '@/domain/program/challenge/ChallengeCTAButtons';
import ChallengeHrView from '@/domain/program/challenge/ChallengeHrView';
import ChallengeMarketingView from '@/domain/program/challenge/ChallengeMarketingView';
import ChallengePortfolioView from '@/domain/program/challenge/ChallengePortfolioView';
import ChallengeView from '@/domain/program/challenge/ChallengeView';
import dayjs from '@/lib/dayjs';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  getBaseUrlFromServer,
  getChallengeTitle,
  getProgramPathname,
} from '@/utils/url';
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

const MARKETING_ID_THRESHOLD = process.env.NODE_ENV === 'development' ? 11 : 75;

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) => {
  const { id, title: _title } = await params;

  const [challenge] = await Promise.all([fetchChallengeData(id)]);

  const isDeprecated = isDeprecatedProgram(challenge);

  if (isDeprecated) {
    redirect(`/program/old/challenge/${id}`);
  }

  // 올바른 경로 생성
  const correctPathname = getProgramPathname({
    id,
    programType: 'challenge',
    title: challenge.title,
  });

  // 슬러그 비교 및 리디렉션
  const correctSlug = (
    challenge.title?.replace(/[ /]/g, '-') || ''
  ).toLowerCase();
  let currentSlug = _title || '';
  try {
    currentSlug = decodeURIComponent(currentSlug);
  } catch {}
  currentSlug = currentSlug.toLowerCase();
  if (currentSlug !== correctSlug) {
    redirect(correctPathname);
  }

  return (
    <>
      {parseInt(id) > MARKETING_ID_THRESHOLD &&
      challenge.challengeType === 'MARKETING' ? (
        <ChallengeMarketingView challenge={challenge} />
      ) : challenge.challengeType === 'PORTFOLIO' &&
        challenge.startDate &&
        // 포폴 상페 개선 https://letscareer-team.atlassian.net/browse/LC-2737
        dayjs(challenge.startDate).isAfter(dayjs('2025-12-02')) ? (
        <ChallengePortfolioView challenge={challenge} />
      ) : challenge.challengeType === 'HR' ? (
        <ChallengeHrView challenge={challenge} />
      ) : (
        <ChallengeView challenge={challenge} />
      )}
      <ChallengeCTAButtons challenge={challenge} challengeId={id} />
    </>
  );
};

export default Page;
