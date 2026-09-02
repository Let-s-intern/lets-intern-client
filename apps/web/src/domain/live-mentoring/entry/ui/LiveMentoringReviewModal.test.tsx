/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import LiveMentoringReviewModal from './LiveMentoringReviewModal';

const mutate = jest.fn();

jest.mock('@/api/review/review', () => ({
  __esModule: true,
  useCreateLiveMentoringReviewMutation: () => ({ mutate, isPending: false }),
}));

const APPLICATION_ID = 4242;

const renderModal = (props?: {
  isOpen?: boolean;
  productName?: string;
  mentorName?: string;
}) =>
  render(
    <LiveMentoringReviewModal
      isOpen={props?.isOpen ?? true}
      onClose={jest.fn()}
      applicationId={APPLICATION_ID}
      productName={props?.productName}
      mentorName={props?.mentorName}
    />,
  );

describe('LiveMentoringReviewModal', () => {
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
    renderModal({ isOpen: false, productName: '자소서 멘토링' });

    expect(
      screen.queryByText('자소서 멘토링 멘토링, 어떠셨나요?'),
    ).not.toBeInTheDocument();
  });

  it('productName 이 있으면 제목에 붙인다', () => {
    renderModal({ productName: '자소서 멘토링', mentorName: '김멘토' });

    expect(screen.getByText('자소서 멘토링 멘토링, 어떠셨나요?')).toBeVisible();
    expect(screen.getByText(/김멘토 멘토님과 나눈/)).toBeInTheDocument();
    expect(
      screen.getByText('멘토링을 통해 새롭게 알게 된 점을 작성해주세요'),
    ).toBeInTheDocument();
  });

  it('productName 이 없으면 "1:1 멘토링"으로 폴백한다', () => {
    renderModal();

    expect(screen.getByText('1:1 멘토링, 어떠셨나요?')).toBeVisible();
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

  it('별점과 내용을 채우면 POST 페이로드로 저장한다', () => {
    renderModal();

    fireEvent.click(screen.getByAltText('별 4개'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '지원 직무와 연결되는 경험을 앞에 두라고 알려주셨다.' },
    });

    fireEvent.click(screen.getByRole('button', { name: '작성 완료' }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({
      score: 4,
      content: '지원 직무와 연결되는 경험을 앞에 두라고 알려주셨다.',
    });
  });

  it('제출 성공 시 onClose 를 호출한다', () => {
    const onClose = jest.fn();
    mutate.mockImplementation((_payload, options) => {
      options?.onSuccess?.();
    });
    render(
      <LiveMentoringReviewModal
        isOpen
        onClose={onClose}
        applicationId={APPLICATION_ID}
      />,
    );

    fireEvent.click(screen.getByAltText('별 5개'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '많은 도움이 됐습니다.' },
    });
    fireEvent.click(screen.getByRole('button', { name: '작성 완료' }));

    expect(onClose).toHaveBeenCalledTimes(1);
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
      <LiveMentoringReviewModal
        isOpen
        onClose={onClose}
        applicationId={APPLICATION_ID}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '나중에 쓸게요' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });
});
