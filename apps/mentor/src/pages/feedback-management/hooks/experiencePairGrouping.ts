import type { MentorMissionType } from '@/api/challenge/challengeSchema';

import type { FeedbackRow } from '../types';

/**
 * 경험정리(EXPERIENCE_1/EXPERIENCE_2) 미션 그룹핑 유틸.
 *
 * 관리자가 같은 회차(`th`)에 경험정리 미션을 `missionType = EXPERIENCE_1`/`EXPERIENCE_2`
 * 두 개의 별도 `missionId`로 등록해, 멘토 피드백 표에서 멘티가 두 행으로 중복 표시된다
 * (PRD §1). 같은 `challengeId`+`th`의 EXPERIENCE_1/EXPERIENCE_2 쌍을 찾아 두는 게 첫 단계다.
 */

/** 페어 판별에 필요한 미션 최소 정보 — 챌린지 컨텍스트(challengeId)를 함께 받는다. */
export interface ExperienceMissionInput {
  challengeId: number;
  th: number;
  missionId: number;
  missionType?: MentorMissionType | null;
}

/** 같은 회차의 경험정리 페어 — 각 타입의 `missionId`. */
export interface ExperiencePair {
  exp1MissionId: number;
  exp2MissionId: number;
}

/** 페어 키: `${challengeId}-${th}` */
export type ExperiencePairKey = string;

/**
 * 같은 `challengeId`+`th` 안에서 EXPERIENCE_1/EXPERIENCE_2 미션을 짝짓는다.
 * 한쪽만 있는 경우(짝이 안 맞음)는 페어에 넣지 않아 원래대로 표시되게 한다.
 * 경험정리 아닌 미션(OT/POOL/BONUS/null 등)은 조기 skip 한다.
 */
export function findExperienceMissionPairs(
  missions: ExperienceMissionInput[],
): Map<ExperiencePairKey, ExperiencePair> {
  const byKey = new Map<
    ExperiencePairKey,
    { exp1MissionId?: number; exp2MissionId?: number }
  >();

  for (const mission of missions) {
    if (
      mission.missionType !== 'EXPERIENCE_1' &&
      mission.missionType !== 'EXPERIENCE_2'
    ) {
      continue;
    }
    const key = `${mission.challengeId}-${mission.th}`;
    const entry = byKey.get(key) ?? {};
    if (mission.missionType === 'EXPERIENCE_1') {
      entry.exp1MissionId = mission.missionId;
    } else {
      entry.exp2MissionId = mission.missionId;
    }
    byKey.set(key, entry);
  }

  const pairs = new Map<ExperiencePairKey, ExperiencePair>();
  for (const [key, entry] of byKey) {
    if (
      entry.exp1MissionId !== undefined &&
      entry.exp2MissionId !== undefined
    ) {
      pairs.set(key, {
        exp1MissionId: entry.exp1MissionId,
        exp2MissionId: entry.exp2MissionId,
      });
    }
  }
  return pairs;
}

/**
 * 경험정리 페어에 속한 멘티별 서면 행을 PRD §5-③④ 규칙대로 걸러낸다.
 * 새 행을 만들지 않고 "제거할 행"만 필터링한다(PRD §5-⑥). 페어에 속하지 않는 행
 * (경험정리 아닌 미션·라이브 행)은 그대로 통과시킨다.
 *
 * 같은 멘티(이름)의 EXPERIENCE_1/EXPERIENCE_2 행을 묶어:
 * - 한쪽만 제출 → 제출한 쪽 행만 남긴다.
 * - 둘 다 제출 → 두 행 모두 남긴다(병합 안 함).
 * - 둘 다 미제출 → 대표(th 더 작은 EXPERIENCE_1, 없으면 EXPERIENCE_2) 1행만 남긴다.
 */
export function filterExperiencePairRows(
  rows: FeedbackRow[],
  pairs: Map<ExperiencePairKey, ExperiencePair>,
): FeedbackRow[] {
  if (pairs.size === 0) return rows;

  const missionToPair = new Map<
    number,
    { key: ExperiencePairKey; side: 'exp1' | 'exp2' }
  >();
  for (const [key, pair] of pairs) {
    missionToPair.set(pair.exp1MissionId, { key, side: 'exp1' });
    missionToPair.set(pair.exp2MissionId, { key, side: 'exp2' });
  }

  // 페어에 속하지 않는 행은 그대로 통과. 속한 행은 (pairKey, 멘티명)으로 묶는다.
  const passthrough: FeedbackRow[] = [];
  const groups = new Map<string, { exp1?: FeedbackRow; exp2?: FeedbackRow }>();

  for (const row of rows) {
    const info =
      row.source.type === 'written'
        ? missionToPair.get(row.source.missionId)
        : undefined;
    if (!info) {
      passthrough.push(row);
      continue;
    }
    const groupKey = `${info.key}::${row.menteeNameLabel}`;
    const group = groups.get(groupKey) ?? {};
    group[info.side] = row;
    groups.set(groupKey, group);
  }

  const kept: FeedbackRow[] = [];
  for (const group of groups.values()) {
    const exp1Submitted = group.exp1?.submissionLabel === '제출';
    const exp2Submitted = group.exp2?.submissionLabel === '제출';

    if (exp1Submitted && exp2Submitted) {
      if (group.exp1) kept.push(group.exp1);
      if (group.exp2) kept.push(group.exp2);
    } else if (exp1Submitted) {
      if (group.exp1) kept.push(group.exp1);
    } else if (exp2Submitted) {
      if (group.exp2) kept.push(group.exp2);
    } else {
      // 둘 다 미제출 → 대표 1행(EXPERIENCE_1 우선, 없으면 EXPERIENCE_2).
      if (group.exp1) kept.push(group.exp1);
      else if (group.exp2) kept.push(group.exp2);
    }
  }

  return [...passthrough, ...kept];
}
