import DataTable, {
  TableData,
  TableHeader,
} from '@components/common/table/DataTable';

interface ExperienceDataTableProps {
  data: TableData[];
}

const ExperienceDataTable = ({ data }: ExperienceDataTableProps) => {
  return (
    <DataTable
      headers={experienceTableHeaders}
      data={data}
      className="rounded-lg border"
    />
  );
};

export default ExperienceDataTable;

const experienceTableHeaders: TableHeader[] = [
  { key: 'title', label: '경험 이름', width: '150px' },
  {
    key: 'experienceCategory',
    label: '경험 분류',
    width: '110px',
  },
  { key: 'organization', label: '기관', width: '150px' },
  {
    key: 'role',
    label: '역할 및 담당 업무',
    width: '150px',
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
  { key: 'lessonsLearned', label: '느낀 점 / 배운 점', width: '150px' },
  {
    key: 'coreCompetency',
    label: '핵심 역량',
    width: '140px',
  },
  {
    key: 'deleteAction',
    label: '목록 삭제',
    width: '100px',
  },
];
