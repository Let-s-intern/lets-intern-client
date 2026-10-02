import { fetchChallengeData } from '@/api/challenge/challenge';
import ScrollToTop from '@/common/ScrollToTop';
import ChallengeCTAButtons from '@/domain/program/challenge/ChallengeCTAButtons';
import ChallengeHrView from '@/domain/program/challenge/ChallengeHrView';
import ChallengeMarketingView from '@/domain/program/challenge/ChallengeMarketingView';
import ChallengePmView from '@/domain/program/challenge/ChallengePmView';
import ChallengePortfolioView from '@/domain/program/challenge/ChallengePortfolioView';
import ChallengeView from '@/domain/program/challenge/ChallengeView';
import dayjs from '@/lib/dayjs';
import {
  applyChallengeVersion,
  DetailSearchParams,
  findChallengeVersion,
  resolveChallengeDetailRoute,
} from '@/domain/program/challenge/utils/challengeVersionRoute';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  getCanonicalSiteUrl,
  getChallengeTitle,
  getProgramPathname,
} from '@/utils/url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<DetailSearchParams>;
}): Promise<Metadata> {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const challenge = await fetchChallengeData(id);
  // 버전 페이지면 title·description·og:image·canonical 이 버전 값이다
  const version = findChallengeVersion(challenge.versionList, query.version);
  const program = applyChallengeVersion(challenge, version);
  const url =
    getCanonicalSiteUrl() +
    getProgramPathname({
      id,
      programType: 'challenge',
      title: program.title,
      challengeVersionId: version?.challengeVersionId,
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
  searchParams,
}: {
  params: Promise<{ id: string; title: string }>;
  searchParams: Promise<DetailSearchParams>;
}) => {
  const [{ id, title: _title }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const fetchedChallenge = await fetchChallengeData(id);

  const isDeprecated = isDeprecatedProgram(fetchedChallenge);

  if (isDeprecated) {
    redirect(`/program/old/challenge/${id}`);
  }

  // 버전 파라미터·슬러그 판정. 맞지 않으면 올바른 경로로 리다이렉트(쿼리 보존)
  const route = resolveChallengeDetailRoute({
    challengeId: id,
    challengeTitle: fetchedChallenge.title,
    versionList: fetchedChallenge.versionList,
    slug: _title || '',
    searchParams: query,
  });
  if (route.type === 'redirect') {
    redirect(route.url);
  }

  // 버전 값을 덮는 곳은 여기 한 곳이다. View 는 이 사본만 받는다
  const challenge = applyChallengeVersion(fetchedChallenge, route.version);

  return (
    <>
      <ScrollToTop />
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
      ) : challenge.challengeType === 'PM' ? (
        <ChallengePmView challenge={challenge} />
      ) : (
        <ChallengeView challenge={challenge} />
      )}
      <ChallengeCTAButtons
        challenge={challenge}
        challengeId={id}
        challengeVersionId={route.version?.challengeVersionId ?? null}
      />
    </>
  );
};

export default Page;
