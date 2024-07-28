import {
  PROGRAM_CLASSIFICATION,
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_STATUS_KEY,
  PROGRAM_TYPE_KEY,
} from '../utils/programConst';

interface DailyMission {
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

interface IClassification {
  programClassification: keyof typeof PROGRAM_CLASSIFICATION;
}

type IProgramStatusType = keyof typeof PROGRAM_STATUS_KEY;

interface IProgramInfo {
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
  programStatusType: IProgramStatusType;
}

export interface IProgram {
  classificationList: IClassification[];
  programInfo: IProgramInfo;
}

export interface IFilter {
  [key: string]: boolean;
}

export interface IProgramGridItem {
  keyword: string;
  title: string[];
  descriptionList: string[];
  bgColor: string;
  borderColor: string;
  textColor: string;
  link: string;
  imgSrc: string;
  className: string;
}

export type filterStatuskey = keyof typeof PROGRAM_FILTER_STATUS;
export type filterClassificationkey =
  keyof typeof PROGRAM_FILTER_CLASSIFICATION;
export type filterTypekey = keyof typeof PROGRAM_FILTER_TYPE;
export type ProgramClassificationKey = keyof typeof PROGRAM_CLASSIFICATION;
