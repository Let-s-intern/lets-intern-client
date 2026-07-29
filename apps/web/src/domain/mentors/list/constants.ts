export const CONCERN_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'cover-letter', label: '자소서 준비' },
  { value: 'interview', label: '면접 준비' },
  { value: 'engineering-job', label: '이공계 취업 전략' },
  { value: 'career-change', label: '커리어 전환' },
  { value: 'concern-6', label: '@@@' },
  { value: 'concern-7', label: '@@@' },
] as const;

export type ConcernFilterValue =
  (typeof CONCERN_FILTER_OPTIONS)[number]['value'];

export const JOB_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'pm-po', label: 'PM/PO' },
  { value: 'marketing', label: '마케팅' },
  { value: 'hr', label: 'HR' },
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'job-6', label: '직무명' },
  { value: 'job-7', label: '직무명' },
  { value: 'job-8', label: '직무명' },
  { value: 'job-9', label: '직무명' },
  { value: 'job-10', label: '직무명' },
  { value: 'job-11', label: '직무명' },
] as const;

export type JobFilterValue = (typeof JOB_FILTER_OPTIONS)[number]['value'];
