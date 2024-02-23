import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import OtherDashboardItem from '../../../components/common/challenge/other-challenges/mission/OtherDashboardItem';
import axios from '../../../utils/axios';
import SearchFilter from '../../../components/common/challenge/other-challenges/filter/SearchFilter';
import Pagination from '../../../components/common/challenge/other-challenges/pagination/Pagination';

const OtherDashboardList = () => {
  const params = useParams();

  const [dashboardList, setDashboardList] = useState<any>();
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<any>();

  const getOtherUserList = useQuery({
    queryKey: ['programs', params.programId, 'dashboard', 'entire', filter],
    queryFn: async () => {
      const res = await axios.get(
        `/program/${params.programId}/dashboard/entire`,
        {
          params: { applicationWishJob: filter },
        },
      );
      const data = res.data;
      console.log(data);
      setPageInfo(data.pageInfo);
      let newDashboardList =
        filter === 'ALL'
          ? [{ ...data.myDashboard, isMine: true }, ...data.dashboardList]
          : data.dashboardList;
      setDashboardList(newDashboardList);
      return data;
    },
  });

  const isLoading = getOtherUserList.isLoading || !dashboardList || !pageInfo;

  return (
    <main className="px-6 text-[#1E1E1E]">
      <header>
        <h1 className="text-2xl font-bold">모두의 기록장</h1>
        <p className="mt-2">안내 문구를 작성합니다.</p>
      </header>
      <SearchFilter filter={filter} setFilter={setFilter} />
      <section className="mt-6">
        {!isLoading && (
          <>
            {dashboardList.length === 0 ? (
              <p className="text-center font-medium">
                등록된 기록장이 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-8">
                {dashboardList.map((dashboard: any) => (
                  <OtherDashboardItem
                    key={dashboard.applicationId}
                    dashboard={dashboard}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      {!isLoading && (
        <>
          {pageInfo.totalPages >= 1 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              maxPage={pageInfo.totalPages}
              className="mt-8"
            />
          )}
        </>
      )}
    </main>
  );
};

export default OtherDashboardList;
