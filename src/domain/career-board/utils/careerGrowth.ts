import { MypageApplication } from '@/api/application';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';
import { Dayjs } from 'dayjs';

export interface CareerGrowthProgram {
  id: number;
  programId: number;
  thumbnail: string;
  status: string;
  programType: string;
  programTypeKey: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  purchasePlan: string;
}

const formatDate = (date: Dayjs | null): string => {
  if (!date) return '';
  return date.format('YY.MM.DD');
};

const convertApplicationToProgram = (
  application: MypageApplication,
): CareerGrowthProgram => {
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
    startDate: formatDate(application.programStartDate),
    endDate: formatDate(application.programEndDate),
    title: application.programTitle ?? '',
    description: application.programShortDesc ?? '',
    purchasePlan,
  };
};

export const toCareerGrowthPrograms = (
  applications: MypageApplication[],
): CareerGrowthProgram[] => {
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

  return targetPrograms.map((app) => convertApplicationToProgram(app));
};
