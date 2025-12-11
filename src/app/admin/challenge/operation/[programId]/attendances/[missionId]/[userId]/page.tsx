'use client';

import { useMissionAttendanceUserExperiencesQuery } from '@/api/challenge';
import { UserAttendanceExperience } from '@/api/experienceSchema';
import DataTable, { TableHeader } from '@/common/table/DataTable';
import ActivityTypeCell from '@/domain/mypage/experience/table-cell/ActivityTypeCell';
import CategoryCell from '@/domain/mypage/experience/table-cell/CategoryCell';
import CoreCompetencyCell from '@/domain/mypage/experience/table-cell/CoreCompetencyCell';
import PeriodCell from '@/domain/mypage/experience/table-cell/PeriodCell';
import YearCell from '@/domain/mypage/experience/table-cell/YearCell';
import { getExperienceRowHeight } from '@/utils/experience';
import { useParams } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa6';

function Page() {
  const params = useParams<{
    userId: string;
    missionId: string;
    programId: string;
  }>();
  const missionId = Number(params.missionId);
  const userId = Number(params.userId);

  const { data, isLoading, error } = useMissionAttendanceUserExperiencesQuery({
    missionId,
    userId,
    enabled: !!missionId && !!userId,
  });

  if (!userId || !missionId) return <div>필요한 정보가 없습니다.</div>;

  if (isLoading) return <FaSpinner />;

  if (error) {
    return <div>에러가 발생했습니다: {String(error)}</div>;
  }

  const userExperiences = data?.userExperiences ?? [];
  if (userExperiences.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  const formattedData = formatExperienceData(userExperiences);

  return (
    <div className="p-4">
      <DataTable
        headers={experienceTableHeaders}
        data={formattedData}
        getRowHeight={getExperienceRowHeight}
        className="rounded-lg border"
      />
    </div>
  );
}

const formatExperienceData = (data: UserAttendanceExperience) => {
  return data.map((item) => {
    if (!item.startDate || !item.endDate) {
      return { ...item, period: '-', year: '-' };
    }
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    // 기간: yyyy.mm.dd ~ yyyy.mm.dd
    const period = `${start.toLocaleDateString('ko-KR')} ~ ${end.toLocaleDateString('ko-KR')}`;
    // 연도: endDate의 연도만 추출
    const year = end.getFullYear();
    return {
      ...item,
      period,
      year,
    };
  });
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
];

export default Page;
