import { useState } from 'react';
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
  const [headCount, setHeadCount] = useState<any>();
  const [refundInfo, setRefundInfo] = useState<any>();
  const [noticeList, setNoticeList] = useState<any>();
  const [missionList, setMissionList] = useState<any>();
  const [user, setUser] = useState<any>();

  const getDashboard = useQuery({
    queryKey: ['programs', params.programId, 'dashboard'],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}/dashboard`);
      const data = res.data;

      setDailyMission(data.dailyMission);
      setHeadCount(data.finalHeadCount);
      setRefundInfo({
        currentRefund: data.currentRefund,
        totalRefund: data.totalRefund,
      });
      setNoticeList(data.noticeList);
      setMissionList(data.missionList);

      console.log(data);

      return data;
    },
  });

  const getUser = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setUser(res.data);
      return res.data;
    },
  });

  const isLoading =
    getDashboard.isLoading ||
    getUser.isLoading ||
    !dailyMission ||
    !headCount ||
    !refundInfo ||
    !noticeList ||
    !user ||
    !missionList;

  if (isLoading) {
    return <main />;
  }

  return (
    <main className="mr-[-3rem] px-6">
      <header>
        <h1 className="text-2xl font-semibold">
          {isLoading || !user ? (
            <span className="opacity-0">홍민서</span>
          ) : (
            user.name
          )}
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
            headCount={headCount}
            refundInfo={refundInfo}
            isLoading={isLoading || !headCount || !refundInfo}
          />
          <NoticeSection
            noticeList={noticeList}
            isLoading={isLoading || !noticeList}
          />
        </div>
        <div className="flex gap-4">
          <MissionSection missionList={missionList} />
          <CurriculumSection />
        </div>
      </div>
    </main>
  );
};

export default ChallengeDashboard;
