import { Status } from './interface';

export interface IMissionTemplate {
  [key: string]: string | number;
  status: Status;
  id: number;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
  createdAt: string;
}
