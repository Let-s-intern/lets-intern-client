import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LiveMentoringReservationDetail } from '@/api/live-mentoring/liveMentoringSchema';

const detailQueryMock = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringReservationDetailQuery: (applicationId: number | null) =>
    detailQueryMock(applicationId),
}));

// 모달 포털은 document.body 로 렌더된다 — 테스트 환경에서 그대로 동작한다.
import LiveMentoringSubmissionModal from '../LiveMentoringSubmissionModal';

const DETAIL: LiveMentoringReservationDetail = {
  applicationId: 91001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-30T10:00:00',
  reservationEndAt: '2026-08-30T11:00:00',
  mentoringCategory: 'PERSONAL_STATEMENT',
  questionDeferred: false,
  questionContent: '지원 동기 문단이 약한 것 같습니다.',
  attachmentType: 'URL',
  attachmentUrl:
    'https://letscareer.notion.site/mentee-9a0f1b2c3d4e5f60718293a4b5c6d7e8',
  mentorShareAgreed: true,
};

/** 상세 쿼리 반환값을 한 번만 정해 준다. 넘기지 않으면 로딩 상태다. */
const mockDetail = (
  overrides: Partial<LiveMentoringReservationDetail> | null = null,
  state: { isLoading?: boolean; isError?: boolean } = {},
) => {
  detailQueryMock.mockReturnValue({
    data: overrides === null ? undefined : { ...DETAIL, ...overrides },
    isLoading: state.isLoading ?? false,
    isError: state.isError ?? false,
  });
};

const renderModal = (applicationId: number | null, onClose = vi.fn()) => {
  const result = render(
    <LiveMentoringSubmissionModal
      applicationId={applicationId}
      onClose={onClose}
    />,
  );
  return { ...result, onClose };
};

beforeEach(() => {
  detailQueryMock.mockReset();
  mockDetail({});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('LiveMentoringSubmissionModal — 껍데기와 데이터 연결', () => {
  it('applicationId 가 있으면 dialog 로 열린다', () => {
    renderModal(91001);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('김일대 님의 제출물')).toBeInTheDocument();
  });

  it('applicationId 가 null 이면 아무것도 렌더하지 않는다', () => {
    renderModal(null);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applicationId 를 그대로 상세 쿼리에 넘긴다', () => {
    renderModal(91005);

    expect(detailQueryMock).toHaveBeenCalledWith(91005);
  });

  // 닫힌 상태에서는 훅 자체를 부르지 않는다. `enabled: false` 로 막는 것만으로는
  // 캐시 구독과 리렌더가 남으므로, 본문을 아예 마운트하지 않는 쪽을 검증한다.
  it('applicationId 가 null 이면 상세 쿼리를 아예 호출하지 않는다', () => {
    renderModal(null);

    expect(detailQueryMock).not.toHaveBeenCalled();
  });

  it('헤더에 상품명·카테고리·일시·진행시간을 함께 보여 준다', () => {
    renderModal(91001);

    const meta = screen.getByText(/자소서 실전 첨삭 멘토링/);
    expect(meta).toHaveTextContent('자기소개서');
    expect(meta).toHaveTextContent('2026.08.30');
    expect(meta).toHaveTextContent('10:00 ~ 11:00');
    expect(meta).toHaveTextContent('60분');
  });

  it('카테고리가 null 이면 그 자리를 그리지 않는다 — 나머지는 그대로다', () => {
    mockDetail({ mentoringCategory: null });
    renderModal(91003);

    const meta = screen.getByText(/자소서 실전 첨삭 멘토링/);
    expect(meta).not.toHaveTextContent('자기소개서');
    expect(meta).toHaveTextContent('60분');
    // 라벨이 빠져도 구분자만 남는 빈 칸(`· ·`)이 생기면 안 된다.
    expect(meta.textContent).not.toContain('· ·');
  });

  it('로딩 중이면 빈 화면 대신 안내를 남긴다', () => {
    mockDetail(null, { isLoading: true });
    renderModal(91001);

    expect(
      screen.getByText('제출물을 불러오는 중입니다...'),
    ).toBeInTheDocument();
  });

  it('실패하면 안내 문구를 보여 준다', () => {
    mockDetail(null, { isError: true });
    renderModal(91001);

    expect(
      screen.getByText(/제출물을 불러오지 못했습니다/),
    ).toBeInTheDocument();
  });

  it('Esc 로 닫는다', () => {
    const { onClose } = renderModal(91001);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('닫혀 있으면 Esc 를 듣지 않는다', () => {
    const { onClose } = renderModal(null);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('닫기 버튼으로 닫는다', () => {
    const { onClose } = renderModal(91001);

    fireEvent.click(screen.getByLabelText('제출물 모달 닫기'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경을 클릭하면 닫는다', () => {
    const { onClose } = renderModal(91001);

    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
