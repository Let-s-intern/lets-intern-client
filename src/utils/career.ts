import {
  CareerFormType,
  DateObjectType,
  EmployeeType,
  employeeTypeSchema,
  UserCareerType,
} from '@/api/careerSchema';
import { format } from 'date-fns';

/**
 * 특정 문자열이 EmployeeType enum에 속하는지 확인
 */
const isEmployeeType = (value: string): value is EmployeeType => {
  return employeeTypeSchema.safeParse(value).success;
};

/**
 * 커리어 날짜 객체를 YYYY.MM.DD 형식으로 포맷팅
 */
export const formatCareerDate = (date: DateObjectType): string => {
  const dateObj = new Date(date.year, date.monthValue - 1, 1);
  return format(dateObj, 'yyyy.MM');
};

/**
 * ✅ 커리어 API 응답을 UI 상태 형식으로 변환
 */
export const convertCareerApiToUiFormat = (
  career: UserCareerType,
): CareerFormType => {
  const rawType = career.employmentType;

  if (rawType == null) throw new Error('employmentType is null');

  const employmentType: EmployeeType = isEmployeeType(rawType)
    ? rawType
    : '기타(직접입력)';

  const employmentTypeOther = isEmployeeType(rawType) ? '' : rawType;
  const startDate = career.startDate.split('-').join('.');
  const endDate = career.endDate?.split('-').join('.');

  return {
    id: career.id,
    company: career.company,
    job: career.job,
    employmentType,
    employmentTypeOther,
    startDate,
    ...(endDate ? { endDate } : { endDate: null }),
  };
};

/**
 * ✅ 커리어 UI 상태 형식을 API 요청 형식으로 변환
 */
export const convertCareerUiToApiFormat = (
  career: CareerFormType,
): UserCareerType => {
  const { employmentType, employmentTypeOther } = career;

  const apiEmploymentType =
    employmentType === '기타(직접입력)' ? employmentTypeOther : employmentType;

  const startDate = career.startDate.replace(/\./g, '-');
  const endDate = career.endDate ? career.endDate.replace(/\./g, '-') : null;

  return {
    id: career.id,
    company: career.company,
    job: career.job,
    employmentType: apiEmploymentType!,
    startDate,
    endDate,
  };
};
