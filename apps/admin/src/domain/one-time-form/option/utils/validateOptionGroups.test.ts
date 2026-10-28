import { describe, expect, it } from 'vitest';

import type { OptionDraft, OptionGroupDraft } from '../types/optionGroupDraft';
import { validateOptionGroups } from './validateOptionGroups';

const option = (patch: Partial<OptionDraft> = {}): OptionDraft => ({
  key: 'o-1',
  optionId: 1,
  name: '온라인 라이브',
  description: '',
  additionalPrice: 0,
  badge: '',
  isVisible: true,
  ...patch,
});

const group = (patch: Partial<OptionGroupDraft> = {}): OptionGroupDraft => ({
  key: 'g-1',
  optionGroupId: 1,
  title: '참여 방식',
  description: '',
  selectType: 'SINGLE',
  isRequired: true,
  options: [option()],
  ...patch,
});

describe('validateOptionGroups', () => {
  it('0원 옵션과 빈 설명·배지는 저장할 수 있다', () => {
    expect(validateOptionGroups([group()])).toEqual({});
  });

  it('비어 있는 그룹 제목과 옵션 이름을 그룹·옵션 키로 알린다', () => {
    expect(
      validateOptionGroups([
        group({ title: '  ', options: [option({ name: '' })] }),
      ]),
    ).toEqual({
      'g-1': { title: '그룹 제목을 입력해 주세요.' },
      'o-1': { name: '옵션 이름을 입력해 주세요.' },
    });
  });

  it('계약 5.6 길이 제한과 음수 금액을 막는다', () => {
    const errors = validateOptionGroups([
      group({
        description: 'a'.repeat(301),
        options: [
          option({
            name: 'a'.repeat(101),
            description: 'a'.repeat(201),
            badge: 'a'.repeat(21),
            additionalPrice: -1,
          }),
        ],
      }),
    ]);
    expect(errors['g-1']).toEqual({
      description: '300자 이하로 입력해 주세요.',
    });
    expect(errors['o-1']).toEqual({
      name: '100자 이하로 입력해 주세요.',
      description: '200자 이하로 입력해 주세요.',
      badge: '20자 이하로 입력해 주세요.',
      additionalPrice: '0원 이상 정수로 입력해 주세요.',
    });
  });
});
