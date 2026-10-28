import type {
  AdminOneTimeFormOption,
  AdminOneTimeFormOptionGroup,
  SaveOneTimeFormOptionGroupsRequest,
} from '@/api/one-time-form/oneTimeFormSchema';

import type {
  OptionDraft,
  OptionGroupDraft,
  OptionGroupListState,
} from '../types/optionGroupDraft';

type GroupPatch = Partial<
  Pick<OptionGroupDraft, 'title' | 'description' | 'selectType' | 'isRequired'>
>;

export type OptionPatch = Partial<
  Pick<
    OptionDraft,
    'name' | 'description' | 'additionalPrice' | 'badge' | 'isVisible'
  >
>;

export type OptionGroupListAction =
  | { type: 'reset'; optionGroups: AdminOneTimeFormOptionGroup[] }
  | { type: 'addGroup' }
  | { type: 'updateGroup'; groupKey: string; patch: GroupPatch }
  | { type: 'removeGroup'; groupKey: string }
  | { type: 'moveGroup'; from: number; to: number }
  | { type: 'addOption'; groupKey: string }
  | {
      type: 'updateOption';
      groupKey: string;
      optionKey: string;
      patch: OptionPatch;
    }
  | { type: 'removeOption'; groupKey: string; optionKey: string }
  | { type: 'moveOption'; groupKey: string; from: number; to: number };

const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) =>
  a.sortOrder - b.sortOrder;

const toOptionDraft = (option: AdminOneTimeFormOption): OptionDraft => ({
  key: `o-${option.optionId}`,
  optionId: option.optionId,
  name: option.name,
  description: option.description ?? '',
  additionalPrice: option.additionalPrice,
  badge: option.badge ?? '',
  isVisible: option.isVisible,
});

const toGroupDraft = (
  group: AdminOneTimeFormOptionGroup,
): OptionGroupDraft => ({
  key: `g-${group.optionGroupId}`,
  optionGroupId: group.optionGroupId,
  title: group.title,
  description: group.description ?? '',
  selectType: group.selectType,
  isRequired: group.isRequired,
  options: [...group.options].sort(bySortOrder).map(toOptionDraft),
});

/** A3·A7 `optionGroups` 로 시작 상태를 만든다. 숨긴 옵션도 편집할 수 있게 그대로 둔다 */
export const initOptionGroupListState = (
  optionGroups: AdminOneTimeFormOptionGroup[],
): OptionGroupListState => ({
  groups: [...optionGroups].sort(bySortOrder).map(toGroupDraft),
  isDirty: false,
  nextKey: 0,
});

/** 계약 5.6. 원 단위 0 이상 정수 */
export const isValidPrice = (price: number) =>
  Number.isInteger(price) && price >= 0;

const moveItem = <T>(items: T[], from: number, to: number): T[] => {
  if (from === to || to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const newOption = (nextKey: number): OptionDraft => ({
  key: `new-o-${nextKey}`,
  optionId: null,
  name: '',
  description: '',
  additionalPrice: 0,
  badge: '',
  isVisible: true,
});

const updateGroup = (
  state: OptionGroupListState,
  groupKey: string,
  update: (group: OptionGroupDraft) => OptionGroupDraft,
): OptionGroupListState => ({
  ...state,
  isDirty: true,
  groups: state.groups.map((group) =>
    group.key === groupKey ? update(group) : group,
  ),
});

export const optionGroupListReducer = (
  state: OptionGroupListState,
  action: OptionGroupListAction,
): OptionGroupListState => {
  switch (action.type) {
    case 'reset':
      return initOptionGroupListState(action.optionGroups);
    case 'addGroup':
      // 빈 그룹은 쓸 데가 없어서 옵션 칸 하나를 함께 준다
      return {
        ...state,
        isDirty: true,
        nextKey: state.nextKey + 2,
        groups: [
          ...state.groups,
          {
            key: `new-g-${state.nextKey}`,
            optionGroupId: null,
            title: '',
            description: '',
            selectType: 'SINGLE',
            isRequired: false,
            options: [newOption(state.nextKey + 1)],
          },
        ],
      };
    case 'updateGroup':
      return updateGroup(state, action.groupKey, (g) => ({
        ...g,
        ...action.patch,
      }));
    case 'removeGroup':
      return {
        ...state,
        isDirty: true,
        groups: state.groups.filter((g) => g.key !== action.groupKey),
      };
    case 'moveGroup':
      return {
        ...state,
        isDirty: true,
        groups: moveItem(state.groups, action.from, action.to),
      };
    case 'addOption':
      return {
        ...updateGroup(state, action.groupKey, (g) => ({
          ...g,
          options: [...g.options, newOption(state.nextKey)],
        })),
        nextKey: state.nextKey + 1,
      };
    case 'updateOption': {
      const { additionalPrice } = action.patch;
      // 음수·소수 금액은 상태에 들이지 않는다. 0 은 받는다
      if (additionalPrice !== undefined && !isValidPrice(additionalPrice)) {
        return state;
      }
      return updateGroup(state, action.groupKey, (g) => ({
        ...g,
        options: g.options.map((o) =>
          o.key === action.optionKey ? { ...o, ...action.patch } : o,
        ),
      }));
    }
    case 'removeOption':
      return updateGroup(state, action.groupKey, (g) => ({
        ...g,
        options: g.options.filter((o) => o.key !== action.optionKey),
      }));
    case 'moveOption':
      return updateGroup(state, action.groupKey, (g) => ({
        ...g,
        options: moveItem(g.options, action.from, action.to),
      }));
  }
};

const trimToNull = (value: string) => value.trim() || null;

/**
 * A7 본문. 배열 순서가 sortOrder 라서 sortOrder 는 보내지 않는다.
 * 빠진 저장된 그룹·옵션은 서버가 소프트 삭제한다. 결제된 옵션은 숨김으로 돌아온다.
 */
export const toOptionGroupsRequest = (
  state: OptionGroupListState,
): SaveOneTimeFormOptionGroupsRequest => ({
  optionGroups: state.groups.map((g) => ({
    optionGroupId: g.optionGroupId,
    title: g.title.trim(),
    description: trimToNull(g.description),
    selectType: g.selectType,
    isRequired: g.isRequired,
    options: g.options.map((o) => ({
      optionId: o.optionId,
      name: o.name.trim(),
      description: trimToNull(o.description),
      additionalPrice: o.additionalPrice,
      badge: trimToNull(o.badge),
      isVisible: o.isVisible,
    })),
  })),
});
