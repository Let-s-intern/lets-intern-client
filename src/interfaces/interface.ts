export * from './Program.interface';
export * from './Mission.interface';

export type Status = 'S' | 'U'; // 테이블 컴포넌트에 사용 (S: 1번 이상 저장한 행, U: 새로 추가한 행)

export interface IAction {
  type: string;
}
export interface ItemWithStatus {
  status: Status;
}
