import { STATUS, TABLE_CONTENT } from '../utils/convert';
import { PROGRAM_CATEGORY } from '../utils/programConst';

export * from './Program.interface';
export * from './Application.interface';
export * from './Mission.interface';
export * from './Guide.interface';
export * from './Banner.interface';

export type StatusKey = keyof typeof STATUS;
export type ContentTypeKey = keyof typeof TABLE_CONTENT;
export type ProgramCategoryKey = keyof typeof PROGRAM_CATEGORY;

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
