import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';
// import MissionCalendar from '../../../components/common/challenge/dashboard/mission-calendar/MissionCalendar';
import DailyMissionSection from '../../../components/common/challenge/dashboard/section/DailyMissionSection';
import NoticeSection from '../../../components/common/challenge/dashboard/section/NoticeSection';
import ScoreSection from '../../../components/common/challenge/dashboard/section/ScoreSection';
import MissionCalendar from '../../../components/common/challenge/my-challenge/mission-calendar/MissionCalendar';
import MissionTooltipQuestion from '../../../components/common/challenge/ui/tooltip-question/MissionTooltipQuestion';
import { useCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import {
  challengeGuides,
  challengeNotices,
  challengeScore,
  DailyMission,
  Schedule,
  userSchema,
} from '../../../schema';
import axios from '../../../utils/axios';
import GuideSection from '../../../components/common/challenge/dashboard/section/GuideSection';
import EndDailyMissionSection from '../../../components/common/challenge/dashboard/section/EndDailyMissionSection';

const getScoreFromSchedule = (schedule: Schedule) => {
  switch (schedule.attendanceInfo.status) {
    case 'ABSENT':
      return 0;
    case 'LATE':
    case 'PRESENT':
    case 'UPDATED':
      return 0;
  }
  return 0;
};

// TODO: [나중에... ]외부로 빼야 함
const getIsDone = (schedules: Schedule[]) => {
  const last = schedules.reduce((acc, schedule) => {
    const endDate = dayjs(schedule.missionInfo.endDate) ?? dayjs('2000-01-01');
    if (acc.isBefore(endDate)) {
      return endDate;
    }
    return acc;
  }, dayjs('2000-01-01'));

  console.log('lastday', last.add(2, 'day'));

  return dayjs(new Date()).isAfter(last.add(2, 'day'));
};

const ChallengeDashboard = () => {
  const { currentChallenge, schedules, dailyMission } = useCurrentChallenge();

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

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      return userSchema.parse(res.data.data);
    },
  });

  const { data: scoreGroup } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'score'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/score`);
      return challengeScore.parse(res.data.data);
    },
  });

  const totalScore = scoreGroup?.totalScore || 0;
  const currentScore = scoreGroup?.currentScore || 0;

  useEffect(() => {
    console.log('currentChallenge', currentChallenge);
  }, [currentChallenge]);

  useEffect(() => {
    console.log('schedule', schedules);
  }, [schedules]);

  useEffect(() => {
    console.log('notices', notices);
  }, [notices]);

  useEffect(() => {
    console.log('guides', guides);
  }, [guides]);

  useEffect(() => {
    console.log('dailyMission', dailyMission);
  }, [dailyMission]);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  useEffect(() => {
    console.log('totalScore', totalScore);
  }, [totalScore]);

  const isDone = getIsDone(schedules);

  useEffect(() => {
    console.log('isDone', isDone);
  }, [isDone]);

  return (
    <main className="mr-[-1rem] pl-6">
      <header>
        <h1 className="text-2xl font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex gap-4">
          {dailyMission ? (
            <DailyMissionSection dailyMission={dailyMission} />
          ) : (
            isDone && <EndDailyMissionSection />
          )}
          <div className="flex w-[12rem] flex-col gap-4">
            <ScoreSection
              // refundInfo={refundInfo}
              // isLoading={isLoading}
              // todayTh={todayTh}
              totalScore={totalScore}
              currentScore={currentScore}
            />
            <NoticeSection notices={notices} />
          </div>
          {/* <div className="flex h-full w-full max-w-[12rem] flex-col gap-4"> */}
          <GuideSection guides={guides} />
          {/* </div> */}
        </div>
        <div className="flex gap-4">
          <section className="flex-1 rounded-xl border border-neutral-80 px-10 py-8">
            <div className="flex items-center gap-2">
              <h2 className="text-1-bold text-neutral-30">
                일정 및 미션 제출 현황
              </h2>
              <MissionTooltipQuestion />
            </div>
            {schedules && (
              // myChallenge 에 있는 미션캘린더 가져옴
              <MissionCalendar
                className="mt-4"
                schedules={schedules}
                todayTh={todayTh}
                isDone={isDone}
              />
            )}
          </section>
          {/* <CurriculumSection /> */}
        </div>
      </div>
    </main>
  );
};

export default ChallengeDashboard;
