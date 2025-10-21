import {
  DataTable,
  TableData,
  TableHeader,
} from '@/components/common/DataTable';

// 경험 데이터 타입 정의 (이미지 참고)
interface ExperienceData extends TableData {
  id: string;
  name: string; // 경험 이름
  category: string; // 경험 분류 (프로젝트, 인턴십 등)
  organization: string; // 기관
  role: string; // 역할 및 담당 업무
  type: '팀' | '개인'; // 팀·개인 여부
  period: string; // 기간 (예: "2024.01 - 2025.12")
  year: number; // 연도
  // STAR 방법론
  situation: string; // Situation(상황)
  task: string; // Task(문제)
  action: string; // Action(행동)
  result: string; // Result(결과)
  learnings: string; // 느낀 점 / 배운 점
  coreCompetencies: string[]; // 핵심역량 (배열)
}

interface ExperienceListProps {
  experiences?: ExperienceData[];
}

export const ExperienceList = ({ experiences = [] }: ExperienceListProps) => {
  // 컬럼 헤더 정보 (이미지 참고)
  const headers: TableHeader[] = [
    { key: 'name', label: '경험 이름', width: '12%' },
    { key: 'category', label: '경험 분류', width: '8%' },
    { key: 'organization', label: '기관', width: '10%' },
    { key: 'role', label: '역할 및 담당 업무', width: '12%' },
    { key: 'type', label: '팀·개인 여부', width: '6%', align: 'center' },
    { key: 'period', label: '기간', width: '8%', align: 'center' },
    { key: 'year', label: '연도', width: '5%', align: 'center' },
    { key: 'situation', label: 'Situation(상황)', width: '10%' },
    { key: 'task', label: 'Task(문제)', width: '10%' },
    { key: 'action', label: 'Action(행동)', width: '10%' },
    { key: 'result', label: 'Result(결과)', width: '10%' },
    { key: 'learnings', label: '느낀 점 / 배운 점', width: '8%' },
    { key: 'coreCompetencies', label: '핵심역량', width: '8%' },
  ];

  // 데이터가 없으면 안내 메시지 표시
  if (experiences.length === 0) {
    return (
      <p className="text-center text-xsmall14 text-neutral-20">
        작성한 경험 불러오기 버튼을 통해 <br />
        제출할 경험을 선택해주세요.(최소 3개이상)
      </p>
    );
  }

  // 데이터가 있으면 DataTable 렌더링
  return (
    <div className="h-[400px] w-[852px] overflow-auto rounded-xxs border border-neutral-80">
      <DataTable headers={headers} data={experiences} />
    </div>
  );
};
