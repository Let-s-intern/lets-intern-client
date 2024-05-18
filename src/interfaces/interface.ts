import { STATUS, TABLE_CONTENT } from '../utils/convert';

export * from './Program.interface';
export * from './Mission.interface';

export type StatusKey = keyof typeof STATUS;
export type ContentTypeKey = keyof typeof TABLE_CONTENT;

export interface IAction {
  type: string;
}
export interface ItemWithStatus {
  status: (typeof STATUS)[StatusKey];
  [key: string]: any;
}
export interface ITableContent {
  type: (typeof TABLE_CONTENT)[ContentTypeKey];
  options?: { id: string | number; title: string }[];
}
