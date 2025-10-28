import { TableHeader } from '@/components/common/table/DataTable';

// 경험 데이터 타입 정의 (이미지 참고)
export interface ExperienceData {
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

// 경험 테이블 헤더 (재사용)
export const getExperienceHeaders = (): TableHeader[] => [
  { key: 'name', label: '경험 이름', width: '160px' },
  { key: 'category', label: '경험 분류', width: '120px' },
  { key: 'organization', label: '기관', width: '120px' },
  { key: 'role', label: '역할 및 담당 업무', width: '180px' },
  { key: 'type', label: '팀·개인 여부', width: '120px', align: 'center' },
  { key: 'period', label: '기간', width: '140px', align: 'center' },
  { key: 'year', label: '연도', width: '60px', align: 'center' },
  { key: 'situation', label: 'Situation(상황)', width: '150px' },
  { key: 'task', label: 'Task(문제)', width: '140px' },
  { key: 'action', label: 'Action(행동)', width: '140px' },
  { key: 'result', label: 'Result(결과)', width: '150px' },
  { key: 'learnings', label: '느낀 점 / 배운 점', width: '180px' },
  { key: 'coreCompetencies', label: '핵심역량', width: '150px' },
];
// 더미 데이터 (이미지 참고)
export const dummyExperiences: ExperienceData[] = [
  {
    id: '1',
    name: '신제품 런칭 캠페인 기획 및 실행',
    category: '프로젝트',
    organization: 'IT 연합 동아리',
    role: '프로젝트 리더',
    type: '팀',
    period: '2024.01 - 2025.12',
    year: 2025,
    situation:
      '서비스 이용 고객의 재구매율이 업계 평균 대비 약 20% 낮은 수준으로 나타났으며, 고객 이탈률도 점진적으로 증가하는 추세를 보였습니다. 특히 경쟁사 대비 고객 만족도 지표가 낮아 근본적인 원인 파악과 개선 방안 도출이 시급한 상황이었습니다.',
    task: '프로젝트 기간 3개월 내에 고객 만족도를 최소 15% 이상 향상시키고, 재구매율을 경쟁사 수준 이상으로 끌어올리며, 고객 이탈률을 10% 이내로 낮추는 것이 핵심 목표였습니다.',
    action:
      '총 100명의 고객을 대상으로 심층 인터뷰를 실시하여 주요 불만 사항과 페인 포인트를 도출했습니다. 수집된 데이터를 정량적·정성적으로 분석하여 5가지 핵심 개선안을 마련하고, 우선순위를 설정한 후 단계별 실행 계획을 수립했습니다.',
    result:
      '프로젝트 종료 시점에 고객 만족도가 목표를 초과하여 20% 상승했으며, 재구매율은 12% 증가, NPS 점수는 35점 개선되는 성과를 달성했습니다. 이러한 성과를 인정받아 팀 내 분기 최우수 프로젝트로 선정되었고, 개선 방법론이 타 팀에 전파되었습니다.',
    learnings:
      '고객 중심 사고의 중요성을 깨달았고, 데이터 기반 의사결정 능력이 향상되었습니다.',
    coreCompetencies: ['데이터 분석', '퍼포먼스마케팅'],
  },
  {
    id: '2',
    name: '모바일 앱 개발 프로젝트',
    category: '프로젝트',
    organization: 'ABC 소프트웨어',
    role: '프론트엔드 개발자',
    type: '팀',
    period: '2023.03 - 2023.09',
    year: 2023,
    situation:
      '기존 웹 서비스의 모바일 사용성이 떨어져 사용자 이탈률이 높은 상황이었습니다.',
    task: '사용자 친화적인 모바일 앱을 개발하여 사용자 경험을 개선하고 이탈률을 줄이는 것이 목표였습니다.',
    action:
      'React Native를 사용하여 크로스 플랫폼 모바일 앱을 개발하고, 사용자 피드백을 반영하여 UI/UX를 개선했습니다.',
    result:
      '앱 출시 후 사용자 이탈률이 30% 감소했고, 앱스토어 평점 4.5점을 달성했습니다.',
    learnings:
      '모바일 개발의 특수성을 이해하고 사용자 중심 설계의 중요성을 배웠습니다.',
    coreCompetencies: ['프론트엔드 개발', 'UI/UX 설계'],
  },
  {
    id: '3',
    name: '데이터 분석 및 시각화',
    category: '개인 프로젝트',
    organization: '개인',
    role: '데이터 분석가',
    type: '개인',
    period: '2022.11 - 2023.01',
    year: 2023,
    situation:
      '대용량 데이터를 효율적으로 분석하고 인사이트를 도출하는 방법이 필요했습니다.',
    task: 'Python과 시각화 도구를 활용하여 데이터 분석 파이프라인을 구축하고 인사이트를 도출하는 것이 목표였습니다.',
    action:
      'Pandas, NumPy를 사용하여 데이터 전처리를 수행하고, Matplotlib, Seaborn으로 시각화를 구현했습니다.',
    result:
      '분석 결과를 바탕으로 비즈니스 인사이트를 도출하여 보고서로 정리했습니다.',
    learnings:
      '데이터 분석의 전체 프로세스를 이해하고 시각화의 중요성을 배웠습니다.',
    coreCompetencies: ['데이터 분석', 'Python'],
  },
];
