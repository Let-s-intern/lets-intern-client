import type { OneTimeFormOptionSelectType } from '@/api/one-time-form/oneTimeFormSchema';

/** 편집 중인 옵션 하나. 입력 칸 그대로 두고, 저장할 때 A7 본문으로 바꾼다 */
export type OptionDraft = {
  /** 화면에서만 쓰는 고유 키. 저장 전 옵션은 ID 가 없어서 따로 둔다 */
  key: string;
  /** null 이면 아직 저장 안 된 옵션 */
  optionId: number | null;
  name: string;
  description: string;
  /** 원 단위 0 이상 정수 */
  additionalPrice: number;
  badge: string;
  isVisible: boolean;
};

export type OptionGroupDraft = {
  key: string;
  /** null 이면 아직 저장 안 된 그룹 */
  optionGroupId: number | null;
  title: string;
  description: string;
  selectType: OneTimeFormOptionSelectType;
  isRequired: boolean;
  options: OptionDraft[];
};

export type OptionGroupListState = {
  groups: OptionGroupDraft[];
  isDirty: boolean;
  /** 새 그룹·옵션 키를 만드는 순번 */
  nextKey: number;
};

export type OptionDraftErrors = {
  title?: string;
  description?: string;
  name?: string;
  additionalPrice?: string;
  badge?: string;
};

/** 그룹 키 또는 옵션 키별 오류. 빈 객체면 저장할 수 있다 */
export type OptionGroupListErrors = Record<string, OptionDraftErrors>;
