import {
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_NAME_KEY,
  PROGRAM_TYPE,
  PROGRAM_TYPE_KEY,
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

export interface IClassification {
  programClassification: keyof typeof PROGRAM_TYPE_KEY;
}

export interface IProgramInfo extends IProgramCommon {
  programType: keyof typeof PROGRAM_NAME_KEY;
}

export interface IProgram {
  classificationList: IClassification[];
  programInfo: IProgramInfo;
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
