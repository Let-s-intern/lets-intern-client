/**
 * Component tests for MenteeInfo submission entry-point branching.
 *
 * - 링크형(link 존재): 외부 링크 "제출물 보기"
 * - 경험정리형(link 없음·userId 존재): "경험 보기" 버튼 → onViewExperience
 * - 제출됐으나 link·userId 둘 다 없음: "제출물 없음" 안내
 * - 미제출(ABSENT): 어떤 진입점도 노출 안 함
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenteeInfo from '../ui/MenteeInfo';

const base = {
  name: '홍길동',
  status: 'PRESENT' as const,
  feedbackStatus: 'WAITING' as const,
};

describe('MenteeInfo 제출물 진입점', () => {
  it('링크형: 외부 링크 "제출물 보기"를 노출한다', () => {
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: 'https://notion.so/x' }}
      />,
    );

    const link = screen.getByRole('link', { name: /제출물 보기/ });
    expect(link).toHaveAttribute('href', 'https://notion.so/x');
  });

  it('경험정리형: "경험 보기" 버튼이 onViewExperience를 호출한다', async () => {
    const onViewExperience = vi.fn();
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: null }}
        onViewExperience={onViewExperience}
      />,
    );

    const button = screen.getByRole('button', { name: /경험 보기/ });
    await userEvent.click(button);

    expect(onViewExperience).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('link', { name: /제출물 보기/ })).toBeNull();
  });

  it('제출됐으나 link·userId 모두 없음: "제출물 없음" 안내', () => {
    render(
      <MenteeInfo mentee={{ ...base, id: 1, userId: null, link: null }} />,
    );

    expect(screen.getByText('제출물 없음')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /경험 보기/ })).toBeNull();
  });

  it('미제출(ABSENT): 제출물/경험 진입점을 노출하지 않는다', () => {
    render(
      <MenteeInfo
        mentee={{ ...base, id: null, userId: 2, status: 'ABSENT', link: null }}
      />,
    );

    expect(screen.queryByRole('button', { name: /경험 보기/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /제출물 보기/ })).toBeNull();
    expect(screen.queryByText('제출물 없음')).toBeNull();
  });

  it('collapsed 모드에서도 경험 보기 버튼이 동작한다', async () => {
    const onViewExperience = vi.fn();
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: null }}
        collapsed
        onViewExperience={onViewExperience}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /경험 보기/ }));
    expect(onViewExperience).toHaveBeenCalledTimes(1);
  });
});
