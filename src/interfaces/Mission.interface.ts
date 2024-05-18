import { STATUS } from '../utils/convert';
import { StatusKey } from './interface';

export interface IMissionTemplate {
  [key: string]: any;
  status?: (typeof STATUS)[StatusKey];
  id?: number;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
  createdDate?: string;
}

export interface IContent {
  id: number;
  title: string;
}

export interface IMission {
  [key: string]: any;
  id?: number;
  status?: (typeof STATUS)[StatusKey];
  type: 'GENERAL' | 'REFUND' | 'ADDITIONAL';
  missionTemplateId?: number;
  title: string;
  startDate: string;
  endDate?: string;
  refund: number;
  essentialContentsList: IContent[] | number[];
  additionalContentsList: IContent[] | number[];
  limitedContentsList: IContent[] | number[];
}
