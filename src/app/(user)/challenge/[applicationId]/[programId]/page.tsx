'use client';

import { useUserQuery } from '@/api/user';
import DailyMissionSection from '@/components/common/challenge/dashboard/section/DailyMissionSection';
import GuideSection from '@/components/common/challenge/dashboard/section/GuideSection';
import NoticeSection from '@/components/common/challenge/dashboard/section/NoticeSection';
import ScoreSection from '@/components/common/challenge/dashboard/section/ScoreSection';
import MissionCalendar from '@/components/common/challenge/my-challenge/mission-calendar/MissionCalendar';
import MissionTooltipQuestion from '@/components/common/challenge/ui/tooltip-question/MissionTooltipQuestion';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { challengeGuides, challengeNotices, challengeScore } from '@/schema';
import axios from '@/utils/axios';
import MissionEndSection from '@components/common/challenge/MissionEndSection';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const MissionDetailSection = () => {
  const params = useParams<{ programId: string }>();
  const { schedules, dailyMission, isLoading } = useCurrentChallenge();

  const { data: programData } = useQuery({
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
  const isLastMissionSubmitted =
    schedules[schedules.length - 1]?.attendanceInfo.submitted;

  if (isLastMissionSubmitted || isChallengeDone || !dailyMission) {
    return <MissionEndSection />;
  }
  return (
    <DailyMissionSection dailyMission={dailyMission} schedules={schedules} />
  );
};

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const ChallengeDashboard = () => {
  const { currentChallenge, schedules, dailyMission } = useCurrentChallenge();

  const params = useParams<{ programId: string }>();

  const todayTh =
    dailyMission?.th ??
    schedules.reduce((th, schedule) => {
      return Math.max(th, schedule.missionInfo.th ?? 0);
    }, 0) + 1;

  const { data: notices = [] } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'notices', { size: 99 }],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${currentChallenge?.id}/notices`,
        { params: { size: 99 } },
      );
      return challengeNotices.parse(res.data.data).challengeNoticeList;
    },
  });

  const { data: guides = [] } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'guides'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/guides`);
      return challengeGuides.parse(res.data.data).challengeGuideList;
    },
  });

  const { data: user } = useUserQuery();

  const { data: scoreGroup } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'score'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/score`);
      return challengeScore.parse(res.data.data);
    },
  });

  const { data: programData } = useQuery({
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
    <main className="pl-12">
      <header>
        <h1 className="text-[22px] font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-5">
        <div className="mt-6 flex gap-3">
          {/* 챌린지 미션 상세 */}
          <MissionDetailSection />

          {/* 공지사항, 미션점수 */}
          <div className="flex w-[22rem] flex-col gap-2.5">
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
          <section className="flex-1 rounded-xs border border-neutral-80 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-1-bold text-neutral-30">
                일정 및 미션 제출 현황
              </h2>
              <MissionTooltipQuestion />
            </div>
            {schedules && (
              // myChallenge 에 있는 미션캘린더 가져옴
              <MissionCalendar
                className="mt-3 gap-2"
                schedules={schedules}
                todayTh={todayTh}
                isDone={isChallengeSubmitDone}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ChallengeDashboard;