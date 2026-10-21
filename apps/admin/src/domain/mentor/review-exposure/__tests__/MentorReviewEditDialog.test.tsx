import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminMentorReview } from '@/api/mentor/mentorSchema';

const patch = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    patch: (...args: unknown[]) => patch(...args),
  },
}));

// mentor.ts 가 함께 import 하는 v2 인스턴스. 이 테스트는 쓰지 않는다
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

import MentorReviewEditDialog from '../ui/MentorReviewEditDialog';

const originalReview: AdminMentorReview = {
  source: 'REVIEW',
  sourceId: 11,
  type: 'LIVE_MENTORING',
  programTitle: '1:1 멘토링',
  score: 5,
  review: '원본 후기',
  originalScore: 5,
  originalReview: '원본 후기',
  isEdited: false,
  createDate: '2026-10-01T12:00:00',
  isExposed: true,
};

const editedReview: AdminMentorReview = {
  ...originalReview,
  score: 3.5,
  review: '고친 후기',
  isEdited: true,
};

const renderDialog = (review: AdminMentorReview, onClose = vi.fn()) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <MentorReviewEditDialog mentorId={7} review={review} onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
};

const contentInput = () =>
  screen.getByRole('textbox', { name: '후기 내용' }) as HTMLTextAreaElement;

afterEach(() => {
  patch.mockReset();
});

describe('MentorReviewEditDialog', () => {
  it('지금 나가는 값으로 채우고 원본을 함께 보인다', () => {
    renderDialog(editedReview);

    expect(contentInput().value).toBe('고친 후기');
    expect(screen.getByText('3.5')).toBeInTheDocument();
    expect(screen.getByText('원본 · 별점 5.0')).toBeInTheDocument();
    expect(screen.getByText('원본 후기')).toBeInTheDocument();
  });

  it('0.5 단위로 별점을 고치고, 바꾸지 않은 내용은 null 로 보낸다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const onClose = renderDialog(originalReview);

    fireEvent.click(screen.getByLabelText('4.5 Stars'));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(patch).toHaveBeenCalledWith('/admin/mentor/7/reviews/content', {
      source: 'REVIEW',
      sourceId: 11,
      score: 4.5,
      review: null,
    });
  });

  it('내용만 고치면 점수는 null 로 보낸다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    renderDialog(originalReview);

    fireEvent.change(contentInput(), { target: { value: '오탈자 고친 후기' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    expect(patch.mock.calls[0][1]).toEqual({
      source: 'REVIEW',
      sourceId: 11,
      score: null,
      review: '오탈자 고친 후기',
    });
  });

  it('내용을 비우면 저장할 수 없다', () => {
    renderDialog(originalReview);

    fireEvent.change(contentInput(), { target: { value: '   ' } });

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('내용은 2000자에서 자른다', () => {
    renderDialog(originalReview);

    fireEvent.change(contentInput(), { target: { value: '가'.repeat(2100) } });

    expect(contentInput().value).toHaveLength(2000);
    expect(screen.getByText('2000 / 2000')).toBeInTheDocument();
  });

  it('수정된 후기만 원본으로 되돌리기를 보이고, 누르면 둘 다 null 로 보낸다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const onClose = renderDialog(editedReview);

    fireEvent.click(screen.getByRole('button', { name: '원본으로 되돌리기' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(patch.mock.calls[0][1]).toEqual({
      source: 'REVIEW',
      sourceId: 11,
      score: null,
      review: null,
    });
  });

  it('수정 전 후기에는 원본으로 되돌리기가 없다', () => {
    renderDialog(originalReview);

    expect(
      screen.queryByRole('button', { name: '원본으로 되돌리기' }),
    ).not.toBeInTheDocument();
  });

  it('저장이 실패하면 닫지 않고 오류 문구를 보인다', async () => {
    patch.mockRejectedValue(new Error('500'));
    const onClose = renderDialog(originalReview);

    fireEvent.change(contentInput(), { target: { value: '고친 후기' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '저장하지 못했습니다.',
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
