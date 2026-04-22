import { LeadHistoryEventType } from '@/api/lead';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

export type LeadHistoryRow = {
  id: string;
  phoneNum: string | null;
  displayPhoneNum: string;
  name: string | null;
  email: string | null;
  inflow: string | null;
  university: string | null;
  major: string | null;
  wishField: string | null;
  wishCompany: string | null;
  wishIndustry: string | null;
  wishJob: string | null;
  jobStatus: string | null;
  instagramId: string | null;
  marketingAgree: boolean | null;
  eventType?: LeadHistoryEventType;
  magnetId?: number | null;
  magnetType?: string | null;
  userId?: number | null;
  title?: string | null;
  finalPrice?: number | null;
  createDate?: string | null;
};

export type LeadHistoryFilterField =
  | 'magnet'
  | 'program'
  | 'magnetType'
  | 'marketingAgree'
  | 'membership';

export type LeadHistoryFilterOperator = 'include' | 'exclude';
export type LeadHistoryFilterCombinator = 'AND' | 'OR';

export type LeadHistoryFilterConditionNode = {
  id: string;
  type: 'condition';
  field: LeadHistoryFilterField;
  operator: LeadHistoryFilterOperator;
  values: string[];
};

export type LeadHistoryFilterGroupNode = {
  id: string;
  type: 'group';
  combinator: LeadHistoryFilterCombinator;
  children: LeadHistoryFilterNode[];
};

export type LeadHistoryFilterNode =
  | LeadHistoryFilterGroupNode
  | LeadHistoryFilterConditionNode;

export type StoredLeadHistoryFilterConditionNode = {
  type: 'condition';
  field: LeadHistoryFilterField;
  operator: LeadHistoryFilterOperator;
  values?: string[];
};

export type StoredLeadHistoryFilterGroupNode = {
  type: 'group';
  combinator: LeadHistoryFilterCombinator;
  children?: StoredLeadHistoryFilterNode[];
};

export type StoredLeadHistoryFilterNode =
  | StoredLeadHistoryFilterConditionNode
  | StoredLeadHistoryFilterGroupNode;

export type LeadHistoryGroupSummary = {
  magnetIds: Set<string>;
  magnetTypes: Set<string>;
  programTitles: Set<string>;
  hasSignedUp: boolean;
  hasMarketingAgreement: boolean;
};

/** 전화번호별 1행으로 사전 집계된 테이블 행 */
export type AggregatedLeadRow = {
  id: string;
  displayPhoneNum: string;
  name: string;
  grade: string;
  wishField: string;
  wishJob: string;
  wishIndustry: string;
  wishCompany: string;
  programHistory: string;
  magnetHistory: string;
  marketingAgree: boolean | null;
};

export type SelectOption = { value: string; label: string };

export const FILTER_QUERY_KEY = 'filters';

export const membershipOptions: SelectOption[] = [
  { value: 'signedUp', label: '회원가입' },
  { value: 'notSignedUp', label: '미가입' },
];

export const marketingAgreeOptions: SelectOption[] = [
  { value: 'agreed', label: '마케팅 동의' },
  { value: 'notAgreed', label: '미동의' },
];

export const marketingAgreeLabelMap = new Map(
  marketingAgreeOptions.map(({ value, label }) => [value, label]),
);

export const filterFieldDefinitions: Record<
  LeadHistoryFilterField,
  { label: string; valueLabel: string }
> = {
  magnet: { label: '마그넷', valueLabel: '마그넷 선택' },
  program: { label: '프로그램', valueLabel: '프로그램 선택' },
  magnetType: { label: '마그넷 타입', valueLabel: '타입 선택' },
  marketingAgree: {
    label: '마케팅 동의 여부',
    valueLabel: '마케팅 동의 여부 선택',
  },
  membership: { label: '회원가입 여부', valueLabel: '회원가입 여부 선택' },
};

export const filterOperatorOptions: Array<{
  value: LeadHistoryFilterOperator;
  label: string;
}> = [
  { value: 'include', label: '하나라도 있음' },
  { value: 'exclude', label: '하나도 없음' },
];

export const operatorLockedFields = new Set<LeadHistoryFilterField>([
  'membership',
  'marketingAgree',
]);
