import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import OtherDashboardItem from '../../../components/common/challenge/other-challenges/mission/OtherDashboardItem';
import axios from '../../../utils/axios';
import { FaArrowLeft } from 'react-icons/fa6';

const OtherDashboardList = () => {
  const [dashboardList, setDashboardList] = useState<any>();

  const { isLoading } = useQuery({
    queryKey: ['programs', 19, 'dashboard', 'entire'],
    queryFn: async () => {
      const res = await axios.get('/program/19/dashboard/entire');
      const data = res.data;
      const newDashboardList = [
        { ...data.myDashboard, isMine: true },
        ...data.dashboardList,
      ];
      setDashboardList(newDashboardList);
      console.log(newDashboardList);
      return data;
    },
  });

  return (
    <main className="px-6 text-[#1E1E1E]">
      <header>
        <h1 className="mt-1 text-2xl font-bold">모두의 기록장</h1>
        <p className="mt-2">안내 문구를 작성합니다.</p>
      </header>
      <section className="mt-6">
        {/* <SearchFilter /> */}
        {!isLoading && dashboardList && (
          <div className="grid grid-cols-3 gap-8">
            {dashboardList.map((dashboard: any) => (
              <OtherDashboardItem
                key={dashboard.applicationId}
                dashboard={dashboard}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default OtherDashboardList;
