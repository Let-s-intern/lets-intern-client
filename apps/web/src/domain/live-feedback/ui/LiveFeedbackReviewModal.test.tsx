/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import LiveFeedbackReviewModal from './LiveFeedbackReviewModal';

const mutate = jest.fn();

jest.mock('@/api/feedback/feedback', () => ({
  __esModule: true,
  usePatchFeedbackReview: () => ({ mutate, isPending: false }),
}));

const FEEDBACK_ID = 4242;

const renderModal = (props?: { isOpen?: boolean; mentorName?: string }) =>
  render(
    <LiveFeedbackReviewModal
      isOpen={props?.isOpen ?? true}
      onClose={jest.fn()}
      feedbackId={FEEDBACK_ID}
      mentorName={props?.mentorName}
    />,
  );

describe('LiveFeedbackReviewModal', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  beforeEach(() => {
    mutate.mockClear();
  });

  it('닫힌 상태에서는 아무것도 렌더하지 않는다', () => {
    renderModal({ isOpen: false });

    expect(
      screen.queryByText('오늘 멘토링, 뭘 가져가시나요?'),
    ).not.toBeInTheDocument();
  });

  it('멘토 평가가 아니라 본인 정리라는 점을 문구로 드러낸다', () => {
    renderModal({ mentorName: '김멘토' });

    expect(screen.getByText('오늘 멘토링, 뭘 가져가시나요?')).toBeVisible();
    expect(screen.getByText(/남기는 후기가\s*아니에요/)).toBeInTheDocument();
    expect(screen.getByText(/김멘토 멘토님께/)).toBeInTheDocument();
  });

  it('별점과 내용이 모두 채워지기 전에는 제출할 수 없다', () => {
    renderModal();

    const submit = screen.getByRole('button', { name: '정리 완료' });
    expect(submit).toBeDisabled();
    expect(
      screen.getByText('별점과 내용을 채우면 저장할 수 있어요.'),
    ).toBeInTheDocument();

    // 별점만 채운 상태 — 여전히 잠겨 있다.
    fireEvent.click(screen.getByAltText('별 4개'));
    expect(submit).toBeDisabled();
  });

  it('별점과 내용을 채우면 PATCH 페이로드로 저장한다', () => {
    renderModal();

    fireEvent.click(screen.getByAltText('별 4개'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '성과를 숫자로 못 쓰고 있었다.' },
    });

    fireEvent.click(screen.getByRole('button', { name: '정리 완료' }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({
      score: 4,
      review: '성과를 숫자로 못 쓰고 있었다.',
    });
  });

  it('공백만 입력한 내용은 제출로 인정하지 않는다', () => {
    renderModal();

    fireEvent.click(screen.getByAltText('별 5개'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '   ' },
    });

    expect(screen.getByRole('button', { name: '정리 완료' })).toBeDisabled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('"나중에 쓸게요"는 저장 없이 닫는다', () => {
    const onClose = jest.fn();
    render(
      <LiveFeedbackReviewModal
        isOpen
        onClose={onClose}
        feedbackId={FEEDBACK_ID}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '나중에 쓸게요' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });
});
