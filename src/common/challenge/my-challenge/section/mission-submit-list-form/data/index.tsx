import { UserExperience } from '@/api/userExperienceSchema';
import { TableHeader } from '@/common/table/DataTable';
import ActivityTypeCell from '@/domain/mypage/experience/table-cell/ActivityTypeCell';
import CategoryCell from '@/domain/mypage/experience/table-cell/CategoryCell';
import CoreCompetencyCell from '@/domain/mypage/experience/table-cell/CoreCompetencyCell';
import dayjs from '@/lib/dayjs';

// 경험 데이터 타입 정의 (이미지 참고)
export interface ExperienceData {
  id: string;
  originalId: number; // API의 원본 ID (서버 전송용)
  name: string; // 경험 이름
  experienceCategory: string; // 경험 분류 (프로젝트, 인턴십 등)
  organization: string; // 기관
  role: string; // 역할 및 담당 업무
  activityType: 'TEAM' | 'INDIVIDUAL'; // 팀·개인 여부
  period: string; // 기간 (예: "2024.01 - 2025.12")
  year: number; // 연도
  // STAR 방법론
  situation: string; // Situation(상황)
  task: string; // Task(문제)
  action: string; // Action(행동)
  result: string; // Result(결과)
  learnings: string; // 느낀 점 / 배운 점
  coreCompetency: string; // 핵심역량
}

// API 값과 UI 표시 값 간 매핑
export const experienceCategoryToLabel: Record<string, string> = {
  PROJECT: '프로젝트',
  INTERNSHIP: '인턴',
  CLUB: '동아리',
  ACADEMIC: '학회',
  EDUCATION: '교육',
  COMPETITION: '공모전',
  EXTRACURRICULAR: '대외활동',
  COMPANY: '회사',
  UNIVERSITY: '대학교',
  OTHER: '기타',
};

export const activityTypeToLabel: Record<string, string> = {
  TEAM: '팀',
  INDIVIDUAL: '개인',
};

// UI 표시 값 -> API 값 역매핑
export const labelToExperienceCategory: Record<string, string> =
  Object.fromEntries(
    Object.entries(experienceCategoryToLabel).map(([key, value]) => [
      value,
      key,
    ]),
  );

export const labelToActivityType: Record<string, string> = Object.fromEntries(
  Object.entries(activityTypeToLabel).map(([key, value]) => [value, key]),
);

// API 응답을 ExperienceData로 변환
export const convertUserExperienceToExperienceData = (
  userExp: UserExperience,
): ExperienceData => {
  const startDate = dayjs(userExp.startDate);
  const endDate = dayjs(userExp.endDate);
  const year = startDate.year();

  // 기간 포맷: "2024.01 - 2025.12"
  const period = `${startDate.format('YYYY.MM')} - ${endDate.format('YYYY.MM')}`;

  return {
    id: String(userExp.id),
    originalId: userExp.id, // API의 원본 number ID 보존
    name: userExp.title,
    experienceCategory: userExp.experienceCategory,
    organization: userExp.organ,
    role: userExp.role,
    activityType: userExp.activityType,
    period,
    year,
    situation: userExp.situation,
    task: userExp.task,
    action: userExp.action,
    result: userExp.result,
    learnings: userExp.reflection,
    coreCompetency: userExp.coreCompetency,
  };
};

// 값이 비어있는지 확인하는 헬퍼 함수
const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => isEmpty(item));
  }
  return false;
};

// 경험이 모든 필드를 작성했는지 확인하는 함수 (ExperienceData용)
export const isExperienceComplete = (experience: ExperienceData): boolean => {
  // 테이블에 표시되는 모든 필드 확인
  const requiredFields: (keyof ExperienceData)[] = [
    'name',
    'experienceCategory',
    'organization',
    'role',
    'activityType',
    'period',
    'year',
    'situation',
    'task',
    'action',
    'result',
    'learnings',
    'coreCompetency',
  ];

  return requiredFields.every((field) => !isEmpty(experience[field]));
};

// 경험이 모든 필드를 작성했는지 확인하는 함수 (UserExperience용)
export const isUserExperienceComplete = (
  experience: UserExperience,
): boolean => {
  // 테이블에 표시되는 모든 필드 확인
  const startDate = dayjs(experience.startDate);
  const endDate = dayjs(experience.endDate);
  const year = startDate.year();
  const period = `${startDate.format('YYYY.MM')} - ${endDate.format('YYYY.MM')}`;

  const requiredFields = [
    experience.title, // name
    experience.experienceCategory, // category
    experience.organ, // organization
    experience.role, // role
    experience.activityType, // type
    period, // period
    year, // year
    experience.situation, // situation
    experience.task, // task
    experience.action, // action
    experience.result, // result
    experience.reflection, // learnings
    experience.coreCompetency ? [experience.coreCompetency] : [], // coreCompetencies
  ];

  return requiredFields.every((field) => !isEmpty(field));
};

// 경험 테이블 헤더 (재사용)
export const getExperienceHeaders = (): TableHeader[] => [
  { key: 'name', label: '경험 이름', width: '160px' },
  {
    key: 'experienceCategory',
    label: '경험 분류',
    width: '110px',
    cellRenderer: (value: string) => <CategoryCell value={value} />,
  },
  { key: 'organization', label: '기관', width: '120px' },
  { key: 'role', label: '역할 및 담당 업무', width: '180px' },
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
    align: { vertical: 'middle' },
  },
  { key: 'year', label: '연도', width: '60px', align: { vertical: 'middle' } },
  { key: 'situation', label: 'Situation(상황)', width: '150px' },
  { key: 'task', label: 'Task(문제)', width: '140px' },
  { key: 'action', label: 'Action(행동)', width: '140px' },
  { key: 'result', label: 'Result(결과)', width: '150px' },
  { key: 'learnings', label: '느낀 점 / 배운 점', width: '180px' },
  {
    key: 'coreCompetency',
    label: '핵심 역량',
    width: '140px',
    cellRenderer: (value: string) => <CoreCompetencyCell value={value} />,
  },
];
