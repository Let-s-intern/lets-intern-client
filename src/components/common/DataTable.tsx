import React from 'react';

// 테이블 헤더 타입 정의
export interface TableHeader {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// 테이블 데이터 타입 정의
export interface TableData {
  [key: string]: any;
}

// 테이블 컴포넌트 Props 타입
export interface DataTableProps {
  headers: TableHeader[];
  data: TableData[];
  className?: string;
}

// 기본 테이블 컴포넌트
export const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="border-b bg-gray-50">
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                  header.align === 'center'
                    ? 'text-center'
                    : header.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ width: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {headers.map((header) => (
                <td
                  key={header.key}
                  className={`px-4 py-3 text-sm text-gray-900 ${
                    header.align === 'center'
                      ? 'text-center'
                      : header.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  }`}
                >
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 사용 예시를 위한 샘플 데이터 타입
export interface ExperienceData {
  experienceName: string;
  experienceCategory: string;
  organization: string;
  roleAndResponsibilities: string;
  teamOrIndividual: string;
  period: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  lessonsLearned: string;
  coreCompetencies: string;
  deleteAction: string;
}

// 이미지에서 본 테이블 구조에 맞는 헤더 정의
export const experienceTableHeaders: TableHeader[] = [
  { key: 'experienceName', label: '경험 이름', width: '150px' },
  { key: 'experienceCategory', label: '경험 분류', width: '120px' },
  { key: 'organization', label: '기관', width: '150px' },
  {
    key: 'roleAndResponsibilities',
    label: '역할 및 담당 업무',
    width: '150px',
  },
  { key: 'teamOrIndividual', label: '팀·개인 여부', width: '100px' },
  { key: 'period', label: '기간', width: '120px' },
  { key: 'situation', label: 'Situation(상황)', width: '200px' },
  { key: 'task', label: 'Task(문제)', width: '200px' },
  { key: 'action', label: 'Action(행동)', width: '200px' },
  { key: 'result', label: 'Result(결과)', width: '200px' },
  { key: 'lessonsLearned', label: '느낀 점 / 배운 점', width: '150px' },
  { key: 'coreCompetencies', label: '핵심역량', width: '120px' },
  { key: 'deleteAction', label: '목록 삭제', width: '100px' },
];

// 샘플 데이터 (이미지에서 본 내용 기반)
export const sampleExperienceData: ExperienceData[] = [
  {
    experienceName: '신제품 런칭 캠페인 기획 및 실행',
    experienceCategory: '프로젝트',
    organization: 'it 연합 동아리 it 연합 동아리 it 연합 동아리',
    roleAndResponsibilities: '프로젝트 리더 프로젝트 매니져',
    teamOrIndividual: '팀',
    period: '2024.01 - 2025.12',
    situation:
      '고객 재구매율이 업계 평균 대비 20% 낮고, 고객 이탈이 증가하고 있으며, 경쟁사 대비 고객 만족도가 낮은 상황에서 근본 원인 분석 및 개선 방안이 필요한 상황',
    task: '3개월 내 고객 만족도를 최소 15% 이상 향상시키고, 재구매율을 경쟁사 수준 이상으로 끌어올리며, 고객 이탈률을 10% 미만으로 감소시키는 것',
    action:
      '100명의 고객을 대상으로 심층 인터뷰를 진행하여 불만사항과 페인포인트를 파악하고, 정량적·정성적 데이터를 분석하여 5가지 핵심 개선 방안을 도출하고 우선순위를 정한 후 단계별 실행 계획을 수립',
    result:
      '프로젝트 완료 시점에 고객 만족도가 목표 대비 20% 초과 달성했고, 재구매율이 12% 증가했으며, NPS 점수가 35점 향상되었습니다. 이러한 성과로 인해 팀 내 최우수 분기 프로젝트로 선정되었고, 해당 방법론이 다른 팀에서도 도입되었습니다.',
    lessonsLearned:
      '고객 중심적 사고의 중요성을 깨닫고 데이터 기반 의사결정 능력이 향상되었습니다.',
    coreCompetencies: '데이터 분석, 퍼포먼스마케팅 +n',
    deleteAction: '🗑️',
  },
  // 추가 샘플 데이터들...
  {
    experienceName: '신제품 런칭 캠페인 기획 및 실행',
    experienceCategory: '프로젝트',
    organization: 'it 연합 동아리 it 연합 동아리 it 연합 동아리',
    roleAndResponsibilities: '프로젝트 리더 프로젝트 매니져',
    teamOrIndividual: '팀',
    period: '2024.01 - 2025.12',
    situation:
      '고객 재구매율이 업계 평균 대비 20% 낮고, 고객 이탈이 증가하고 있으며, 경쟁사 대비 고객 만족도가 낮은 상황에서 근본 원인 분석 및 개선 방안이 필요한 상황',
    task: '3개월 내 고객 만족도를 최소 15% 이상 향상시키고, 재구매율을 경쟁사 수준 이상으로 끌어올리며, 고객 이탈률을 10% 미만으로 감소시키는 것',
    action:
      '100명의 고객을 대상으로 심층 인터뷰를 진행하여 불만사항과 페인포인트를 파악하고, 정량적·정성적 데이터를 분석하여 5가지 핵심 개선 방안을 도출하고 우선순위를 정한 후 단계별 실행 계획을 수립',
    result:
      '프로젝트 완료 시점에 고객 만족도가 목표 대비 20% 초과 달성했고, 재구매율이 12% 증가했으며, NPS 점수가 35점 향상되었습니다. 이러한 성과로 인해 팀 내 최우수 분기 프로젝트로 선정되었고, 해당 방법론이 다른 팀에서도 도입되었습니다.',
    lessonsLearned:
      '고객 중심적 사고의 중요성을 깨닫고 데이터 기반 의사결정 능력이 향상되었습니다.',
    coreCompetencies: '데이터 분석, 퍼포먼스마케팅 +n',
    deleteAction: '🗑️',
  },
  {
    experienceName: '신제품 런칭 캠페인 기획 및 실행',
    experienceCategory: '프로젝트',
    organization: 'it 연합 동아리 it 연합 동아리 it 연합 동아리',
    roleAndResponsibilities: '프로젝트 리더 프로젝트 매니져',
    teamOrIndividual: '팀',
    period: '2024.01 - 2025.12',
    situation:
      '고객 재구매율이 업계 평균 대비 20% 낮고, 고객 이탈이 증가하고 있으며, 경쟁사 대비 고객 만족도가 낮은 상황에서 근본 원인 분석 및 개선 방안이 필요한 상황',
    task: '3개월 내 고객 만족도를 최소 15% 이상 향상시키고, 재구매율을 경쟁사 수준 이상으로 끌어올리며, 고객 이탈률을 10% 미만으로 감소시키는 것',
    action:
      '100명의 고객을 대상으로 심층 인터뷰를 진행하여 불만사항과 페인포인트를 파악하고, 정량적·정성적 데이터를 분석하여 5가지 핵심 개선 방안을 도출하고 우선순위를 정한 후 단계별 실행 계획을 수립',
    result:
      '프로젝트 완료 시점에 고객 만족도가 목표 대비 20% 초과 달성했고, 재구매율이 12% 증가했으며, NPS 점수가 35점 향상되었습니다. 이러한 성과로 인해 팀 내 최우수 분기 프로젝트로 선정되었고, 해당 방법론이 다른 팀에서도 도입되었습니다.',
    lessonsLearned:
      '고객 중심적 사고의 중요성을 깨닫고 데이터 기반 의사결정 능력이 향상되었습니다.',
    coreCompetencies: '데이터 분석, 퍼포먼스마케팅 +n',
    deleteAction: '🗑️',
  },
  {
    experienceName: '신제품 런칭 캠페인 기획 및 실행',
    experienceCategory: '프로젝트',
    organization: 'it 연합 동아리 it 연합 동아리 it 연합 동아리',
    roleAndResponsibilities: '프로젝트 리더 프로젝트 매니져',
    teamOrIndividual: '팀',
    period: '2024.01 - 2025.12',
    situation:
      '고객 재구매율이 업계 평균 대비 20% 낮고, 고객 이탈이 증가하고 있으며, 경쟁사 대비 고객 만족도가 낮은 상황에서 근본 원인 분석 및 개선 방안이 필요한 상황',
    task: '3개월 내 고객 만족도를 최소 15% 이상 향상시키고, 재구매율을 경쟁사 수준 이상으로 끌어올리며, 고객 이탈률을 10% 미만으로 감소시키는 것',
    action:
      '100명의 고객을 대상으로 심층 인터뷰를 진행하여 불만사항과 페인포인트를 파악하고, 정량적·정성적 데이터를 분석하여 5가지 핵심 개선 방안을 도출하고 우선순위를 정한 후 단계별 실행 계획을 수립',
    result:
      '프로젝트 완료 시점에 고객 만족도가 목표 대비 20% 초과 달성했고, 재구매율이 12% 증가했으며, NPS 점수가 35점 향상되었습니다. 이러한 성과로 인해 팀 내 최우수 분기 프로젝트로 선정되었고, 해당 방법론이 다른 팀에서도 도입되었습니다.',
    lessonsLearned:
      '고객 중심적 사고의 중요성을 깨닫고 데이터 기반 의사결정 능력이 향상되었습니다.',
    coreCompetencies: '데이터 분석, 퍼포먼스마케팅 +n',
    deleteAction: '🗑️',
  },
];

export default DataTable;
