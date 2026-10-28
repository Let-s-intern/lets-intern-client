import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { OptionGroupDraft } from '../option/types/optionGroupDraft';
import { DEFAULT_ONE_TIME_FORM_SETTINGS } from '../utils/oneTimeFormSettingsValues';
import ApplyPreviewAside, { OPTION_CHANGE_NOTICE } from './ApplyPreviewAside';

const paidValues = {
  ...DEFAULT_ONE_TIME_FORM_SETTINGS,
  title: '포트폴리오 집중 클래스',
  scheduleText: '11.15(토) 14:00',
  isPaid: true,
  basePrice: 29000,
};

const group = (
  options: Partial<OptionGroupDraft['options'][number]>[],
): OptionGroupDraft => ({
  key: 'g-31',
  optionGroupId: 31,
  title: '참여 방식을 골라 주세요',
  description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
  selectType: 'SINGLE',
  isRequired: true,
  options: options.map((patch, i) => ({
    key: `o-${i}`,
    optionId: i,
    name: `옵션 ${i}`,
    description: '',
    additionalPrice: 0,
    badge: '',
    isVisible: true,
    ...patch,
  })),
});

describe('ApplyPreviewAside', () => {
  it('노출 옵션에 추가 금액이 있으면 "N원부터", 금액·배지·설명을 보여 준다', () => {
    render(
      <ApplyPreviewAside
        values={paidValues}
        optionGroups={[
          group([
            { name: '온라인 라이브', description: 'Zoom 링크로 참여' },
            {
              name: '오프라인 현장 참여',
              additionalPrice: 10000,
              badge: '추천',
            },
          ]),
        ]}
        applicationCount={0}
      />,
    );

    expect(
      screen.getByText('11.15(토) 14:00 · 29,000원부터'),
    ).toBeInTheDocument();
    expect(screen.getByText('참여 방식을 골라 주세요')).toBeInTheDocument();
    expect(screen.getByText('Zoom 링크로 참여')).toBeInTheDocument();
    expect(screen.getByText('추가 금액 없음')).toBeInTheDocument();
    expect(screen.getByText('+10,000원')).toBeInTheDocument();
    expect(screen.getByText('추천')).toBeInTheDocument();
    expect(screen.queryByText(OPTION_CHANGE_NOTICE)).not.toBeInTheDocument();
  });

  it('숨긴 옵션은 보이지 않고 금액 계산에서도 빠진다', () => {
    render(
      <ApplyPreviewAside
        values={paidValues}
        optionGroups={[
          group([
            { name: '온라인 라이브' },
            { name: '숨긴 옵션', additionalPrice: 10000, isVisible: false },
          ]),
        ]}
        applicationCount={0}
      />,
    );

    expect(screen.queryByText('숨긴 옵션')).not.toBeInTheDocument();
    expect(screen.getByText('11.15(토) 14:00 · 29,000원')).toBeInTheDocument();
  });

  it('노출 옵션이 없는 그룹은 통째로 빠진다', () => {
    render(
      <ApplyPreviewAside
        values={paidValues}
        optionGroups={[group([{ isVisible: false }])]}
        applicationCount={0}
      />,
    );
    expect(
      screen.queryByText('참여 방식을 골라 주세요'),
    ).not.toBeInTheDocument();
  });

  it('무료 폼은 금액과 옵션을 보이지 않는다', () => {
    render(
      <ApplyPreviewAside
        values={{ ...paidValues, isPaid: false }}
        optionGroups={[group([{ name: '온라인 라이브' }])]}
        applicationCount={0}
      />,
    );
    expect(screen.queryByText(/29,000원/)).not.toBeInTheDocument();
    expect(screen.queryByText('온라인 라이브')).not.toBeInTheDocument();
  });

  it('신청자가 있으면 옵션 변경 안내를 붙인다', () => {
    render(
      <ApplyPreviewAside
        values={paidValues}
        optionGroups={[]}
        applicationCount={2}
      />,
    );
    expect(screen.getByText(OPTION_CHANGE_NOTICE)).toBeInTheDocument();
  });
});
