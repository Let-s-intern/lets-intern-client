import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';
import ConfirmActionDialog from './ConfirmActionDialog';

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
  currentOpening: {
    openingId: 100,
    status: 'OPEN',
    durationPrices: [{ duration: 30, price: 35000 }],
    openedAt: '2026-08-01T00:00:00',
    closedAt: null,
    closeReason: null,
    closedByUserId: null,
    createDate: '2026-08-01T00:00:00',
    lastModifiedDate: '2026-08-01T00:00:00',
  },
};

/**
 * 승인·반려 흐름이 자가승인 전환으로 사라져 강제 종료(close)만 남는다.
 * 승인/반려 문구가 다시 나타나지 않는지 확인해 회귀를 막는다.
 */
describe('ConfirmActionDialog', () => {
  it('강제 종료 액션만 렌더한다', () => {
    render(
      <ConfirmActionDialog
        action={{ type: 'close', row, openingId: 100 }}
        isPending={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByText('이 개설을 강제로 종료합니다.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '강제 종료' }),
    ).toBeInTheDocument();
  });

  it('승인·반려 문구는 더 이상 나타나지 않는다', () => {
    render(
      <ConfirmActionDialog
        action={{ type: 'close', row, openingId: 100 }}
        isPending={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.queryByText(/승인하면 이 상품이 곧바로 오픈됩니다/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('이 상품을 반려합니다.')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '승인하고 오픈' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '반려' }),
    ).not.toBeInTheDocument();
  });

  /**
   * 슬롯 오픈 전환으로 개설에 모집 기간이 없어졌다. 대신 종료가 등록된 일정을
   * 지운다는 사실을 운영자가 확인하고 넘어가야 한다.
   */
  it('기간 대신 슬롯 삭제 경고와 가격을 보여준다', () => {
    render(
      <ConfirmActionDialog
        action={{ type: 'close', row, openingId: 100 }}
        isPending={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        '종료하면 등록한 일정이 모두 삭제됩니다. 다시 열 때 일정을 새로 등록해야 합니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('30분 35,000원')).toBeInTheDocument();
    expect(screen.queryByText(/2026-08-01 ~ 2026-08-20/)).toBeNull();
  });

  it('action 이 null 이면 아무것도 렌더하지 않는다', () => {
    const { container } = render(
      <ConfirmActionDialog
        action={null}
        isPending={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
