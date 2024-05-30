import { PROGRAM_CATEGORY } from '../utils/convert';

export type ProgramCategoryKey = keyof typeof PROGRAM_CATEGORY;

export interface DailyMission {
  id: number;
  th: number;
  title: string;
  contents: string;
  guide: string;
  template: string;
  endDate: string;
  attendanceId: string;
  essentialContentsLink: string;
  additionalContentsLink: string;
  attendanceLink?: string;
  attended: boolean;
}

export interface IProgram {
  id: number;
  title: string;
  shortDesc: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  deadline: string;
}
