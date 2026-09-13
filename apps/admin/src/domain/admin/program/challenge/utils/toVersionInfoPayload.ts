import type { ChallengeVersionDraft } from '@/domain/admin/program/challenge/ChallengeVersionSection';
import { ChallengeVersionReq } from '@/schema';

/** 편집 중인 버전 목록을 챌린지 생성·수정 요청의 versionInfo 로 바꾼다. 순서는 배열 순서 */
export const toVersionInfoPayload = (
  drafts: ChallengeVersionDraft[],
): ChallengeVersionReq[] =>
  drafts.map(({ challengeVersionId, title }, index) => ({
    challengeVersionId,
    title: title.trim(),
    sortOrder: index,
  }));

/** 저장을 막아야 하는 버전 제목 문제를 문구로 돌려준다. 문제가 없으면 null */
export const getVersionTitleError = (
  drafts: ChallengeVersionDraft[],
): string | null => {
  const titles = drafts.map(({ title }) => title.trim());

  if (titles.includes('')) return '버전 제목을 입력해주세요.';
  if (new Set(titles).size !== titles.length) {
    return '같은 이름의 버전이 이미 있습니다.';
  }
  return null;
};
