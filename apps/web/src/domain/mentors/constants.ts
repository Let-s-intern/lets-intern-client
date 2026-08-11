export const CONCERN_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'cover-letter', label: '자소서 준비' },
  { value: 'interview', label: '면접 준비' },
  { value: 'engineering-job', label: '이공계 취업 전략' },
  { value: 'career-change', label: '커리어 전환' },
  { value: 'concern-6', label: '음음..' },
  { value: 'concern-7', label: '음음음..' },
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
  { value: 'job-6', label: '6번직무' },
  { value: 'job-7', label: '7번직무' },
  { value: 'job-8', label: '8번직무' },
  { value: 'job-9', label: '9번직무' },
] as const;

export type JobFilterValue = (typeof JOB_FILTER_OPTIONS)[number]['value'];

export type MentorTagValue = Exclude<
  ConcernFilterValue | JobFilterValue,
  'all'
>;

const TAG_OPTIONS = [...JOB_FILTER_OPTIONS, ...CONCERN_FILTER_OPTIONS];

export const getTagLabel = (tag: MentorTagValue): string =>
  TAG_OPTIONS.find((option) => option.value === tag)?.label ?? tag;
