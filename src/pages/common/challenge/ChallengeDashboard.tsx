import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import DailyMissionSection from '../../../components/common/challenge/dashboard/section/DailyMissionSection';
import NoticeSection from '../../../components/common/challenge/dashboard/section/NoticeSection';
import ScoreSection from '../../../components/common/challenge/dashboard/section/ScoreSection';
import axios from '../../../utils/axios';

const ChallengeDashboard = () => {
  const params = useParams();

  const [dailyMission, setDailyMission] = useState<any>();
  const [headCount, setHeadCount] = useState<any>();
  const [refundInfo, setRefundInfo] = useState<any>();
  const [noticeList, setNoticeList] = useState<any>();
  const [user, setUser] = useState<any>();

  const { isLoading: isDashboardLoading } = useQuery({
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

      return data;
    },
  });

  const { isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setUser(res.data);
      return res.data;
    },
  });

  const isQueryLoading = isDashboardLoading || isUserLoading;

  if (
    isQueryLoading ||
    !dailyMission ||
    !headCount ||
    !refundInfo ||
    !noticeList
  ) {
    return <main />;
  }

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-semibold">
          {isQueryLoading || !user ? (
            <span className="opacity-0">홍민서</span>
          ) : (
            user.name
          )}
          님의 대시보드
        </h1>
      </header>
      <div className="mt-4 flex gap-4">
        <DailyMissionSection
          dailyMission={dailyMission}
          isLoading={isQueryLoading || !dailyMission}
        />
        <ScoreSection
          headCount={headCount}
          refundInfo={refundInfo}
          isLoading={isQueryLoading || !headCount || !refundInfo}
        />
        <NoticeSection
          noticeList={noticeList}
          isLoading={isQueryLoading || !noticeList}
        />
      </div>
    </main>
  );
};

export default ChallengeDashboard;
