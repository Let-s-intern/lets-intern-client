import {
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_TYPE,
} from '../utils/programConst';

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

interface IProgramCommon {
  id: number;
  title: string;
  shortDesc: string;
  thumbnail: string;
  createDate: string;
}

type ProgramTypeKey = keyof typeof PROGRAM_TYPE;

export interface IProgram extends IProgramCommon {
  programType: (typeof PROGRAM_TYPE)[ProgramTypeKey];
  startDate: string;
  endDate: string;
  deadline: string;
}

export interface IChallenge extends IProgramCommon {
  startDate: string;
  endDate: string;
  deadline: string;
}

export interface ILive extends IProgramCommon {
  startDate: string;
  endDate: string;
  deadline: string;
}

export interface IVod extends IProgramCommon {
  link: string;
}

export interface IFilter {
  [key: string]: boolean;
}

export type filterStatuskey = keyof typeof PROGRAM_FILTER_STATUS;
export type filterNamekey = keyof typeof PROGRAM_FILTER_NAME;
export type filterTypekey = keyof typeof PROGRAM_FILTER_TYPE;
