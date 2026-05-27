import { useMemo } from 'react';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import type { Mentee } from '../schema';

/**
 * 멘티 목록 행 안정 키.
 * 같은 멘티가 여러 챌린지에 참여하면 챌린지별로 별도 행이 되도록
 * `이름|프로그램` 쌍을 키로 사용한다.
 */
function menteeRowId(menteeName: string, programTitle: string): string {
  return `${menteeName}|${programTitle}`;
}

/**
 * `GET /feedback/mentor`(라이브 피드백) 응답에서 멘티 목록을 파생한다.
 *
 * - `menteeName`+`programTitle` 쌍으로 distinct (같은 멘티·다른 챌린지면 각각 행).
 * - 정렬: 챌린지명 → 이름 가나다순.
 * - email·채팅 필드는 BE에 없어 포함하지 않는다.
 */
export function deriveMentees(feedbacks: FeedbackMentor[]): Mentee[] {
  const byKey = new Map<string, Mentee>();

  for (const fb of feedbacks) {
    const id = menteeRowId(fb.menteeName, fb.programTitle);
    if (byKey.has(id)) continue;
    byKey.set(id, {
      id,
      name: fb.menteeName,
      challengeTitle: fb.programTitle,
      avatarInitial: fb.menteeName.slice(0, 1),
    });
  }

  return Array.from(byKey.values()).sort((a, b) => {
    const byChallenge = a.challengeTitle.localeCompare(b.challengeTitle, 'ko');
    return byChallenge !== 0 ? byChallenge : a.name.localeCompare(b.name, 'ko');
  });
}

export interface UseMenteeRosterResult {
  mentees: Mentee[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 멘티 관리 좌측 목록용 멘티 로스터.
 * 예약 현황과 동일한 query key(`['feedback','mentor','list', ...]`)를 공유하므로
 * 추가 fetch 없이 캐시를 재사용한다.
 */
export function useMenteeRoster(): UseMenteeRosterResult {
  const { data, isLoading, isError } = useFeedbackMentorListQuery();

  const mentees = useMemo(() => deriveMentees(data ?? []), [data]);

  return { mentees, isLoading, isError };
}
