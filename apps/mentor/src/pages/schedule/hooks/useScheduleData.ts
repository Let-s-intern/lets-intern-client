import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import {
  filterBarsByFeedbackTags,
  type FeedbackTagType,
} from '../constants/feedbackTag';
import type { PeriodBarData } from '../types';
import {
  filterMentorSchedule,
  isMentorActionPeriodBar,
} from '../utils/filterMentorSchedule';

interface UseScheduleDataOptions {
  /** 캘린더/네비게이션에 추가로 포함할 mock 바 (예: 서면 피드백 mock) */
  extraBars?: PeriodBarData[];
}

/**
 * Manages challenge data, bar aggregation, and feedback-tag filtering for the schedule page.
 *
 * Key design: WeeklySummary uses `allBarsUnfiltered` (no filter applied),
 * while WeeklyCalendar uses `filteredBars` (respects selectedFeedbackTags).
 *
 * PRD-0503 #4: 챌린지 단위 필터 → 피드백 종류 단위 필터로 전환.
 *   selectedFeedbackTags 가 비어 있으면 "전체" 모드.
 */
export function useScheduleData({ extraBars = [] }: UseScheduleDataOptions = {}) {
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<
    ReadonlySet<FeedbackTagType>
  >(() => new Set());

  const { data: challengeListData } = useMentorChallengeListQuery();
  const allChallenges = challengeListData?.myChallengeMentorVoList ?? [];
  // Only show in-progress challenges in the schedule
  const challenges = useMemo(
    () => allChallenges.filter((c) => c.programStatusType === 'PROCEEDING'),
    [allChallenges],
  );

  // Bars collected from child data fetchers (keyed by "challengeId-missionId")
  const [barsMap, setBarsMap] = useState<Map<string, PeriodBarData>>(
    new Map(),
  );

  const handleData = useCallback((key: string, bar: PeriodBarData) => {
    setBarsMap((prev) => {
      const next = new Map(prev);
      next.set(key, bar);
      return next;
    });
  }, []);

  // All bars without any filter — used by WeeklySummary & height calculation
  const allBarsUnfiltered = useMemo(() => {
    const result: PeriodBarData[] = [...extraBars];
    barsMap.forEach((bar) => result.push(bar));
    return result;
  }, [barsMap, extraBars]);

  // Mentor whitelist filter — 캘린더에는 멘토가 직접 행동/인지해야 하는 3종 바만 노출
  // (PRD-0503 #2). allBarsUnfiltered는 모달 데이터 흐름용으로 그대로 유지.
  const mentorVisibleBars = useMemo(
    () => filterMentorSchedule(allBarsUnfiltered),
    [allBarsUnfiltered],
  );

  // Filtered bars — used by WeeklyCalendar (화이트리스트 ∩ 피드백 태그 선택)
  const filteredBars = useMemo(
    () => filterBarsByFeedbackTags(mentorVisibleBars, selectedFeedbackTags),
    [mentorVisibleBars, selectedFeedbackTags],
  );

  /** 단일 태그 토글 — 이미 선택돼 있으면 해제, 아니면 추가 (다중 선택 지원) */
  const toggleFeedbackTag = useCallback((tag: FeedbackTagType) => {
    setSelectedFeedbackTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  /** "전체" 클릭 — 모든 선택 해제 */
  const clearFeedbackTags = useCallback(() => {
    setSelectedFeedbackTags(new Set());
  }, []);

  /**
   * 태그 네비게이션의 "다음 일정" 계산 기준 — 멘토가 행동/인지해야 할 "기간" 단위 바만.
   *
   * 개별 라이브 세션(`live-feedback`)은 `live-feedback-period` 한 라운드 안의 세부
   * 표현이므로 네비게이션 단위로는 세지 않는다 — 그래야 "라이브 피드백" 태그에서
   * 일정 N개당 N번만 순환한다.
   */
  const sortedActionBarsByStart = useMemo(
    () =>
      [...mentorVisibleBars]
        .filter(isMentorActionPeriodBar)
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
    [mentorVisibleBars],
  );

  /**
   * 특정 태그(혹은 전체)의 바 중 오늘에서 가장 가까운(미래 우선) startDate 반환.
   * - 미래/현재 진행 중 일정이 있으면 그중 가장 빠른 startDate
   * - 모두 과거면 가장 최근 startDate
   */
  const findNearestDateForTag = useCallback(
    (tag: FeedbackTagType | null): Date | null => {
      const pool = tag
        ? sortedActionBarsByStart.filter(
            (bar) => barTypeToFeedbackTagSafe(bar.barType) === tag,
          )
        : sortedActionBarsByStart;
      if (pool.length === 0) return null;

      const nowMs = Date.now();
      const upcoming = pool.find(
        (bar) => new Date(bar.endDate).getTime() >= nowMs,
      );
      const target = upcoming ?? pool[pool.length - 1];
      return new Date(target.startDate);
    },
    [sortedActionBarsByStart],
  );

  /** 같은 태그 재클릭 시 — currentDate 다음 바의 startDate. 마지막이면 처음으로 순환. */
  const findNextDateForTag = useCallback(
    (tag: FeedbackTagType | null, currentDate: Date): Date | null => {
      const pool = tag
        ? sortedActionBarsByStart.filter(
            (bar) => barTypeToFeedbackTagSafe(bar.barType) === tag,
          )
        : sortedActionBarsByStart;
      if (pool.length === 0) return null;

      const baseMs = currentDate.getTime();
      const next = pool.find(
        (bar) => new Date(bar.startDate).getTime() > baseMs,
      );
      const target = next ?? pool[0];
      return new Date(target.startDate);
    },
    [sortedActionBarsByStart],
  );

  return {
    challenges,
    selectedFeedbackTags,
    toggleFeedbackTag,
    clearFeedbackTags,
    allBarsUnfiltered,
    filteredBars,
    handleData,
    findNearestDateForTag,
    findNextDateForTag,
  };
}

/** barType → FeedbackTagType 매핑. import 사이클 회피용 inline 함수. */
function barTypeToFeedbackTagSafe(
  barType: PeriodBarData['barType'],
): FeedbackTagType | null {
  switch (barType) {
    case 'written-mission-submit':
    case 'written-review':
    case 'written-feedback':
      return 'written';
    case 'live-feedback':
    case 'live-feedback-period':
      return 'live';
    case 'live-feedback-mentor-open':
    case 'live-feedback-mentee-open':
      return 'live-open';
    default:
      return null;
  }
}
