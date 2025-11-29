import { UserAdminDetail } from '@/schema';
import { getExperienceRowHeight } from '@/utils/experience';
import ActivityTypeCell from '@components/common/mypage/experience/table-cell/ActivityTypeCell';
import CategoryCell from '@components/common/mypage/experience/table-cell/CategoryCell';
import CoreCompetencyCell from '@components/common/mypage/experience/table-cell/CoreCompetencyCell';
import PeriodCell from '@components/common/mypage/experience/table-cell/PeriodCell';
import YearCell from '@components/common/mypage/experience/table-cell/YearCell';
import DataTable, { TableHeader } from '@components/common/table/DataTable';

const PersonalExperience = ({ data }: { data: UserAdminDetail }) => {
  const formattedData = formatExperienceData(data.experienceInfos);
  if (formattedData.length === 0) return;

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-lg font-semibold">경험</h1>
      </div>
      <DataTable
        headers={experienceTableHeaders}
        data={formattedData}
        getRowHeight={getExperienceRowHeight}
        className="mt-4 rounded-lg border"
      />
    </div>
  );
};

const formatExperienceData = (data: UserAdminDetail['experienceInfos']) => {
  if (!data) return [];
  return data.map((item, index) => {
    if (!item.startDate || !item.endDate) {
      return { ...item, id: index, period: '-', year: '-' };
    }
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const period = `${start.toLocaleDateString('ko-KR')} ~ ${end.toLocaleDateString('ko-KR')}`;
    const year = end.getFullYear();
    return {
      ...item,
      id: index,
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
export default PersonalExperience;
