import { CareerFormType } from '@/api/career/careerSchema';

export const DEFAULT_CAREER: CareerFormType = {
  company: '',
  job: '',
  employmentType: null,
  employmentTypeOther: '',
  startDate: '',
  endDate: '',
} as const;

export const DEFAULT_PAGE_INFO = {
  pageNum: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
} as const;

export const PAGE_SIZE = 10;
