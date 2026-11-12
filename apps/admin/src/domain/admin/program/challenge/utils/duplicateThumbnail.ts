import { ChallengeType, ChallengeVersion } from '@/schema';

import { autoProgramTitle } from '../ChallengeVersionSection';
import {
  extractGeneration,
  extractVersion,
  extractWeek,
  generateAndUploadThumbnail,
  resolveThumbnailImage,
  WEEK_TITLE_TEMPLATES,
} from './generateThumbnail';

export type ThumbnailBlockReason =
  | 'COPY_CONTENT'
  | 'LOADING'
  | 'UNSUPPORTED_TYPE'
  | 'NO_GENERATION'
  | 'NO_WEEK';

export const THUMBNAIL_BLOCK_REASON_TEXT: Record<ThumbnailBlockReason, string> =
  {
    COPY_CONTENT:
      '"이전 내용 그대로 가져오기"를 선택하면 기존 썸네일을 그대로 씁니다.',
    LOADING: '챌린지 정보를 불러오는 중입니다.',
    UNSUPPORTED_TYPE: '자동 생성을 지원하지 않는 챌린지 유형입니다.',
    NO_GENERATION: '제목에 기수(ex. 32기)가 없습니다.',
    NO_WEEK: '제목에 주차(ex. 2주)가 없습니다.',
  };

/**
 * 생성할 썸네일의 제목 목록.
 * 버전이 있으면 상세페이지에 버전 썸네일이 노출되므로 버전마다 '[버전명] 챌린지 제목' 으로 만든다.
 */
export const getThumbnailTitles = (
  title: string,
  versionTitles: string[],
): string[] =>
  versionTitles.length > 0
    ? versionTitles.map((versionTitle) => autoProgramTitle(versionTitle, title))
    : [title];

/** 썸네일 자동 생성이 막힌 이유. 생성할 수 있으면 null */
export const getThumbnailBlockReason = ({
  copyContent,
  challengeType,
  title,
  versionTitles,
}: {
  copyContent: boolean;
  challengeType: ChallengeType | null;
  title: string;
  versionTitles: string[];
}): ThumbnailBlockReason | null => {
  if (copyContent) return 'COPY_CONTENT';
  if (challengeType === null) return 'LOADING';
  // 이력서처럼 Ver 전용 이미지만 있는 유형이 있어 배너 문구까지 봐야 지원 여부가 정해진다
  const isSupported = getThumbnailTitles(title, versionTitles).every(
    (thumbnailTitle) =>
      resolveThumbnailImage(challengeType, extractVersion(thumbnailTitle)) !==
      null,
  );
  if (!isSupported) return 'UNSUPPORTED_TYPE';
  if (extractGeneration(title) === null) return 'NO_GENERATION';
  if (challengeType in WEEK_TITLE_TEMPLATES && extractWeek(title) === null)
    return 'NO_WEEK';
  return null;
};

/**
 * 대표 썸네일과 버전 썸네일을 한 번에 병렬로 만든다.
 * 버전이 있으면 상세페이지에는 버전 썸네일이 노출된다. 대표 썸네일은 목록용으로 지금처럼 만든다
 */
export const generateDuplicateThumbnails = async (
  challengeType: ChallengeType,
  title: string,
  versions: Pick<ChallengeVersion, 'challengeVersionId' | 'title'>[],
) => {
  const versionTitles =
    versions.length > 0
      ? getThumbnailTitles(
          title,
          versions.map((version) => version.title),
        )
      : [];
  const [thumbnail, ...versionUrls] = await Promise.all(
    [title, ...versionTitles].map((thumbnailTitle) =>
      generateAndUploadThumbnail(challengeType, thumbnailTitle),
    ),
  );
  return {
    thumbnail,
    versionThumbnails:
      versions.length > 0
        ? versions.map((version, index) => ({
            sourceChallengeVersionId: version.challengeVersionId,
            thumbnail: versionUrls[index],
            desktopThumbnail: versionUrls[index],
          }))
        : null,
  };
};
