import { useUserQuery } from '@/api/user';
import GuideSection from '@/components/common/challenge/dashboard/section/ChallengeGuideSection';
import DailyMissionSection from '@/components/common/challenge/dashboard/section/DailyChallengeMissionSection';
import EndDailyMissionSection from '@/components/common/challenge/dashboard/section/EndDailyMissionSection';
import ScoreSection from '@/components/common/challenge/dashboard/section/MissionScoreSection';
import NoticeSection from '@/components/common/challenge/dashboard/section/NoticeBoardSection';
import MissionCalendar from '@/components/common/challenge/my-challenge/mission-calendar/ChallengeMissionCalendar';
import MissionTooltipQuestion from '@/components/common/challenge/ui/tooltip-question/MissionTooltipQuestion';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { challengeGuides, challengeNotices, challengeScore } from '@/schema';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import axios from '@/utils/axios';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const DashboardPage = () => {
  const { currentChallenge, schedules, dailyMission } = useCurrentChallenge();

  const params = useParams();

  const todayTh =
    dailyMission?.th ||
    schedules.reduce((th, schedule) => {
      return Math.max(th, schedule.missionInfo.th || 0);
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

  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = getIsChallengeSubmitDone(programEndDate);

  return (
    <main className="mr-[-1rem] pl-6">
      <header>
        <h1 className="text-[22px] font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-3">
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {/* 챌린지 미션 상세 */}
          {dailyMission ? (
            <DailyMissionSection
              dailyMission={dailyMission}
              isDone={isChallengeSubmitDone}
            />
          ) : (
            isChallengeDone && <EndDailyMissionSection />
          )}
          {/* 공지사항, 미션점수 */}
          <div className="flex w-[22rem] flex-col gap-3">
            <NoticeSection notices={notices} />
            <div className="flex gap-3">
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
        <div className="flex gap-3">
          <section className="flex-1 rounded-xs border border-neutral-80 p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-neutral-10">
                일정 및 미션 제출 현황
              </h2>
              <MissionTooltipQuestion />
            </div>
            {schedules && (
              // myChallenge 에 있는 미션캘린더 가져옴
              <MissionCalendar
                className="mt-3"
                schedules={schedules}
                todayTh={todayTh}
                isDone={isChallengeSubmitDone}
              />
            )}
          </section>
          {/* <CurriculumSection /> */}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
