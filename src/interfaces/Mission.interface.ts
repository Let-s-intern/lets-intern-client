import { Status } from './interface';

export interface IMissionTemplate {
  [key: string]: string | number;
  status: Status;
  id: number;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
  createdAt: string;
}

export interface IContent {
  id: number;
  title: string;
  link: string;
}

export interface IMission {
  [key: string]: string | number | IContent[];
  id: number;
  status: Status;
  type: 'GENERAL' | 'REFUND' | 'ADDITIONAL';
  title: string;
  startDate: string;
  endDate: string;
  refund: number;
  essentialContentsList: IContent[];
  additionalContentsList: IContent[];
  limitedContentsList: IContent[];
}
