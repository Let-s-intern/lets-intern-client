import type { ChallengeVersionDraft } from '@/domain/admin/program/challenge/ChallengeVersionSection';
import { ChallengeVersion } from '@/schema';

/**
 * 챌린지 상세의 versionList 를 편집용 draft 로 바꾼다.
 * 저장 요청은 버전 값을 통째로 덮으므로 노출 필드를 하나라도 빠뜨리면 서버 값이 지워진다.
 *
 * 서버는 비어 있는 상세 본문을 챌린지 본문으로 채워 내려준다. 그 값을 그대로 다시 보내면
 * 챌린지 본문의 사본이 버전에 저장돼 이후 챌린지 본문 수정이 버전에 반영되지 않으므로,
 * 챌린지 본문과 같으면 "챌린지 본문 사용"(null) 으로 둔다.
 */
export const toVersionDrafts = (
  versionList: ChallengeVersion[],
  challengeDesc: string | null | undefined,
): ChallengeVersionDraft[] =>
  versionList.map((version) => ({
    challengeVersionId: version.challengeVersionId,
    title: version.title,
    programTitle: version.programTitle ?? '',
    shortDesc: version.shortDesc ?? null,
    thumbnail: version.thumbnail ?? '',
    desktopThumbnail: version.desktopThumbnail ?? null,
    description:
      version.description && version.description !== challengeDesc
        ? version.description
        : null,
  }));
