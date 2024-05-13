export * from './Program.interface';
export * from './Mission.interface';

export type Status = 0 | 1;

export interface IAction {
  type: string;
}
export interface ItemWithStatus {
  status: Status;
}
