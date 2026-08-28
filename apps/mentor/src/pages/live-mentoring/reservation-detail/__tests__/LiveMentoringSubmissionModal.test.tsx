import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('LiveMentoringSubmissionModal — 질문 본문', () => {
  it('질문 본문을 그대로 보여 준다', () => {
    mockDetail({ questionContent: '지원 동기 문단을 봐주세요.' });
    renderModal(91001);

    expect(screen.getByText('지원 동기 문단을 봐주세요.')).toBeInTheDocument();
  });

  it('줄바꿈을 보존한다', () => {
    mockDetail({ questionContent: '첫째 줄\n둘째 줄' });
    renderModal(91001);

    const body = screen.getByText(/첫째 줄/);
    expect(body).toHaveClass('whitespace-pre-wrap');
    expect(body.textContent).toBe('첫째 줄\n둘째 줄');
  });

  it('나중에 작성하기를 고른 건은 빈 영역 대신 안내를 남긴다', () => {
    mockDetail({ questionDeferred: true, questionContent: null });
    renderModal(91003);

    expect(
      screen.getByText('아직 질문을 작성하지 않았습니다.'),
    ).toBeInTheDocument();
  });

  it('본문이 공백뿐이어도 안내를 남긴다', () => {
    mockDetail({ questionDeferred: false, questionContent: '   ' });
    renderModal(91002);

    expect(
      screen.getByText('아직 질문을 작성하지 않았습니다.'),
    ).toBeInTheDocument();
  });

  it('questionUpdatedAt 이 있으면 최종 수정 시각을 함께 보여 준다', () => {
    mockDetail({ questionUpdatedAt: '2026-08-29T18:20:00' });
    renderModal(91001);

    expect(screen.getByText('최종 수정 2026.08.29 18:20')).toBeInTheDocument();
  });

  // 백엔드가 이번에 내리지 않기로 한 값이다(PRD 9-2). 없는 시각을 지어내지 않는다.
  it('questionUpdatedAt 이 없으면 그 줄을 아예 그리지 않는다', () => {
    mockDetail({ questionUpdatedAt: undefined });
    renderModal(91001);

    expect(screen.queryByText(/최종 수정/)).not.toBeInTheDocument();
  });
});

describe('LiveMentoringSubmissionModal — 첨부 4분기 (PRD 4.7)', () => {
  it('NONE 이면 첨부 자료 없음만 알린다', () => {
    mockDetail({ attachmentType: 'NONE', attachmentUrl: null });
    renderModal(91002);

    expect(screen.getByText('첨부 자료 없음')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();
  });

  it('URL + 동의 + 노션 주소면 링크와 임베드를 함께 보여 준다', () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl:
        'https://letscareer.notion.site/mentee-9a0f1b2c3d4e5f60718293a4b5c6d7e8',
      mentorShareAgreed: true,
    });
    renderModal(91001);

    expect(
      screen.getByRole('link', { name: '새 탭에서 열기' }),
    ).toHaveAttribute(
      'href',
      'https://letscareer.notion.site/mentee-9a0f1b2c3d4e5f60718293a4b5c6d7e8',
    );
    expect(screen.getByTestId('attachment-embed')).toBeInTheDocument();
  });

  it('URL + 동의 + 노션이 아니면 임베드 없이 링크만 보여 준다', () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl: 'https://drive.google.com/file/d/mentee-portfolio-91004',
      mentorShareAgreed: true,
    });
    renderModal(91004);

    expect(
      screen.getByRole('link', { name: '새 탭에서 열기' }),
    ).toHaveAttribute(
      'href',
      'https://drive.google.com/file/d/mentee-portfolio-91004',
    );
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();
  });

  // 파일명 자체가 곧 S3 키라 이름도 주소도 만들지 않는다(PRD 4.2).
  it('FILE + 동의면 준비 중 문구만 남기고 링크·파일명을 만들지 않는다', () => {
    mockDetail({
      attachmentType: 'FILE',
      attachmentUrl: null,
      mentorShareAgreed: true,
    });
    renderModal(91005);

    expect(screen.getByText('파일 첨부됨 — 준비 중')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();
  });

  // 아무 표시도 하지 않으면 멘토가 "안 냈다" 로 오해한다.
  it('동의하지 않은 URL 첨부는 링크 없이 사유를 구분해 안내한다', () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl: null,
      mentorShareAgreed: false,
    });
    renderModal(91006);

    expect(
      screen.getByText('첨부를 냈으나 멘토 전달에 동의하지 않았습니다'),
    ).toBeInTheDocument();
    expect(screen.queryByText('첨부 자료 없음')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();
  });

  it('동의하지 않은 FILE 첨부도 같은 안내를 쓴다', () => {
    mockDetail({
      attachmentType: 'FILE',
      attachmentUrl: null,
      mentorShareAgreed: false,
    });
    renderModal(91006);

    expect(
      screen.getByText('첨부를 냈으나 멘토 전달에 동의하지 않았습니다'),
    ).toBeInTheDocument();
    expect(screen.queryByText('파일 첨부됨 — 준비 중')).not.toBeInTheDocument();
  });

  // 첨부 주소는 멘티가 적어 낸 값이고 서버가 스킴을 보지 않는다. 링크로 만들면
  // 멘토가 누르는 순간 멘토 앱 origin 에서 실행된다 — target="_blank" 는 막지 못한다.
  it.each([
    ['javascript:alert(document.cookie)'],
    ['JaVaScRiPt:alert(1)'],
    ['data:text/html,<script>alert(1)</script>'],
    ['vbscript:msgbox(1)'],
    ['첨부 주소가 아닌 문자열'],
  ])('열 수 없는 스킴(%s)은 링크로 만들지 않는다', (url) => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl: url,
      mentorShareAgreed: true,
    });
    renderModal(91004);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();
    expect(
      screen.getByText('첨부 주소를 확인할 수 없습니다'),
    ).toBeInTheDocument();
  });

  it('http 주소는 그대로 연다', () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl: 'http://example.test/resume',
      mentorShareAgreed: true,
    });
    renderModal(91004);

    expect(
      screen.getByRole('link', { name: '새 탭에서 열기' }),
    ).toHaveAttribute('href', 'http://example.test/resume');
  });

  it('미리보기를 접으면 임베드를 마운트하지 않는다', async () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl:
        'https://letscareer.notion.site/mentee-9a0f1b2c3d4e5f60718293a4b5c6d7e8',
      mentorShareAgreed: true,
    });
    renderModal(91001);

    await userEvent.click(
      screen.getByRole('button', { name: '미리보기 접기' }),
    );
    expect(screen.queryByTestId('attachment-embed')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: '미리보기 펼치기' }),
    );
    expect(screen.getByTestId('attachment-embed')).toBeInTheDocument();
  });
});

describe('LiveMentoringSubmissionModal — 제출 요약 (캘린더 카드 어휘)', () => {
  it('질문과 첨부를 모두 냈으면 질문·파일 제출', () => {
    mockDetail({
      questionDeferred: false,
      questionContent: '질문 있습니다.',
      attachmentType: 'URL',
    });
    renderModal(91001);

    expect(screen.getByText('질문·파일 제출')).toBeInTheDocument();
  });

  it('질문만 냈으면 질문만 제출', () => {
    mockDetail({
      questionDeferred: false,
      questionContent: '질문 있습니다.',
      attachmentType: 'NONE',
      attachmentUrl: null,
    });
    renderModal(91002);

    expect(screen.getByText('질문만 제출')).toBeInTheDocument();
  });

  it('첨부만 냈으면 파일만 제출', () => {
    mockDetail({
      questionDeferred: false,
      questionContent: null,
      attachmentType: 'FILE',
      attachmentUrl: null,
      mentorShareAgreed: true,
    });
    renderModal(91005);

    expect(screen.getByText('파일만 제출')).toBeInTheDocument();
  });

  it('둘 다 없으면 미제출', () => {
    mockDetail({
      questionDeferred: true,
      questionContent: null,
      attachmentType: 'NONE',
      attachmentUrl: null,
    });
    renderModal(91003);

    expect(screen.getByText('미제출')).toBeInTheDocument();
  });

  // 동의하지 않았을 뿐 제출은 했다. 요약에서 "안 냈다" 로 세면 안 된다.
  it('동의하지 않은 첨부도 제출로 센다', () => {
    mockDetail({
      questionDeferred: false,
      questionContent: '질문 있습니다.',
      attachmentType: 'URL',
      attachmentUrl: null,
      mentorShareAgreed: false,
    });
    renderModal(91006);

    expect(screen.getByText('질문·파일 제출')).toBeInTheDocument();
  });
});

describe('LiveMentoringSubmissionModal — 좁은 폭', () => {
  const LONG_QUESTION = `${'가'.repeat(400)}\n${'https://example.com/very-long-path-'.repeat(
    10,
  )}`;

  it('본문은 모달 안에서만 세로로 스크롤하고 가로로는 밀리지 않는다', () => {
    mockDetail({ questionContent: LONG_QUESTION });
    renderModal(91001);

    const scroller = screen.getByTestId('submission-modal-scroll');
    expect(scroller).toHaveClass('max-h-[85vh]');
    expect(scroller).toHaveClass('overflow-y-auto');
    expect(scroller).toHaveClass('overflow-x-hidden');
  });

  it('긴 주소가 섞인 본문도 줄바꿈으로 접는다', () => {
    mockDetail({ questionContent: LONG_QUESTION });
    renderModal(91001);

    const body = screen.getByText(/가{10}/);
    expect(body).toHaveClass('break-words');
    expect(body).toHaveClass('whitespace-pre-wrap');
  });

  it('모달 자체가 화면 폭을 넘지 않는다', () => {
    renderModal(91001);

    const panel = screen.getByRole('dialog').querySelector('.max-w-3xl');
    expect(panel).not.toBeNull();
    expect(panel).toHaveClass('w-full');
    expect(panel).toHaveClass('mx-4');
  });

  // `fit="native"` 는 컨테이너 실제 폭으로 렌더한다 — 좁은 폭에서 노션이 반응형
  // 레이아웃을 그리고, 넓게 렌더한 뒤 축소하는 `scale` 처럼 본문을 밀어내지 않는다.
  it('임베드는 컨테이너 폭에 맞춰 렌더한다', () => {
    mockDetail({
      attachmentType: 'URL',
      attachmentUrl:
        'https://letscareer.notion.site/mentee-9a0f1b2c3d4e5f60718293a4b5c6d7e8',
      mentorShareAgreed: true,
    });
    renderModal(91001);

    const embedBox = screen.getByTestId('attachment-embed');
    expect(embedBox).toHaveClass('w-full');

    const iframe = embedBox.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveStyle({ width: '100%' });
  });
});
