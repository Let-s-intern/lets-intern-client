import { useUserQuery } from '@/api/user';
import EndDailyMissionSection from '@/components/common/challenge/dashboard/section/EndDailyMissionSection';
import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { challengeGuides, challengeNotices, challengeScore } from '@/schema';
import axios from '@/utils/axios';
import OldDailyMissionSection from '@components/common/challenge/OldDailyMissionSection';
import OldGuideSection from '@components/common/challenge/OldGuideSection';
import OldMissionCalendar from '@components/common/challenge/OldMissionCalendar';
import OldMissionTooltipQuestion from '@components/common/challenge/OldMissionTooltipQuestion';
import OldNoticeSection from '@components/common/challenge/OldNoticeSection';
import OldScoreSection from '@components/common/challenge/OldScoreSection';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const OldChallengeDashboard = () => {
  const { currentChallenge, schedules, dailyMission } =
    useOldCurrentChallenge();

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
        <h1 className="text-2xl font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex gap-4">
          {dailyMission ? (
            <OldDailyMissionSection dailyMission={dailyMission} />
          ) : (
            isChallengeDone && <EndDailyMissionSection />
          )}
          <div className="flex w-[12rem] flex-col gap-4">
            <OldScoreSection
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
            <OldNoticeSection notices={notices} />
          </div>
          <OldGuideSection guides={guides} />
        </div>
        <div className="flex gap-4">
          <section className="flex-1 rounded-xl border border-neutral-80 px-10 py-8">
            <div className="flex items-center gap-2">
              <h2 className="text-1-bold text-neutral-30">
                일정 및 미션 제출 현황
              </h2>
              <OldMissionTooltipQuestion />
            </div>
            {schedules && (
              <OldMissionCalendar
                className="mt-4"
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

export default OldChallengeDashboard;
