import { extractChallengeVersionLabel } from '@/domain/program/challenge/challenge-view/ChallengeVersionTag';
import { ActiveChallengeType } from '@/schema';
import { getProgramPathname } from '@/utils/url';

/** 같은 챌린지의 버전 항목이 여러 개라 챌린지 id 와 버전 id 를 함께 비교한다 */
export const isActiveChallengeSelected = (
  activeChallenge: ActiveChallengeType,
  challengeId: number,
  challengeVersionId: number | null,
) =>
  activeChallenge.id === challengeId &&
  (activeChallenge.challengeVersionId ?? null) === challengeVersionId;

/** 버전명이 있으면 그 값, 없으면 제목 맨 앞 대괄호(버전 데이터가 없는 챌린지용 fallback) */
export const getActiveChallengeTag = (activeChallenge: ActiveChallengeType) =>
  activeChallenge.versionTitle ||
  extractChallengeVersionLabel(activeChallenge.title);

/**
 * 시작일 순. 같은 날이면 서버 순서(챌린지 id → 버전 sortOrder)를 유지한다.
 * 응답에 sortOrder 가 없어 안정 정렬로 서버 순서를 지킨다
 */
export const sortActiveChallenges = (list: ActiveChallengeType[]) =>
  [...list].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

export const getActiveChallengePathname = (
  activeChallenge: ActiveChallengeType,
) =>
  getProgramPathname({
    programType: 'challenge',
    id: activeChallenge.id,
    title: activeChallenge.programTitle ?? activeChallenge.title,
    challengeVersionId: activeChallenge.challengeVersionId,
  });
