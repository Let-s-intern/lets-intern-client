import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
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
  beginning: string;
}

export interface IClassification {
  programClassification: keyof typeof PROGRAM_TYPE_KEY;
}

export interface IProgramInfo {
  programType: keyof typeof PROGRAM_TYPE_KEY;
  id: number;
  title: string;
  shortDesc: string;
  thumbnail: string;
  createDate: string;
  beginning?: string;
  deadline?: string;
  startDate: string;
  endDate?: string;
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
export type filterClassificationkey =
  keyof typeof PROGRAM_FILTER_CLASSIFICATION;
export type filterTypekey = keyof typeof PROGRAM_FILTER_TYPE;
