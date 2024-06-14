import { STATUS, TABLE_CONTENT } from '../utils/convert';

export * from './Program.interface';
export * from './Application.interface';
export * from './Mission.interface';
export * from './Guide.interface';
export * from './Banner.interface';

export type StatusKey = keyof typeof STATUS;
export type ContentTypeKey = keyof typeof TABLE_CONTENT;

export interface IAction {
  type: string;
}
export interface ItemWithStatus {
  status?: (typeof STATUS)[StatusKey];
  [key: string]: any;
}
export interface ITableContent {
  type: (typeof TABLE_CONTENT)[ContentTypeKey];
  options?: { id: string | number; title: string }[];
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

// 스프린트 4 ~
export interface IChallengeListRes {
  programList: {
    id: number;
    title: string;
    shortDesc: string;
    thumbnail: string; // link
    startDate: string; // "2024-06-14T13:23:15.987Z",
    endDate: string; // "2024-06-14T13:23:15.987Z",
    beginning: string; // "2024-06-14T13:23:15.987Z",
    deadline: string; // "2024-06-14T13:23:15.987Z",
    createDate: string; // "2024-06-14T13:23:15.987Z"
  }[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
