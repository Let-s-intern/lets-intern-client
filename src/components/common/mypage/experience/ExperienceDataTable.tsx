import { useGetAllUserExperienceQuery } from '@/api/experience';
import { convertFilterUiToApiFormat } from '@/app/(user)/mypage/experience/utils';
import { Filters } from '@components/common/mypage/experience/ExperienceFilters';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import DataTable, { TableHeader } from '@components/common/table/DataTable';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

const ExperienceDataTable = ({ filters }: { filters: Filters }) => {
  const [page, setPage] = useState(1);

  const { data } = useGetAllUserExperienceQuery(
    convertFilterUiToApiFormat(filters),
    {
      page,
      size: PAGE_SIZE,
    },
  );

  const { userExperiences } = data || { userExperiences: [] };
  const { currentPage, totalPages, totalElements } = data || {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page);
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <section>
      <DataTable
        headers={experienceTableHeaders}
        data={userExperiences}
        className="rounded-lg border"
      />

      <MuiPagination
        page={currentPage + 1}
        onChange={handlePageChange}
        pageInfo={{
          pageNum: currentPage + 1,
          pageSize: PAGE_SIZE,
          totalElements,
          totalPages,
        }}
      />
    </section>
  );
};

export default ExperienceDataTable;

const experienceTableHeaders: TableHeader[] = [
  { key: 'title', label: '경험 이름', width: '160px' },
  {
    key: 'experienceCategory',
    label: '경험 분류',
    width: '110px',
  },
  { key: 'organization', label: '기관', width: '140px' },
  {
    key: 'role',
    label: '역할 및 담당 업무',
    width: '140px',
  },
  {
    key: 'activityType',
    label: '팀·개인 여부',
    width: '100px',
  },
  { key: 'period', label: '기간', width: '140px' },
  {
    key: 'year',
    label: '연도',
    width: '80px',
  },
  { key: 'situation', label: 'Situation(상황)', width: '200px' },
  { key: 'task', label: 'Task(문제)', width: '200px' },
  { key: 'action', label: 'Action(행동)', width: '200px' },
  { key: 'result', label: 'Result(결과)', width: '200px' },
  { key: 'lessonsLearned', label: '느낀 점 / 배운 점', width: '200px' },
  {
    key: 'coreCompetency',
    label: '핵심 역량',
    width: '140px',
  },
  {
    key: 'deleteAction',
    label: '목록 삭제',
    width: '90px',
  },
];
