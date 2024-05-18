import { STATUS } from '../utils/convert';
import { StatusKey } from './interface';

export interface IMissionTemplate {
  [key: string]: any;
  status: (typeof STATUS)[StatusKey];
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
}

export interface IMission {
  [key: string]: any;
  id?: number;
  status: (typeof STATUS)[StatusKey];
  type: 'GENERAL' | 'REFUND' | 'ADDITIONAL';
  title: string;
  startDate: string;
  endDate?: string;
  refund: number;
  essentialContentsList: IContent[];
  additionalContentsList: IContent[];
  limitedContentsList: IContent[];
}
