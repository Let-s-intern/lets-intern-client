import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import DailyMissionSection from '../../../components/common/challenge/dashboard/section/DailyMissionSection';
import NoticeSection from '../../../components/common/challenge/dashboard/section/NoticeSection';
import ScoreSection from '../../../components/common/challenge/dashboard/section/ScoreSection';
import axios from '../../../utils/axios';
import MissionSection from '../../../components/common/challenge/dashboard/section/MissionSection';
import CurriculumSection from '../../../components/common/challenge/dashboard/section/CurriculumSection';

const ChallengeDashboard = () => {
  const params = useParams();

  const [dailyMission, setDailyMission] = useState<any>();
  const [refundInfo, setRefundInfo] = useState<any>();
  const [noticeList, setNoticeList] = useState<any>();
  const [missionList, setMissionList] = useState<any>();
  const [todayTh, setTodayTh] = useState<number>();
  const [username, setUsername] = useState('');

  const getDashboard = useQuery({
    queryKey: ['programs', params.programId, 'dashboard'],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}/dashboard`);
      const data = res.data;

      setDailyMission(data.dailyMission);
      setRefundInfo({
        currentRefund: data.currentRefund,
        totalRefund: data.totalRefund,
        headCount: data.finalHeadCount,
      });
      setNoticeList(data.noticeList);
      setMissionList(data.missionList);
      setTodayTh(data.dailyMission.th);
      setUsername(data.userName);

      console.log(data);

      return data;
    },
  });

  const isLoading =
    getDashboard.isLoading ||
    !dailyMission ||
    !refundInfo ||
    !noticeList ||
    !missionList ||
    !todayTh;

  if (isLoading) {
    return <main />;
  }

  return (
    <main className="mr-[-3rem] px-6">
      <header>
        <h1 className="text-2xl font-semibold">
          {isLoading ? <span className="opacity-0">홍민서</span> : username}
          님의 대시보드
        </h1>
      </header>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex gap-4">
          <DailyMissionSection
            dailyMission={dailyMission}
            isLoading={isLoading || !dailyMission}
          />
          <ScoreSection
            refundInfo={refundInfo}
            isLoading={isLoading || !refundInfo}
          />
          <NoticeSection
            noticeList={noticeList}
            isLoading={isLoading || !noticeList}
          />
        </div>
        <div className="flex gap-4">
          <MissionSection missionList={missionList} todayTh={todayTh || 0} />
          <CurriculumSection />
        </div>
      </div>
    </main>
  );
};

export default ChallengeDashboard;
