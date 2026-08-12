import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LiveMentoringSlot } from '@/api/live-mentoring/liveMentoringSchema';

const saveSlotsMock = vi.fn();
const refetchSlotsMock = vi.fn();

let mentoringSlots: LiveMentoringSlot[] | undefined;
let challengeSlots:
  | { feedbackSlotList: Array<Record<string, unknown>> }
  | undefined;
let slotsPending = false;
let slotsError = false;

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSlotsQuery: () => ({
    data: mentoringSlots,
    isPending: slotsPending,
    isError: slotsError,
    refetch: refetchSlotsMock,
  }),
  useSaveLiveMentoringSlotsMutation: () => ({
    mutateAsync: saveSlotsMock,
    isPending: false,
  }),
}));

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorSlotsQuery: () => ({
    data: challengeSlots,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

// 모달 포털은 document.body 로 렌더된다 — 테스트 환경에서 그대로 동작한다.
import LiveMentoringSlotModal from '../LiveMentoringSlotModal';

/**
 * 그리드는 이번 주 월요일부터 그린다. 고정 날짜를 쓰면 시간이 지나며 화면 밖으로
 * 밀려나므로 "지금 보이는 주"의 날짜를 만든다.
 */
const mondayOfThisWeek = () => {
  const now = new Date();
  const diff = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return monday;
};

const dateInThisWeek = (offsetDays: number): string => {
  const date = mondayOfThisWeek();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const OPEN_DATE = dateInThisWeek(1);
const RESERVED_DATE = dateInThisWeek(2);
const CHALLENGE_DATE = dateInThisWeek(3);

const renderModal = (isOpen = true) =>
  render(<LiveMentoringSlotModal isOpen={isOpen} onClose={vi.fn()} />);

beforeEach(() => {
  slotsPending = false;
  slotsError = false;
  mentoringSlots = [
    {
      slotId: 1,
      startDate: `${OPEN_DATE}T10:00:00`,
      endDate: `${OPEN_DATE}T10:30:00`,
      status: 'OPEN',
    },
    {
      slotId: 2,
      startDate: `${RESERVED_DATE}T11:00:00`,
      endDate: `${RESERVED_DATE}T11:30:00`,
      status: 'RESERVED',
    },
  ];
  challengeSlots = {
    feedbackSlotList: [
      {
        feedbackSlotId: 9,
        startDate: `${CHALLENGE_DATE}T12:00:00`,
        endDate: `${CHALLENGE_DATE}T12:30:00`,
        status: 'OPEN',
      },
    ],
  };
  saveSlotsMock.mockReset();
  saveSlotsMock.mockResolvedValue([]);
  refetchSlotsMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('LiveMentoringSlotModal — 챌린지 전용 UI 를 끌고 오지 않는다', () => {
  it('라이브 피드백 기간 바를 그리지 않는다', () => {
    // livePeriods 를 넘기지 않는다 — 1대1 에는 기간 개념이 없어졌다.
    renderModal();
    expect(screen.queryByText(/LIVE 피드백 기간/)).not.toBeInTheDocument();
  });

  it('슬롯 오픈 창 게이팅 안내를 띄우지 않는다', () => {
    // slotOpenWindow 를 넘기면 isSlotOpenClosed 가 켜져 슬롯 선택 자체가 막힌다.
    renderModal();
    expect(
      screen.queryByText(/슬롯 오픈 기간이 아닙니다/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장하기' })).toBeEnabled();
  });

  it('챌린지 이름 목록과 최소 오픈 수 안내를 띄우지 않는다', () => {
    renderModal();
    expect(screen.queryByText(/신청 예정인 멘티가/)).not.toBeInTheDocument();
    expect(screen.queryByText(/개 더 필요/)).not.toBeInTheDocument();
  });

  it('1대1 기준 제목을 쓴다', () => {
    renderModal();
    expect(screen.getByText('1대1 멘토링 일정 오픈하기')).toBeInTheDocument();
    expect(
      screen.queryByText('LIVE 피드백 일정 오픈하기'),
    ).not.toBeInTheDocument();
  });
});

describe('LiveMentoringSlotModal — 슬롯 상태 표시', () => {
  it('OPEN 슬롯은 선택된 상태로 올라온다', () => {
    renderModal();
    expect(screen.getAllByText('예약 가능').length).toBeGreaterThan(0);
    expect(screen.getByText(/선택된 가능 시간: 1개/)).toBeInTheDocument();
  });

  it('RESERVED 슬롯은 예약 완료로 잠긴다', () => {
    renderModal();
    // 레전드에도 같은 문구가 있으므로 aria-disabled 셀로 특정한다.
    const reservedCells = screen
      .getAllByTitle('예약이 완료된 시간입니다')
      .filter((el) => el.getAttribute('aria-disabled') === 'true');
    expect(reservedCells).toHaveLength(1);
  });

  it('챌린지 라이브 피드백 슬롯은 선택 불가로 보이고 사유를 알려준다', () => {
    renderModal();
    const blocked = screen.getByTitle(
      /라이브 피드백\(으\)로 이미 열어 둔 시간이라 선택할 수 없습니다/,
    );
    expect(blocked).toBeInTheDocument();

    // 클릭해도 선택으로 넘어가지 않는다 (스왑을 지원하지 않는다).
    fireEvent.click(blocked);
    expect(screen.getByText(/선택된 가능 시간: 1개/)).toBeInTheDocument();
  });
});

describe('LiveMentoringSlotModal — 저장 payload', () => {
  it('예약 슬롯을 항상 포함하고 챌린지 슬롯은 제외한다', async () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(saveSlotsMock).toHaveBeenCalledTimes(1));
    expect(saveSlotsMock.mock.calls[0][0]).toEqual([
      {
        startDate: `${OPEN_DATE}T10:00:00`,
        endDate: `${OPEN_DATE}T10:30:00`,
      },
      {
        startDate: `${RESERVED_DATE}T11:00:00`,
        endDate: `${RESERVED_DATE}T11:30:00`,
      },
    ]);
  });

  it('예약 슬롯은 선택을 모두 지워도 payload 에 남는다', async () => {
    // 회귀 케이스: 빠지면 서버가 삭제 대상으로 보고 409 로 저장 전체가 실패한다.
    renderModal();

    // 선택돼 있던 OPEN 셀을 해제한다(같은 문구가 레전드에도 있어 셀만 고른다).
    fireEvent.mouseDown(screen.getByRole('button', { name: '예약 가능' }));
    expect(screen.getByText(/선택된 가능 시간: 0개/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /변경사항 1개 저장하기/ }),
    );

    await waitFor(() => expect(saveSlotsMock).toHaveBeenCalledTimes(1));
    expect(saveSlotsMock.mock.calls[0][0]).toEqual([
      {
        startDate: `${RESERVED_DATE}T11:00:00`,
        endDate: `${RESERVED_DATE}T11:30:00`,
      },
    ]);
  });
});

describe('LiveMentoringSlotModal — 저장 실패 처리', () => {
  const failWith = (code: string, message = '서버 메시지') => {
    saveSlotsMock.mockRejectedValue({ code, message });
  };

  it('잠금(409)이면 예약 삭제 불가를 알리고 모달을 닫지 않는다', async () => {
    failWith('LIVE_MENTORING_SLOT_LOCKED');
    const onClose = vi.fn();
    render(<LiveMentoringSlotModal isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(
      await screen.findByText(/예약된 일정은 삭제할 수 없습니다/),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    // 화면이 들고 있는 슬롯이 낡아서 나는 에러다 — 최신 상태를 다시 읽는다.
    expect(refetchSlotsMock).toHaveBeenCalled();
  });

  it('충돌(409)이면 이미 등록된 시간임을 알린다', async () => {
    failWith('LIVE_MENTORING_SLOT_CONFLICT');
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(
      await screen.findByText(/이미 등록된 시간입니다/),
    ).toBeInTheDocument();
    expect(refetchSlotsMock).toHaveBeenCalled();
  });

  it('시간 규칙 위반(400)이면 30분 단위·미래 조건을 안내한다', async () => {
    failWith('LIVE_MENTORING_INVALID_SLOT_TIME');
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(
      await screen.findByText(/지금 이후의 30분 단위 시간만 열 수 있습니다/),
    ).toBeInTheDocument();
    // 낡은 상태 때문이 아니므로 재조회하지 않는다.
    expect(refetchSlotsMock).not.toHaveBeenCalled();
  });

  it('상품 없음(404)이면 먼저 오픈 설정을 저장하라고 안내한다', async () => {
    failWith('LIVE_MENTORING_NOT_FOUND');
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(
      await screen.findByText(/먼저 오픈 설정을 저장해 상품을 만든 뒤/),
    ).toBeInTheDocument();
  });

  it('모르는 코드면 서버 메시지를 그대로 보여준다', async () => {
    failWith('SOMETHING_ELSE', '알 수 없는 오류');
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(await screen.findByText('알 수 없는 오류')).toBeInTheDocument();
  });
});

describe('LiveMentoringSlotModal — 로딩·에러·열림 상태', () => {
  it('닫혀 있으면 아무것도 그리지 않는다', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('불러오는 중에는 그리드 대신 안내를 보여준다', () => {
    // 응답이 늦게 도착할 때 빈 그리드를 먼저 그리면, 이미 열어 둔 일정이
    // 사라진 것처럼 보이고 그대로 저장되면 실제로 지워진다.
    slotsPending = true;
    mentoringSlots = undefined;
    renderModal();

    expect(screen.getByText('일정을 불러오는 중...')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '저장하기' }),
    ).not.toBeInTheDocument();
  });

  it('조회에 실패하면 다시 시도할 수 있다', () => {
    slotsError = true;
    mentoringSlots = undefined;
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetchSlotsMock).toHaveBeenCalled();
  });
});
