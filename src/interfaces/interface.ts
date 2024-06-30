import { TABLE_CONTENT, TABLE_STATUS } from '../utils/convert';

export * from './Banner.interface';
export * from './Mission.interface';
export * from './Program.interface';

export type StatusKey = keyof typeof TABLE_STATUS;
type ContentTypeKey = keyof typeof TABLE_CONTENT;

export interface IAction {
  type: string;
}


export interface IPageable {
  page: number;
  size: number;
}
export interface IPageInfo {
  pageNum: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResonse {
  status: number;
  message: string;
}