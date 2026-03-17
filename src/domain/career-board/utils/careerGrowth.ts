import { MypageApplication } from '@/api/application';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';
import { Dayjs } from 'dayjs';

export type ProgramStatusType = 'PROCEEDING' | 'PREV' | 'POST';

export interface CareerGrowthItem {
  id: number;
  programId: number;
  thumbnail: string;
  status: string;
  programType: string;
  programTypeKey: string;
  programStatusType: ProgramStatusType | null;
  startDate: string;
  endDate: string;
  createDate: string;
  title: string;
  description: string;
  purchasePlan: string;
}

// Dayjs를 'YY.MM.DD' 형식으로 변환
const formatDate = (date: Dayjs | null): string => {
  if (!date) return '';
  return date.format('YY.MM.DD');
};

// 마이페이지 신청(application)을 커리어 성장용 아이템으로 변환
const applicationToCareerGrowthItem = (
  application: MypageApplication,
): CareerGrowthItem => {
  const status =
    application.programStatusType === 'PROCEEDING'
      ? '참여중'
      : application.programStatusType === 'PREV'
        ? '참여예정'
        : '';

  const programTypeKey = application.programType ?? '';

  const programType = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  const purchasePlan = application.pricePlanType
    ? challengePricePlanToText[application.pricePlanType] ||
      application.pricePlanType
    : '';

  return {
    id: application.id ?? 0,
    programId: application.programId ?? 0,
    thumbnail: application.programThumbnail ?? '',
    status,
    programType,
    programTypeKey,
    programStatusType: application.programStatusType ?? null,
    startDate: formatDate(application.programStartDate),
    endDate: formatDate(application.programEndDate),
    createDate: formatDate(application.createDate),
    title: application.programTitle ?? '',
    description: application.programShortDesc ?? '',
    purchasePlan,
  };
};

// 신청 목록에서 커리어 성장 섹션에 노출할 아이템 리스트 생성
export const toCareerGrowthItems = (
  applications: MypageApplication[],
): CareerGrowthItem[] => {
  if (applications.length === 0) return [];

  const proceedingPrograms: MypageApplication[] = [];
  const upcomingPrograms: MypageApplication[] = [];

  applications.forEach((app) => {
    if (!app.programId) return;

    if (app.programStatusType === 'PROCEEDING') {
      proceedingPrograms.push(app);
    } else if (app.programStatusType === 'PREV') {
      upcomingPrograms.push(app);
    }
  });

  const sortByStartDate = (a: MypageApplication, b: MypageApplication) => {
    const dateA = a.programStartDate;
    const dateB = b.programStartDate;
    if (!dateA || !dateB) return 0;
    return dateA.isBefore(dateB) ? -1 : 1;
  };

  const sortPrograms = (programs: MypageApplication[]) => {
    if (programs.length > 1) {
      programs.sort(sortByStartDate);
    }
  };

  sortPrograms(proceedingPrograms);
  sortPrograms(upcomingPrograms);

  const targetPrograms = [...proceedingPrograms, ...upcomingPrograms];

  return targetPrograms.map((app) => applicationToCareerGrowthItem(app));
};
