import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MentoringTypeCardField from '../MentoringTypeCardField';

/**
 * 탭 3 · 유형 소개 카드의 유형 드롭다운.
 *
 * 드롭다운은 멘토링 유형 enum 이 아니라 자유 문자열이지만, 유형이 6개로 늘면서(LC-3336)
 * 새 유형으로 카드를 만들 수 있게 선택지도 함께 늘렸다.
 */
describe('MentoringTypeCardField — 유형 드롭다운', () => {
  it('선택 안내 뒤로 유형 6개를 보여준다', () => {
    render(
      <MentoringTypeCardField items={[]} hashTags={[]} onChange={vi.fn()} />,
    );

    const options = within(
      screen.getByLabelText('1번 카드 유형 선택'),
    ).getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      '멘토링 유형을 선택해 주세요',
      '자기소개서',
      '이력서',
      '포트폴리오',
      '커리어 커피챗',
      '면접 준비, 모의 면접',
      '경험 정리',
    ]);
  });

  it('새 유형을 고르면 그 라벨이 카드의 typeName 으로 올라간다', () => {
    const onChange = vi.fn();
    render(
      <MentoringTypeCardField items={[]} hashTags={[]} onChange={onChange} />,
    );

    fireEvent.change(screen.getByLabelText('1번 카드 유형 선택'), {
      target: { value: '면접 준비, 모의 면접' },
    });

    expect(onChange).toHaveBeenCalledWith([
      {
        typeName: '면접 준비, 모의 면접',
        title: '',
        description: '',
        tags: [],
      },
    ]);
  });

  it('새 유형으로 다 채운 카드는 저장에서 빠진다는 경고가 없다', () => {
    render(
      <MentoringTypeCardField
        items={[
          {
            typeName: '경험 정리',
            title: '경험을 정리하고 싶다면',
            description: '역할과 성과를 뽑아 드려요',
            tags: [],
          },
        ]}
        hashTags={[]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('1번 카드 유형 선택')).toHaveValue(
      '경험 정리',
    );
    expect(screen.queryByText('모두 채워야 저장돼요')).not.toBeInTheDocument();
  });
});
