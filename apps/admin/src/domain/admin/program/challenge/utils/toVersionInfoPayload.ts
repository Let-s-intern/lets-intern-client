import type { ChallengeVersionDraft } from '@/domain/admin/program/challenge/ChallengeVersionSection';
import { ChallengeVersionReq } from '@/schema';

/** 빈 선택 입력은 null 로 보내 서버가 챌린지 값으로 대신하게 한다 */
const toOptional = (value: string | null) => value?.trim() || null;

/** 편집 중인 버전 목록을 챌린지 생성·수정 요청의 versionInfo 로 바꾼다. 순서는 배열 순서 */
export const toVersionInfoPayload = (
  drafts: ChallengeVersionDraft[],
): ChallengeVersionReq[] =>
  drafts.map((draft, index) => ({
    challengeVersionId: draft.challengeVersionId,
    title: draft.title.trim(),
    sortOrder: index,
    programTitle: draft.programTitle.trim(),
    shortDesc: toOptional(draft.shortDesc),
    thumbnail: draft.thumbnail,
    desktopThumbnail: toOptional(draft.desktopThumbnail),
    description: draft.description,
  }));

/** 저장을 막아야 하는 버전 입력 문제를 문구로 돌려준다. 문제가 없으면 null */
export const getVersionInfoError = (
  drafts: ChallengeVersionDraft[],
): string | null => {
  const titles = drafts.map(({ title }) => title.trim());

  if (titles.includes('')) return '버전 제목을 입력해주세요.';
  if (new Set(titles).size !== titles.length) {
    return '같은 이름의 버전이 이미 있습니다.';
  }

  // 카드가 접혀 있으면 빈 칸이 안 보이므로 몇 번 버전인지 알려준다
  for (const [index, draft] of drafts.entries()) {
    if (draft.programTitle.trim() === '') {
      return `${index + 1}번 버전의 노출 제목을 입력해주세요.`;
    }
    if (draft.thumbnail === '') {
      return `${index + 1}번 버전의 모바일 썸네일을 등록해주세요.`;
    }
  }
  return null;
};
