import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HeroField from '../HeroField';
import MentoringTypesField from '../MentoringTypesField';

describe('HeroField', () => {
  it('소개 문구를 추가·삭제·수정한다', () => {
    const onChange = vi.fn();
    render(
      <HeroField value={{ bullets: ['하나', '둘'] }} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: '소개 문구 추가 +' }));
    expect(onChange).toHaveBeenLastCalledWith({ bullets: ['하나', '둘', ''] });

    fireEvent.click(screen.getAllByRole('button', { name: '삭제' })[0]);
    expect(onChange).toHaveBeenLastCalledWith({ bullets: ['둘'] });

    fireEvent.change(screen.getByLabelText('소개 문구 2'), {
      target: { value: '셋' },
    });
    expect(onChange).toHaveBeenLastCalledWith({ bullets: ['하나', '셋'] });
  });
});

describe('MentoringTypesField', () => {
  const value = {
    title: '제목',
    subtitle: '설명',
    items: [
      { typeName: '자소서', title: '카드', description: '설명', tags: [] },
    ],
  };

  it('유형 카드를 추가·삭제한다', () => {
    const onChange = vi.fn();
    render(<MentoringTypesField value={value} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: '유형 추가 +' }));
    expect(onChange.mock.lastCall?.[0].items).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onChange.mock.lastCall?.[0].items).toEqual([]);
  });

  it('태그는 쉼표로 나눈다', () => {
    const onChange = vi.fn();
    render(<MentoringTypesField value={value} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('관련 태그 (쉼표로 구분)'), {
      target: { value: '서류,면접' },
    });
    expect(onChange.mock.lastCall?.[0].items[0].tags).toEqual(['서류', '면접']);
  });
});
