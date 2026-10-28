import { describe, expect, it } from 'vitest';

import {
  type AdminOneTimeFormOptionGroup,
  saveOneTimeFormOptionGroupsRequestSchema,
} from '@/api/one-time-form/oneTimeFormSchema';

import type { OptionGroupListState } from '../types/optionGroupDraft';
import {
  initOptionGroupListState,
  type OptionGroupListAction,
  optionGroupListReducer,
  toOptionGroupsRequest,
} from './optionGroupListReducer';

/** 계약 9절 A3 예시의 옵션 그룹 */
const participation: AdminOneTimeFormOptionGroup = {
  optionGroupId: 31,
  title: '참여 방식을 골라 주세요',
  description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
  selectType: 'SINGLE',
  isRequired: true,
  sortOrder: 0,
  options: [
    {
      optionId: 312,
      name: '오프라인 현장 참여',
      description: '현장 네트워킹 포함',
      additionalPrice: 10000,
      badge: '추천',
      isVisible: true,
      sortOrder: 1,
    },
    {
      optionId: 311,
      name: '온라인 라이브',
      description: 'Zoom 링크로 참여',
      additionalPrice: 0,
      badge: null,
      isVisible: true,
      sortOrder: 0,
    },
  ],
};

const addOn: AdminOneTimeFormOptionGroup = {
  optionGroupId: 32,
  title: '함께 신청하면 좋아요',
  description: null,
  selectType: 'MULTIPLE',
  isRequired: false,
  sortOrder: 1,
  options: [
    {
      optionId: 321,
      name: '녹화본 다시보기',
      description: null,
      additionalPrice: 5000,
      badge: null,
      isVisible: false,
      sortOrder: 0,
    },
  ],
};

const run = (
  state: OptionGroupListState,
  ...actions: OptionGroupListAction[]
) => actions.reduce(optionGroupListReducer, state);

const groupKey = (state: OptionGroupListState, index: number) =>
  state.groups[index].key;

const optionKey = (state: OptionGroupListState, g: number, o: number) =>
  state.groups[g].options[o].key;

describe('optionGroupListReducer', () => {
  it('그룹과 옵션을 sortOrder 순서로 시작하고 숨긴 옵션도 둔다', () => {
    const state = initOptionGroupListState([addOn, participation]);
    expect(state.groups.map((g) => g.optionGroupId)).toEqual([31, 32]);
    expect(state.groups[0].options.map((o) => o.optionId)).toEqual([311, 312]);
    expect(state.groups[1].options[0].isVisible).toBe(false);
    expect(state.isDirty).toBe(false);
  });

  it('옵션을 지우고 새 옵션을 채우면 계약 A7 예시와 같은 본문이 된다', () => {
    let state = initOptionGroupListState([participation]);
    const g = groupKey(state, 0);
    state = run(
      state,
      { type: 'removeOption', groupKey: g, optionKey: optionKey(state, 0, 1) },
      { type: 'addOption', groupKey: g },
    );
    state = run(state, {
      type: 'updateOption',
      groupKey: g,
      optionKey: optionKey(state, 0, 1),
      patch: { name: ' 현장 + 뒤풀이 ', additionalPrice: 15000, badge: '신규' },
    });

    const body = toOptionGroupsRequest(state);
    // 계약 9절 A7 요청 예시 그대로
    expect(body).toEqual({
      optionGroups: [
        {
          optionGroupId: 31,
          title: '참여 방식을 골라 주세요',
          description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
          selectType: 'SINGLE',
          isRequired: true,
          options: [
            {
              optionId: 311,
              name: '온라인 라이브',
              description: 'Zoom 링크로 참여',
              additionalPrice: 0,
              badge: null,
              isVisible: true,
            },
            {
              optionId: null,
              name: '현장 + 뒤풀이',
              description: null,
              additionalPrice: 15000,
              badge: '신규',
              isVisible: true,
            },
          ],
        },
      ],
    });
    expect(
      saveOneTimeFormOptionGroupsRequestSchema.safeParse(body).success,
    ).toBe(true);
    expect(state.isDirty).toBe(true);
  });

  it('새 그룹은 옵션 칸 하나와 함께 생기고 ID 없이 보낸다', () => {
    const state = run(initOptionGroupListState([]), { type: 'addGroup' });
    const g = groupKey(state, 0);
    const next = run(
      state,
      {
        type: 'updateGroup',
        groupKey: g,
        patch: { title: '플랜', selectType: 'MULTIPLE', isRequired: true },
      },
      { type: 'addOption', groupKey: g },
    );

    const [group] = toOptionGroupsRequest(next).optionGroups;
    expect(group).toMatchObject({
      optionGroupId: null,
      title: '플랜',
      description: null,
      selectType: 'MULTIPLE',
      isRequired: true,
    });
    expect(group.options).toHaveLength(2);
    expect(group.options.every((o) => o.optionId === null)).toBe(true);
    // 화면 키는 서로 겹치지 않는다
    const keys = [g, ...next.groups[0].options.map((o) => o.key)];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('그룹을 지우면 본문에서 빠진다(서버가 소프트 삭제)', () => {
    let state = initOptionGroupListState([participation, addOn]);
    state = run(state, { type: 'removeGroup', groupKey: groupKey(state, 0) });
    expect(
      toOptionGroupsRequest(state).optionGroups.map((g) => g.optionGroupId),
    ).toEqual([32]);
  });

  it('그룹과 옵션 순서를 바꾸면 배열 순서가 바뀐다', () => {
    let state = initOptionGroupListState([participation, addOn]);
    state = run(state, { type: 'moveGroup', from: 0, to: 1 });
    expect(state.groups.map((g) => g.optionGroupId)).toEqual([32, 31]);

    state = run(state, {
      type: 'moveOption',
      groupKey: groupKey(state, 1),
      from: 1,
      to: 0,
    });
    expect(state.groups[1].options.map((o) => o.optionId)).toEqual([312, 311]);
  });

  it('범위를 벗어난 이동은 무시한다', () => {
    const state = initOptionGroupListState([participation, addOn]);
    const moved = run(state, { type: 'moveGroup', from: 0, to: -1 });
    expect(moved.groups.map((g) => g.optionGroupId)).toEqual([31, 32]);
  });

  it('음수·소수 추가 금액은 받지 않고 0원은 받는다', () => {
    let state = initOptionGroupListState([participation]);
    const g = groupKey(state, 0);
    const o = optionKey(state, 0, 1);
    const update = (additionalPrice: number): OptionGroupListAction => ({
      type: 'updateOption',
      groupKey: g,
      optionKey: o,
      patch: { additionalPrice },
    });

    expect(run(state, update(-1000))).toBe(state);
    expect(run(state, update(100.5))).toBe(state);

    state = run(state, update(0));
    expect(state.groups[0].options[1].additionalPrice).toBe(0);
    expect(
      toOptionGroupsRequest(state).optionGroups[0].options[1],
    ).toMatchObject({ optionId: 312, additionalPrice: 0 });
  });

  it('노출을 끄면 isVisible false 로 보낸다', () => {
    let state = initOptionGroupListState([participation]);
    state = run(state, {
      type: 'updateOption',
      groupKey: groupKey(state, 0),
      optionKey: optionKey(state, 0, 0),
      patch: { isVisible: false },
    });
    expect(
      toOptionGroupsRequest(state).optionGroups[0].options[0].isVisible,
    ).toBe(false);
  });

  it('reset 은 저장 응답으로 다시 시작하고 dirty 를 끈다', () => {
    let state = run(initOptionGroupListState([]), { type: 'addGroup' });
    state = run(state, { type: 'reset', optionGroups: [participation] });
    expect(state.groups.map((g) => g.optionGroupId)).toEqual([31]);
    expect(state.isDirty).toBe(false);
  });
});
