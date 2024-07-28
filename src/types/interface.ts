import { TABLE_STATUS } from '../utils/convert';

export * from './Banner.interface';
export * from './Mission.interface';
export * from './Program.interface';

export type StatusKey = keyof typeof TABLE_STATUS;

export interface IApplyDrawerAction {
  type: 'toggle' | 'close' | 'open';
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

export interface ICouponForm {
  id: number | null;
  price: number;
}
