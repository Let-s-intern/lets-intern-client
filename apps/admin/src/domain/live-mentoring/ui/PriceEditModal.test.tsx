import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';

const updatePricesMock = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useUpdateAdminLiveMentoringPricesMutation: () => ({
    mutate: updatePricesMock,
    isPending: false,
  }),
}));

import PriceEditModal from './PriceEditModal';

const row: AdminLiveMentoring = {
  liveMentoringId: 10,
  mentorId: 21,
  mentorNickname: '렛츠멘토',
  mentorProfileImage: null,
  title: '이력서 피드백',
  status: 'APPROVED',
  categories: ['RESUME'],
  hasDetailPage: true,
  createDate: '2026-08-03T12:00:00',
  lastModifiedDate: '2026-08-03T12:00:00',
  currentOpening: null,
  upcomingParticipantCount: 0,
  mentorReviewCount: 0,
  priceOverrides: [{ duration: 30, price: 45000 }],
  defaultPrices: [
    { duration: 30, price: 39000 },
    { duration: 60, price: 69000 },
  ],
};

const renderModal = (
  overrides: Partial<AdminLiveMentoring> = {},
  handlers: { onClose?: () => void; onSaved?: () => void } = {},
) =>
  render(
    <PriceEditModal
      row={{ ...row, ...overrides }}
      onClose={handlers.onClose ?? vi.fn()}
      onSaved={handlers.onSaved ?? vi.fn()}
    />,
  );

const input = (duration: number) =>
  screen.getByLabelText(`${duration}분`) as HTMLInputElement;

afterEach(() => {
  updatePricesMock.mockReset();
});

describe('PriceEditModal', () => {
  it('조정값은 입력칸에, 기본 가격은 안내로 보여준다', () => {
    renderModal();

    expect(input(30)).toHaveValue('45000');
    expect(input(60)).toHaveValue('');
    expect(screen.getByText('기본 39,000원')).toBeInTheDocument();
    expect(screen.getByText('기본 69,000원')).toBeInTheDocument();
  });

  it('바꾼 것이 없으면 저장할 수 없다', () => {
    renderModal();

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('입력한 진행시간만 가격 목록으로 보낸다', () => {
    renderModal({ priceOverrides: [] });

    fireEvent.change(input(60), { target: { value: '80000' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updatePricesMock.mock.calls[0][0]).toEqual({
      mentorId: 21,
      prices: [{ duration: 60, price: 80000 }],
    });
  });

  it('숫자가 아닌 글자는 입력되지 않는다', () => {
    renderModal({ priceOverrides: [] });

    fireEvent.change(input(30), { target: { value: '4a5,000' } });

    expect(input(30)).toHaveValue('45000');
  });

  it('기본값으로를 누르면 입력칸이 비고 저장하면 그 진행시간은 목록에서 빠진다', () => {
    renderModal({
      priceOverrides: [
        { duration: 30, price: 45000 },
        { duration: 60, price: 80000 },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: '30분 기본값으로' }));
    expect(input(30)).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updatePricesMock.mock.calls[0][0]).toEqual({
      mentorId: 21,
      prices: [{ duration: 60, price: 80000 }],
    });
  });

  it('모두 기본값으로 돌리면 빈 목록으로 저장한다', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '30분 기본값으로' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updatePricesMock.mock.calls[0][0]).toEqual({
      mentorId: 21,
      prices: [],
    });
  });

  it('범위 밖 값은 저장 전에 안내하고 저장을 막는다', () => {
    renderModal({ priceOverrides: [] });

    fireEvent.change(input(30), { target: { value: '100001' } });
    expect(
      screen.getByText('1,000원 이상 100,000원 이하로 입력해주세요.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();

    fireEvent.change(input(30), { target: { value: '500' } });
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();

    // 60분은 상한이 다르다.
    fireEvent.change(input(30), { target: { value: '' } });
    fireEvent.change(input(60), { target: { value: '150000' } });
    expect(screen.getByRole('button', { name: '저장' })).toBeEnabled();
    expect(updatePricesMock).not.toHaveBeenCalled();
  });

  it('저장에 성공하면 onSaved 를 부른다', () => {
    const onSaved = vi.fn();
    updatePricesMock.mockImplementation((_vars, options) =>
      options.onSuccess(),
    );
    renderModal({ priceOverrides: [] }, { onSaved });

    fireEvent.change(input(30), { target: { value: '45000' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it('저장에 실패하면 서버 오류 메시지를 보여준다', () => {
    updatePricesMock.mockImplementation((_vars, options) =>
      options.onError(new Error('이미 다른 곳에서 수정되었습니다.')),
    );
    renderModal({ priceOverrides: [] });

    fireEvent.change(input(30), { target: { value: '45000' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByText('이미 다른 곳에서 수정되었습니다.'),
    ).toBeInTheDocument();
  });

  it('메시지가 없는 오류는 기본 문구를 보여준다', () => {
    updatePricesMock.mockImplementation((_vars, options) =>
      options.onError('boom'),
    );
    renderModal({ priceOverrides: [] });

    fireEvent.change(input(30), { target: { value: '45000' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByText('저장하지 못했습니다. 다시 시도해주세요.'),
    ).toBeInTheDocument();
  });

  it('옛 응답처럼 priceOverrides, defaultPrices 가 없어도 열린다', () => {
    renderModal({ priceOverrides: undefined, defaultPrices: undefined });

    expect(input(30)).toHaveValue('');
    expect(input(60)).toHaveValue('');
  });
});
