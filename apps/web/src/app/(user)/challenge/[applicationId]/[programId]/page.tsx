'use client';

import { useChallengeHome } from '@/api/challenge/challenge';
import { useUserQuery } from '@/api/user/user';
import CouponBanner from '@/common/banner/CouponBanner';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import DailyMissionSection from '@/domain/challenge/dashboard/section/DailyMissionSection';
import MissionNotOpenSection from '@/domain/challenge/dashboard/section/MissionNotOpenSection';
import GuideSection from '@/domain/challenge/dashboard/section/GuideSection';
import NoticeSection from '@/domain/challenge/dashboard/section/NoticeSection';
import ScoreSection from '@/domain/challenge/dashboard/section/ScoreSection';
import useCouponRewardPopup from '@/domain/challenge/hooks/useCouponRewardPopup';
import { findNextUpcomingSchedule } from '@/domain/challenge/utils/missionTimeState';
import MissionEndSection from '@/domain/challenge/MissionEndSection';
import MissionCalendar from '@/domain/challenge/my-challenge/mission/calendar/MissionCalendar';
import CouponRewardPopup from '@/domain/challenge/ui/CouponRewardPopup';
import MissionTooltipQuestion from '@/domain/challenge/ui/MissionTooltipQuestion';
import ProgramRecommendSnackbar from '@/domain/challenge/ui/ProgramRecommendSnackbar';
import { useExperienceLevel } from '@/hooks/useExperienceLevel';
import { useFilteredSchedules } from '@/hooks/useFilteredSchedules';
import { useMissionCalculation } from '@/hooks/useMissionCalculation';
import dayjs from '@/lib/dayjs';
import { challengeScore } from '@/schema';
import axios from '@/utils/axios';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

function MissionDetailSection() {
  const params = useParams<{ programId: string }>();
  const { schedules, dailyMission, isLoading } = useCurrentChallenge();

  // 경험정리 레벨 판별
  const experienceLevel = useExperienceLevel(schedules);

  // 레벨에 맞게 필터링된 schedules
  const filteredSchedules = useFilteredSchedules(schedules, experienceLevel);

  const { data: programData } = useSuspenseQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  if (isLoading) return null;

  const programEndDate = programData?.data?.endDate;
  const isChallengeDone = getIsChallengeDone(programEndDate);

  // 완주 축하는 챌린지가 실제로 끝났을 때만 띄운다.
  //
  // 예전에는 `!dailyMission` 도 같은 조건에 묶여 있었다. 그 값이 null 이라는 것은
  // "다 끝났다" 가 아니라 "지금은 진행 중인 미션이 없다" 는 뜻이다. 미션이 매일 08:00 에
  // 열리는 편성이면 매일 자정~오전 8시가 그 상태인데, 2회차를 하고 있는 사람에게
  // 완주 축하가 나가고 "미션 수행하기" 버튼까지 사라졌다(LC-3207).
  //
  // `isLastMissionSubmitted` 도 뺐다. 그 값은 마지막 회차에 출석 행이 있기만 하면 참이라
  // (서버 `submitted = attendance != null`), 어드민이 만든 결석 행 하나로도 완주가 된다.
  if (isChallengeDone) {
    return <MissionEndSection />;
  }

  if (dailyMission) {
    return (
      <DailyMissionSection
        dailyMission={dailyMission}
        schedules={filteredSchedules}
      />
    );
  }

  // 아직 열리지 않은 회차가 남아 있으면 언제 열리는지 알려 준다.
  const nextSchedule = findNextUpcomingSchedule(filteredSchedules, dayjs());
  if (nextSchedule) {
    return <MissionNotOpenSection nextSchedule={nextSchedule} />;
  }

  // 남은 회차가 없다 — 챌린지 종료일 전에 모든 미션이 마감된 경우다.
  return <MissionEndSection />;
}

function getIsChallengeDone(endDate: string) {
  return dayjs(new Date()).isAfter(dayjs(endDate));
}

function getIsChallengeSubmitDone(endDate: string) {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
}

function ChallengeDashboardContent() {
  const { currentChallenge, schedules } = useCurrentChallenge();
  const { todayTh } = useMissionCalculation();

  // 경험정리 레벨 판별
  const experienceLevel = useExperienceLevel(schedules);

  // 레벨에 맞게 필터링된 schedules
  const filteredSchedules = useFilteredSchedules(schedules, experienceLevel);

  const couponPopup = useCouponRewardPopup({
    challengeType: currentChallenge?.challengeType,
    challengeEndDate: currentChallenge?.endDate,
    schedules: filteredSchedules,
  });

  const params = useParams<{ programId: string; applicationId: string }>();

  const searchParams = useSearchParams();
  const testDate = searchParams.get('testDate') ?? undefined;

  const { data: homeData } = useChallengeHome(currentChallenge?.id, {
    testDate,
  });

  const notices = (homeData?.noticeList ?? [])
    .filter((item) => item.type === 'NOTICE')
    .map((item) => ({
      id: item.id,
      type: null as null,
      title: item.title,
      link: item.url,
      createDate: dayjs(item.createdAt),
    }));

  const guides = (homeData?.noticeList ?? [])
    .filter((item) => item.type === 'GUIDE')
    .map((item) => ({
      id: item.id,
      title: item.title,
      link: item.url,
      createDate: dayjs(item.createdAt),
    }));

  const { data: user } = useUserQuery();

  const { data: scoreGroup } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'score'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/score`);
      return challengeScore.parse(res.data.data);
    },
    throwOnError: true,
  });

  const { data: programData } = useSuspenseQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programEndDate = programData?.data?.endDate;

  const totalScore = scoreGroup?.totalScore || 0;
  const currentScore = scoreGroup?.currentScore || 0;

  const isChallengeSubmitDone = getIsChallengeSubmitDone(programEndDate);

  return (
    <main className="px-5 py-8 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-[22px] font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          {/* 챌린지 미션 상세 */}
          <MissionDetailSection />

          {/* 공지사항, 미션점수 */}
          <div className="flex flex-col gap-2.5 md:w-[22rem]">
            <NoticeSection notices={notices} />
            <div className="flex gap-2.5">
              <ScoreSection
                programName={currentChallenge?.title || ''}
                isProgramDone={dayjs(new Date()).isAfter(
                  currentChallenge?.endDate,
                )}
                desc={currentChallenge?.shortDesc || ''}
                startDate={
                  currentChallenge?.startDate?.format('YYYY.MM.DD') || ''
                }
                endDate={currentChallenge?.endDate?.format('YYYY.MM.DD') || ''}
                userName={user?.name || ''}
                totalScore={totalScore}
                currentScore={currentScore}
              />
              <GuideSection guides={guides} />
            </div>
          </div>
        </div>

        {/* 일정 및 제출 현황 */}
        <div className="flex gap-4">
          <section className="rounded-xs border-neutral-80 w-full flex-1 border p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-1-bold text-neutral-30">
                일정 및 미션 제출 현황
              </h2>
              <MissionTooltipQuestion />
            </div>
            {filteredSchedules.length > 0 && (
              // myChallenge 에 있는 미션캘린더 가져옴
              <MissionCalendar
                className="mt-3 gap-2"
                schedules={filteredSchedules}
                todayTh={todayTh}
                isDone={isChallengeSubmitDone}
              />
            )}
          </section>
        </div>

        {getIsChallengeDone(programEndDate) && <ProgramRecommendSnackbar />}

        <div className="md:hidden">
          <CouponBanner />
        </div>
      </div>

      <CouponRewardPopup
        isOpen={couponPopup.isOpen}
        onClose={couponPopup.close}
        challengeName={currentChallenge?.title ?? ''}
        amount={couponPopup.amount}
        endDate={couponPopup.endDate}
      />
    </main>
  );
}

export default function ChallengeDashboard() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <ChallengeDashboardContent />
    </AsyncBoundary>
  );
}
