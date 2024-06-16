import { TABLE_STATUS, TABLE_CONTENT } from '../utils/convert';

export * from './Program.interface';
export * from './Application.interface';
export * from './Mission.interface';
export * from './Guide.interface';
export * from './Banner.interface';

export type StatusKey = keyof typeof TABLE_STATUS;
export type ContentTypeKey = keyof typeof TABLE_CONTENT;

export interface IAction {
  type: string;
}
export interface ItemWithStatus {
  status?: (typeof TABLE_STATUS)[StatusKey];
  [key: string]: any;
}
export type TableContent =
  | InputTableContent
  | DropdownTableContent
  | DateTableContent;

export interface InputTableContent {
  type: typeof TABLE_CONTENT.INPUT;
}

export interface DropdownTableContent {
  type: typeof TABLE_CONTENT.DROPDOWN;
  options: { id: string | number; title: string }[];
}

export interface DateTableContent {
  type: typeof TABLE_CONTENT.DATE;
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
