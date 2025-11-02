'use client';

import { useMissionAttendanceUserExperiencesQuery } from '@/api/challenge';
import DataTable, { TableHeader } from '@components/common/table/DataTable';
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

  const userExperiences =
    data?.userExperiences || (Array.isArray(data) ? data : []);

  if (userExperiences.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="p-4">
      <DataTable
        headers={experienceTableHeaders}
        data={userExperiences}
        className="rounded-lg border"
      />
    </div>
  );
}

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
];

export default Page;
