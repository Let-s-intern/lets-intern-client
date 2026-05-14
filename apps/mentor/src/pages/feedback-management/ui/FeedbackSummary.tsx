'use client';

import { useMemo } from 'react';

import ChallengeDataFetcher from '@/pages/schedule/ui/ChallengeDataFetcher';
import WeeklySummary from '@/pages/schedule/ui/WeeklySummary';
import { useLiveFeedbackData } from '@/pages/schedule/hooks/useLiveFeedbackData';
import { useScheduleData } from '@/pages/schedule/hooks/useScheduleData';
import { useWeeklySummary } from '@/pages/schedule/hooks/useWeeklySummary';
import { useWrittenFeedbackMockData } from '@/pages/schedule/hooks/useWrittenFeedbackMockData';

/**
 * 피드백 페이지 상단의 통계 위젯 (전체 / 오늘 마감 / 미완료 / 진행상황).
 *
 * SchedulePage 에 있던 위젯을 그대로 이전한 것이며,
 * 동일한 ChallengeDataFetcher + useScheduleData 흐름으로 집계 데이터를 만든다.
 * react-query 가 같은 query key 를 dedupe 하므로 일정 페이지와의 중복 호출은 발생하지 않는다.
 */
const FeedbackSummary = () => {
  const { bars: writtenMockBars } = useWrittenFeedbackMockData();
  const liveFeedbackBars = useLiveFeedbackData();

  const extraBars = useMemo(
    () => [...writtenMockBars, ...liveFeedbackBars],
    [writtenMockBars, liveFeedbackBars],
  );

  const { challenges, allBarsUnfiltered, handleData } = useScheduleData({
    extraBars,
  });

  const { totalCount, todayDueCount, incompleteCount, completedCount } =
    useWeeklySummary(allBarsUnfiltered);

  return (
    <>
      <WeeklySummary
        totalCount={totalCount}
        todayDueCount={todayDueCount}
        incompleteCount={incompleteCount}
        completedCount={completedCount}
      />

      {/* 자식 fetcher: 챌린지별 미션 출석 데이터를 모아 handleData 로 전달 */}
      {challenges.map((c) => (
        <ChallengeDataFetcher
          key={c.challengeId}
          challenge={c}
          onData={handleData}
        />
      ))}
    </>
  );
};

export default FeedbackSummary;
