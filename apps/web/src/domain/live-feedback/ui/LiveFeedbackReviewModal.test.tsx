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
      screen.queryByText('오늘 멘토링, 무엇을 얻으셨나요?'),
    ).not.toBeInTheDocument();
  });

  /**
   * "멘토님께 후기를 남겨주세요"로 물으면 멘티에게는 쓸 이유가 없다.
   * "무엇을 알게 되었는지"를 묻는 형태를 유지하는지 고정한다.
   */
  it('멘토 평가가 아니라 "무엇을 알게 되었는지"를 묻는다', () => {
    renderModal({ mentorName: '김멘토' });

    expect(screen.getByText('오늘 멘토링, 무엇을 얻으셨나요?')).toBeVisible();
    expect(
      screen.getByText('멘토링을 통해 새롭게 알게 된 점을 작성해주세요'),
    ).toBeInTheDocument();
    expect(screen.getByText(/김멘토 멘토님과의/)).toBeInTheDocument();

    // 동기를 깎는 부정형 문구가 다시 들어오지 않게 막는다.
    expect(screen.queryByText(/후기가 아니에요/)).not.toBeInTheDocument();
  });

  it('별점과 내용이 모두 채워지기 전에는 제출할 수 없다', () => {
    renderModal();

    const submit = screen.getByRole('button', { name: '작성 완료' });
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

    fireEvent.click(screen.getByRole('button', { name: '작성 완료' }));

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

    expect(screen.getByRole('button', { name: '작성 완료' })).toBeDisabled();
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
