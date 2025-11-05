import { useGetAllUserExperienceQuery } from '@/api/experience';
import { Sortable } from '@/api/experienceSchema';
import { convertFilterUiToApiFormat, isAllFilters } from '@/utils/experience';
import { Filters } from '@components/common/mypage/experience/ExperienceFilters';
import OutlinedButton from '@components/common/mypage/experience/OutlinedButton';
import ActivityTypeCell from '@components/common/mypage/experience/table-cell/ActivityTypeCell';
import CategoryCell from '@components/common/mypage/experience/table-cell/CategoryCell';
import CoreCompetencyCell from '@components/common/mypage/experience/table-cell/CoreCompetencyCell';
import DeleteCell from '@components/common/mypage/experience/table-cell/DeleteCell';
import PeriodCell from '@components/common/mypage/experience/table-cell/PeriodCell';
import YearCell from '@components/common/mypage/experience/table-cell/YearCell';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import DataTable, {
  TableData,
  TableHeader,
} from '@components/common/table/DataTable';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

const ExperienceDataTable = ({
  sortBy,
  filters,
  onResetFilters,
  onRowClick,
}: {
  sortBy: Sortable;
  filters: Filters;
  onResetFilters: () => void;
  onRowClick?: (experience: TableData) => void;
}) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllUserExperienceQuery(
    convertFilterUiToApiFormat(filters),
    sortBy,
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

  if (isLoading) {
    return <ExperienceDataTableLoading />;
  }

  if (userExperiences.length === 0) {
    return (
      <ExperienceDataTableEmpty
        isAllFilters={isAllFilters(filters)}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <section>
      <DataTable
        headers={experienceTableHeaders}
        data={userExperiences}
        onRowClick={onRowClick}
        className="rounded-xs border border-neutral-80"
      />

      {totalPages > 1 && (
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
      )}
    </section>
  );
};

export default ExperienceDataTable;

const ExperienceDataTableLoading = () => (
  <LoadingContainer className="mt-[14%]" text="경험을 불러오는 중입니다.." />
);

const ExperienceDataTableEmpty = ({
  isAllFilters,
  onResetFilters,
}: {
  isAllFilters: boolean;
  onResetFilters: () => void;
}) => {
  const handleDrawerOpen = () => {
    // 드로어 열기 로직 구현
  };

  // 모든 필터가 초기 상태인 경우
  if (isAllFilters)
    return (
      <div className="flex h-[25rem] flex-col items-center justify-center gap-3">
        <p className="text-sm text-neutral-20">
          지금까지 쌓아온 경험을 작성해 주세요.
        </p>
        <OutlinedButton onClick={handleDrawerOpen}>
          경험 작성하기
        </OutlinedButton>
      </div>
    );

  // 일부 필터가 적용된 상태인 경우
  return (
    <div className="flex h-[25rem] flex-col items-center justify-center gap-3">
      <p className="text-sm text-neutral-20">
        해당 조건에 맞는 경험이 없습니다.
      </p>
      <OutlinedButton onClick={onResetFilters}>초기화하기</OutlinedButton>
    </div>
  );
};

const experienceTableHeaders: TableHeader[] = [
  { key: 'title', label: '경험 이름', width: '160px' },
  {
    key: 'experienceCategory',
    label: '경험 분류',
    width: '110px',
    cellRenderer: (value: string) => <CategoryCell value={value} />,
  },
  { key: 'organ', label: '기관', width: '140px' },
  {
    key: 'role',
    label: '역할 및 담당 업무',
    width: '140px',
  },
  {
    key: 'activityType',
    label: '팀·개인 여부',
    width: '100px',
    cellRenderer: (value: string) => <ActivityTypeCell value={value} />,
  },
  {
    key: 'period',
    label: '기간',
    width: '140px',
    cellRenderer: (_, row) => <PeriodCell row={row} />,
  },
  {
    key: 'year',
    label: '연도',
    width: '80px',
    cellRenderer: (_, row) => <YearCell row={row} />,
  },
  { key: 'situation', label: 'Situation(상황)', width: '200px' },
  { key: 'task', label: 'Task(문제)', width: '200px' },
  { key: 'action', label: 'Action(행동)', width: '200px' },
  { key: 'result', label: 'Result(결과)', width: '200px' },
  { key: 'reflection', label: '느낀 점 / 배운 점', width: '200px' },
  {
    key: 'coreCompetency',
    label: '핵심 역량',
    width: '140px',
    cellRenderer: (value: string) => <CoreCompetencyCell value={value} />,
  },
  {
    key: 'deleteAction',
    label: '목록 삭제',
    width: '90px',
    align: { vertical: 'middle' },
    cellRenderer: (_, row) => <DeleteCell row={row} />,
  },
];
