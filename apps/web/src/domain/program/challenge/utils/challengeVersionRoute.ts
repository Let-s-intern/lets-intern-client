import { ChallengeIdPrimitive } from '@/schema';
import { getProgramPathname } from '@/utils/url';

type ChallengeVersion = ChallengeIdPrimitive['versionList'][number];

export type DetailSearchParams = Record<string, string | string[] | undefined>;

export type ChallengeDetailRoute =
  | { type: 'render'; version: ChallengeVersion | null }
  | { type: 'redirect'; url: string };

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toSlug = (title?: string | null) =>
  (title?.replace(/[ /]/g, '-') || '').toLowerCase();

const decodeSlug = (slug: string) => {
  try {
    return decodeURIComponent(slug).toLowerCase();
  } catch {
    return slug.toLowerCase();
  }
};

/** version 파라미터와 같은 id 의 버전. 없거나 이 챌린지 소속이 아니면 null */
export const findChallengeVersion = (
  versionList: ChallengeVersion[],
  versionParam: string | string[] | undefined,
): ChallengeVersion | null => {
  const raw = firstParam(versionParam);
  if (raw === undefined) return null;
  return (
    versionList.find((version) => String(version.challengeVersionId) === raw) ??
    null
  );
};

/** utm 등 version 외의 쿼리를 그대로 이어 붙인다 */
const withRestQuery = (pathname: string, searchParams: DetailSearchParams) => {
  const rest = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === 'version' || value === undefined) return;
    (Array.isArray(value) ? value : [value]).forEach((v) =>
      rest.append(key, v),
    );
  });
  const query = rest.toString();
  if (!query) return pathname;
  return `${pathname}${pathname.includes('?') ? '&' : '?'}${query}`;
};

/**
 * 챌린지 상세 URL 판정 (PRD V10, E1~E3).
 * slug 가 undefined 면 slug 없는 경로(`/program/challenge/{id}`)로 들어온 것이라 항상 리다이렉트한다
 */
export const resolveChallengeDetailRoute = ({
  challengeId,
  challengeTitle,
  versionList,
  slug,
  searchParams,
}: {
  challengeId: string;
  challengeTitle?: string | null;
  versionList: ChallengeVersion[];
  slug?: string;
  searchParams: DetailSearchParams;
}): ChallengeDetailRoute => {
  const versionParam = firstParam(searchParams.version);
  const hasVersions = versionList.length > 0;

  // E1·E2: 버전이 있는데 파라미터가 없거나 다른 챌린지의 버전이면 sortOrder 첫 버전
  const version = hasVersions
    ? (findChallengeVersion(versionList, versionParam) ??
      [...versionList].sort((a, b) => a.sortOrder - b.sortOrder)[0])
    : null;

  const correctTitle = version
    ? (version.programTitle ?? challengeTitle)
    : challengeTitle;
  const correctUrl = withRestQuery(
    getProgramPathname({
      id: challengeId,
      programType: 'challenge',
      title: correctTitle,
      challengeVersionId: version?.challengeVersionId,
    }),
    searchParams,
  );

  const isVersionParamCorrect = version
    ? versionParam === String(version.challengeVersionId)
    : versionParam === undefined; // E3: 버전 없는 챌린지에 붙은 파라미터는 뗀다
  const isSlugCorrect =
    slug !== undefined && decodeSlug(slug) === toSlug(correctTitle);

  if (!isVersionParamCorrect || !isSlugCorrect) {
    return { type: 'redirect', url: correctUrl };
  }
  return { type: 'render', version };
};

/** 상세 화면에 보일 제목·한 줄 설명·썸네일·본문만 버전 값으로 덮은 사본. 나머지는 챌린지 값이다 */
export const applyChallengeVersion = (
  challenge: ChallengeIdPrimitive,
  version: ChallengeVersion | null,
): ChallengeIdPrimitive => {
  if (!version) return challenge;
  return {
    ...challenge,
    title: version.programTitle ?? challenge.title,
    shortDesc: version.shortDesc ?? challenge.shortDesc,
    thumbnail: version.thumbnail ?? challenge.thumbnail,
    desktopThumbnail: version.desktopThumbnail ?? challenge.desktopThumbnail,
    desc: version.description ?? challenge.desc,
  };
};
