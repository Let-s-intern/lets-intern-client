import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import OtherDashboardItem from '../../../components/common/challenge/other-challenges/dashboard/OtherDashboardItem';
import axios from '../../../utils/axios';
import SearchFilter from '../../../components/common/challenge/other-challenges/filter/SearchFilter';
import Pagination from '../../../components/ui/pagination/Pagination';

const OtherDashboardList = () => {
  const params = useParams();

  const [dashboardList, setDashboardList] = useState<any>();
  const [filter, setFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<any>();
  const [wishJobList, setWishJobList] = useState<any>();

  const getOtherUserList = useQuery({
    queryKey: [
      'programs',
      params.programId,
      'dashboard',
      'entire',
      { applicationWishJob: filter, page: currentPage, size: 9 },
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/program/${params.programId}/dashboard/entire`,
        {
          params: { applicationWishJob: filter, page: currentPage, size: 9 },
        },
      );
      const data = res.data;
      console.log(data);
      setPageInfo(data.pageInfo);
      let newDashboardList =
        filter === 'ALL' ||
        filter === data.wishJobList[0] ||
        filter === data.myDashboard.wishJob
          ? [{ ...data.myDashboard, isMine: true }, ...data.dashboardList]
          : data.dashboardList;
      setDashboardList(newDashboardList);
      setWishJobList(data.wishJobList);
      return data;
    },
  });

  const isLoading =
    getOtherUserList.isLoading ||
    !dashboardList ||
    !pageInfo ||
    !filter ||
    !wishJobList;

  return (
    <main className="px-6 text-[#1E1E1E]">
      <header>
        <h1 className="text-2xl font-bold">모두의 기록장</h1>
        <p className="mt-2">안내 문구를 작성합니다.</p>
      </header>
      {!isLoading && (
        <SearchFilter
          filter={filter}
          setFilter={setFilter}
          wishJobList={wishJobList}
        />
      )}
      <section className="mt-4">
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
