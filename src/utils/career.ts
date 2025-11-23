import {
  CareerFormType,
  EmployeeType,
  employeeTypeSchema,
  UserCareerType,
  YearMonthType,
} from '@/api/careerSchema';

/**
 * 특정 문자열이 EmployeeType enum에 속하는지 확인
 */
const isEmployeeType = (value: string): value is EmployeeType => {
  return employeeTypeSchema.safeParse(value).success;
};

/**
 * 커리어 날짜 객체를 yyyy.MM 형식으로 포맷팅
 */
export const toCareerDateDot = (date: YearMonthType): YearMonthType => {
  return date.replace('-', '.');
};

/**
 * 커리어 날짜 객체를 yyyy-MM 형식으로 포맷팅
 */
export const toCareerDateDash = (date: YearMonthType): YearMonthType => {
  return date.replace('.', '-');
};

/**
 * 종료일이 시작일 이후인지 검증
 * @param startDate - 시작일 (YYYY-MM 또는 YYYY.MM 형식)
 * @param endDate - 종료일 (YYYY-MM 또는 YYYY.MM 형식)
 * @returns 종료일이 시작일과 같거나 이후면 true
 */
export const isEndDateAfterStartDate = (
  startDate: string,
  endDate: string,
): boolean => {
  // 날짜 형식 통일 (YYYY-MM)
  const start = startDate.replace(/\./g, '-');
  const end = endDate.replace(/\./g, '-');

  return end >= start;
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
  const startDate = toCareerDateDot(career.startDate);
  const endDate = career.endDate ? toCareerDateDot(career.endDate) : null;

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

  const startDate = toCareerDateDash(career.startDate!);
  const endDate = career.endDate ? toCareerDateDash(career.endDate) : null;
  return {
    id: career.id,
    company: career.company,
    job: career.job,
    employmentType: apiEmploymentType!,
    startDate,
    endDate,
  };
};
