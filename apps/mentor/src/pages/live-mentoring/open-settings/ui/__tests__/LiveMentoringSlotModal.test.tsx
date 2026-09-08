import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';

const createSlotsMock = vi.fn();
const deleteSlotsMock = vi.fn();
const refetchSlotsMock = vi.fn();

let feedbackSlots: FeedbackSlot[] | undefined;
let slotsPending = false;
let slotsError = false;

/*
 * 1대1 전용 슬롯 API 는 사라졌다. 이 화면은 챌린지 라이브 피드백과 같은
 * `/feedback/mentor/slot` 한 벌만 쓴다.
 */
vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorSlotsQuery: () => ({
    data: feedbackSlots ? { feedbackSlotList: feedbackSlots } : undefined,
    isPending: slotsPending,
    isError: slotsError,
    refetch: refetchSlotsMock,
  }),
  useCreateFeedbackMentorSlotsMutation: () => ({
    mutateAsync: createSlotsMock,
    isPending: false,
  }),
  useDeleteFeedbackMentorSlotsMutation: () => ({
    mutateAsync: deleteSlotsMock,
    isPending: false,
  }),
}));

// 챌린지 기간 음영은 `__tests__/challengePeriod.test.ts` 와 그리드 테스트에서 따로
// 검증한다. 여기서는 조회가 QueryClient 를 요구하지 않도록 비워 둔다.
let challengeList: { myChallengeMentorVoList: unknown[] } | undefined;
vi.mock('@/api/user/user', () => ({
  useMentorChallengeListQuery: () => ({ data: challengeList }),
}));

// 모달 포털은 document.body 로 렌더된다 — 테스트 환경에서 그대로 동작한다.
import LiveMentoringSlotModal from '../LiveMentoringSlotModal';

/*
  그리드가 쓰는 "지금" 을 이번 주 월요일 00:00 으로 고정한다.

  그리드는 같은 값으로 보이는 주를 정하므로 월~일 전체가 미래가 된다. 고정하지
  않으면 오늘보다 앞선 요일이 "지난 시간" 비활성 회색으로 그려져(LC-3259) 클릭이
  막히고, 주 후반에 테스트를 돌릴수록 더 많이 깨진다.
 */
vi.mock('@/pages/schedule/constants/mockNow', () => ({
  MOCK_NOW: null,
  currentNow: () => {
    const now = new Date();
    const diff = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  },
}));

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
  feedbackSlots = [
    {
      feedbackSlotId: 1,
      startDate: `${OPEN_DATE}T10:00:00`,
      endDate: `${OPEN_DATE}T10:30:00`,
      status: 'OPEN',
    },
    {
      feedbackSlotId: 2,
      startDate: `${RESERVED_DATE}T11:00:00`,
      endDate: `${RESERVED_DATE}T11:30:00`,
      status: 'RESERVED',
    },
    // 예전에 "챌린지 전용" 으로 감춰지던 슬롯. 이제 같은 목록의 일부다.
    {
      feedbackSlotId: 9,
      startDate: `${CHALLENGE_DATE}T12:00:00`,
      endDate: `${CHALLENGE_DATE}T12:30:00`,
      status: 'OPEN',
    },
  ];
  createSlotsMock.mockReset();
  createSlotsMock.mockResolvedValue(undefined);
  deleteSlotsMock.mockReset();
  deleteSlotsMock.mockResolvedValue(undefined);
  refetchSlotsMock.mockReset();
  challengeList = { myChallengeMentorVoList: [] };
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
    // 챌린지 쪽에서 열었던 슬롯도 같은 목록이라 함께 선택 상태다.
    expect(screen.getByText(/선택된 가능 시간: 2개/)).toBeInTheDocument();
  });

  it('RESERVED 슬롯은 예약 완료로 잠긴다', () => {
    renderModal();
    // 레전드에도 같은 문구가 있으므로 aria-disabled 셀로 특정한다.
    const reservedCells = screen
      .getAllByTitle('예약이 완료된 시간입니다')
      .filter((el) => el.getAttribute('aria-disabled') === 'true');
    expect(reservedCells).toHaveLength(1);
  });

  it('챌린지 슬롯을 점유로 그리지 않고 선택 가능한 일반 슬롯으로 그린다', () => {
    /*
     * 회귀 케이스 — 통합 전에는 챌린지 슬롯을 blockedSlots 로 넘겨 "선택할 수 없는
     * 시간" 으로 그렸다. 슬롯이 한 벌로 합쳐진 뒤에는 남의 슬롯이 아니라 내가 이미
     * 열어 둔 시간이므로, 잠그면 해제조차 못 한다.
     */
    renderModal();
    expect(
      screen.queryByTitle(/이미 열어 둔 시간이라 선택할 수 없습니다/),
    ).not.toBeInTheDocument();

    // 해제할 수 있어야 한다.
    const cells = screen.getAllByRole('button', { name: '예약 가능' });
    fireEvent.mouseDown(cells[cells.length - 1]);
    expect(screen.getByText(/선택된 가능 시간: 1개/)).toBeInTheDocument();
  });
});

describe('LiveMentoringSlotModal — 증분 저장', () => {
  it('변경이 없으면 아무 요청도 보내지 않고 그대로 닫힌다', async () => {
    const onClose = vi.fn();
    render(<LiveMentoringSlotModal isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(createSlotsMock).not.toHaveBeenCalled();
    expect(deleteSlotsMock).not.toHaveBeenCalled();
  });

  it('해제한 슬롯만 DELETE 로 나가고 예약 슬롯은 건드리지 않는다', async () => {
    renderModal();

    // 선택돼 있던 OPEN 셀 하나를 해제한다.
    fireEvent.mouseDown(
      screen.getAllByRole('button', { name: '예약 가능' })[0],
    );
    expect(screen.getByText(/선택된 가능 시간: 1개/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /변경사항 1개 저장하기/ }),
    );

    await waitFor(() => expect(deleteSlotsMock).toHaveBeenCalledTimes(1));
    expect(deleteSlotsMock.mock.calls[0][0]).toEqual([1]);
    // 예약 슬롯(2)은 삭제 대상이 아니다.
    expect(deleteSlotsMock.mock.calls[0][0]).not.toContain(2);
    expect(createSlotsMock).not.toHaveBeenCalled();
  });

  it('과거 RESERVED 슬롯이 있어도 추가·삭제가 성공한다', async () => {
    /*
     * 회귀 케이스 — 전체 치환 시절에는 조회 범위 밖의 과거 예약 슬롯 하나가
     * payload 에서 빠지면서 저장 전체가 409 로 영구히 막혔다. 증분 저장에는
     * 치환 범위라는 개념이 없어 같은 상황이 생기지 않는다.
     */
    feedbackSlots = [
      {
        feedbackSlotId: 220,
        startDate: '2020-01-01T14:00:00',
        endDate: '2020-01-01T14:30:00',
        status: 'RESERVED',
      },
      ...(feedbackSlots ?? []),
    ];
    renderModal();

    fireEvent.mouseDown(
      screen.getAllByRole('button', { name: '예약 가능' })[0],
    );
    fireEvent.click(
      screen.getByRole('button', { name: /변경사항 1개 저장하기/ }),
    );

    await waitFor(() => expect(deleteSlotsMock).toHaveBeenCalledTimes(1));
    // 과거 예약 슬롯은 요청 어디에도 등장하지 않는다.
    expect(deleteSlotsMock.mock.calls[0][0]).not.toContain(220);
  });
});

describe('LiveMentoringSlotModal — 저장 실패 처리', () => {
  const failWith = (code: string, message = '서버 메시지') => {
    deleteSlotsMock.mockRejectedValue({ code, message });
  };

  const removeOneSlotAndSave = () => {
    fireEvent.mouseDown(
      screen.getAllByRole('button', { name: '예약 가능' })[0],
    );
    fireEvent.click(
      screen.getByRole('button', { name: /변경사항 1개 저장하기/ }),
    );
  };

  it('충돌(409)이면 이미 등록된 시간임을 알리고 모달을 닫지 않는다', async () => {
    failWith('CONFLICT_FEEDBACK_SLOT');
    const onClose = vi.fn();
    render(<LiveMentoringSlotModal isOpen onClose={onClose} />);

    removeOneSlotAndSave();

    expect(
      await screen.findByText(/이미 등록된 시간입니다/),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    // 화면이 들고 있는 슬롯이 낡아서 나는 에러다 — 최신 상태를 다시 읽는다.
    expect(refetchSlotsMock).toHaveBeenCalled();
  });

  it('예약된 슬롯(400)이면 변경 불가를 알린다', async () => {
    failWith('RESERVED_FEEDBACK_SLOT');
    renderModal();

    removeOneSlotAndSave();

    expect(
      await screen.findByText(/예약된 일정은 변경할 수 없습니다/),
    ).toBeInTheDocument();
  });

  it('이미 삭제된 슬롯(404)이면 최신 일정을 다시 불러왔다고 알린다', async () => {
    failWith('FEEDBACK_SLOT_NOT_FOUND');
    renderModal();

    removeOneSlotAndSave();

    expect(
      await screen.findByText(/이미 삭제된 일정입니다/),
    ).toBeInTheDocument();
  });

  it('모르는 코드면 서버 메시지를 그대로 보여준다', async () => {
    failWith('SOMETHING_ELSE', '알 수 없는 오류');
    renderModal();

    removeOneSlotAndSave();

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
    feedbackSlots = undefined;
    renderModal();

    expect(screen.getByText('일정을 불러오는 중...')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '저장하기' }),
    ).not.toBeInTheDocument();
  });

  it('조회에 실패하면 다시 시도할 수 있다', () => {
    slotsError = true;
    feedbackSlots = undefined;
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetchSlotsMock).toHaveBeenCalled();
  });
});
