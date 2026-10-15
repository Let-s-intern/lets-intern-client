import { fetchChallengeData } from '@/api/challenge/challenge';
import {
  DetailSearchParams,
  resolveChallengeDetailRoute,
} from '@/domain/program/challenge/utils/challengeVersionRoute';
import { redirect } from 'next/navigation';

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<DetailSearchParams>;
}) => {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  const challenge = await fetchChallengeData(id);

  // slug 없이 들어왔으므로 항상 리다이렉트한다. 버전이 있으면 첫 버전으로 간다
  const route = resolveChallengeDetailRoute({
    challengeId: id,
    challengeTitle: challenge.title,
    versionList: challenge.versionList,
    searchParams: query,
  });

  if (route.type === 'redirect') redirect(route.url);
};

export default Page;
