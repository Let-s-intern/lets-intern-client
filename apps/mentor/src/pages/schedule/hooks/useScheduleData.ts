import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import {
  filterBarsByFeedbackTags,
  type FeedbackTagType,
} from '../constants/feedbackTag';
import type { PeriodBarData } from '../types';
import { filterMentorSchedule } from '../utils/filterMentorSchedule';

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

  return {
    challenges,
    selectedFeedbackTags,
    toggleFeedbackTag,
    clearFeedbackTags,
    allBarsUnfiltered,
    filteredBars,
    handleData,
  };
}
