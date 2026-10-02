import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import {
  RESERVATION_KIND_LABEL,
  toChallengeRow,
  toLiveMentoringRow,
  type ReservationRow,
} from '../utils/reservationRow';
import ReservationListView from './ReservationListView';

const feedback: FeedbackAdminVo = {
  feedbackId: 7,
  programTitle: '면접준비 챌린지',
  mentorId: 101,
  mentorName: '쥬디',
  menteeName: '홍길동',
  startDate: '2026-05-29T17:00:00',
  endDate: '2026-05-29T17:30:00',
  createDate: '2026-05-20T09:05:00',
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  status: 'RESERVED',
};

const row = toChallengeRow(feedback);

const makeLiveMentoringRow = (
  overrides: Partial<AdminLiveMentoringReservation> = {},
): ReservationRow =>
  toLiveMentoringRow({
    applicationId: 501,
    liveMentoringId: 10,
    productName: '이력서 1대1 첨삭',
    mentorId: 21,
    mentorName: '김멘토',
    mentorNickname: '렛츠멘토',
    mentorEmail: 'mentor@letscareer.co.kr',
    menteeId: 77,
    menteeName: '최멘티',
    menteeEmail: 'choi@example.com',
    menteePhoneNum: '01012340001',
    contactEmail: null,
    durationMinutes: 30,
    reservationStartAt: '2026-05-30T19:00:00',
    reservationEndAt: '2026-05-30T19:30:00',
    status: 'CONFIRMED',
    createDate: '2026-05-21T09:00:00',
    questionDeferred: false,
    questionContent: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    ...overrides,
  });

const sort = { key: 'dateTime' as const, direction: 'asc' as const };

const baseProps = {
  sort,
  onToggleSort: vi.fn(),
  onView: vi.fn(),
  onReschedule: vi.fn(),
  onLiveMentoringReschedule: vi.fn(),
};

describe('ReservationListView', () => {
  it('행 데이터와 날짜 포맷을 표시한다', () => {
    render(
      <ReservationListView
        {...baseProps}
        reservations={[row]}
        isLoading={false}
      />,
    );
    expect(
      screen.getByText('2026년 5월 29일 금요일 17:00-17:30'),
    ).toBeInTheDocument();
    expect(screen.getByText('면접준비 챌린지')).toBeInTheDocument();
    expect(screen.getByText('쥬디')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('2026-05-20 09:05')).toBeInTheDocument();
  });

  it('진리표 상태 컬럼(출석/뱃지)을 렌더한다', () => {
    // row: 2026-05-29 종료 = 과거, 멘토·멘티 PENDING → 멘토 미진행 / 멘티 미참여
    render(
      <ReservationListView
        {...baseProps}
        reservations={[row]}
        isLoading={false}
      />,
    );
    expect(screen.getByText('멘토 출석')).toBeInTheDocument();
    expect(screen.getByText('멘티 출석')).toBeInTheDocument();
    expect(screen.getByText('멘토 뱃지')).toBeInTheDocument();
    expect(screen.getByText('멘티 뱃지')).toBeInTheDocument();
    expect(screen.getByText('미진행')).toBeInTheDocument();
    expect(screen.getByText('미참여')).toBeInTheDocument();
  });

  it('로딩 중에는 안내 문구를 표시한다', () => {
    render(<ReservationListView {...baseProps} reservations={[]} isLoading />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('빈 목록은 안내 문구를 표시한다', () => {
    render(
      <ReservationListView
        {...baseProps}
        reservations={[]}
        isLoading={false}
      />,
    );
    expect(screen.getByText('예약 내역이 없습니다.')).toBeInTheDocument();
  });

  it('정렬 헤더 클릭 시 해당 키로 onToggleSort 를 호출한다', () => {
    const onToggleSort = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onToggleSort={onToggleSort}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText('멘티'));
    expect(onToggleSort).toHaveBeenCalledWith('menteeName');
  });

  it('보기 클릭 시 해당 행으로 onView 를 호출한다', () => {
    const onView = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onView={onView}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText('보기'));
    expect(onView).toHaveBeenCalledWith(row);
  });

  it('예약 변경 클릭 시 해당 예약으로 onReschedule 를 호출한다', () => {
    const onReschedule = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onReschedule={onReschedule}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
    expect(onReschedule).toHaveBeenCalledWith(feedback);
  });

  describe('1:1 LIVE 멘토링 행', () => {
    const renderMixed = (liveMentoringRow = makeLiveMentoringRow()) =>
      render(
        <ReservationListView
          {...baseProps}
          reservations={[row, liveMentoringRow]}
          isLoading={false}
        />,
      );

    it('1대1 행도 상세를 열 수 있다', () => {
      const onView = vi.fn();
      const liveMentoringRow = makeLiveMentoringRow();
      render(
        <ReservationListView
          {...baseProps}
          onView={onView}
          reservations={[liveMentoringRow]}
          isLoading={false}
        />,
      );
      fireEvent.click(screen.getByText('보기'));
      expect(onView).toHaveBeenCalledWith(liveMentoringRow);
    });

    it('두 유형을 한 표에 싣고 유형 컬럼으로 구분한다', () => {
      renderMixed();
      expect(screen.getByText('챌린지 라이브 피드백')).toBeInTheDocument();
      expect(screen.getByText('1:1 LIVE 멘토링')).toBeInTheDocument();
      expect(screen.getByText('이력서 1대1 첨삭')).toBeInTheDocument();
      expect(screen.getByText('최멘티')).toBeInTheDocument();
    });

    /*
      유형 칸에 색 배지를 넣었다가 되돌렸다. 두 유형은 글자로 구분하고, 진행 상태는
      행 배경색이 보여준다 — 한 행에 색이 두 겹이면 무엇을 뜻하는지 흐려진다.
    */
    it('유형은 색 없는 글자로 그린다', () => {
      renderMixed();
      for (const label of Object.values(RESERVATION_KIND_LABEL)) {
        expect(screen.getByText(label).className).not.toMatch(/\bbg-/);
      }
    });

    it('멘토는 닉네임으로, 플랜과 결제 상태를 함께 표시한다', () => {
      renderMixed();
      expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
      expect(screen.getByText('결제 완료 · 30분')).toBeInTheDocument();
    });

    it('결제 완료건은 해당 없음 칸 없이 예약 변경 버튼이 뜬다', () => {
      renderMixed();
      const liveMentoringCell = screen.getByText('1:1 LIVE 멘토링');
      const liveMentoringTr = liveMentoringCell.closest('tr') as HTMLElement;
      // 출석과 뱃지 네 칸은 모두 실제 값을 보여준다(LC-3336). 예약 변경은 버튼이다.
      expect(within(liveMentoringTr).queryAllByText('해당 없음')).toHaveLength(
        0,
      );
      expect(
        within(liveMentoringTr).getByRole('button', { name: '예약 변경' }),
      ).toBeInTheDocument();
    });

    it('결제 대기·슬롯 없는 신청은 예약 변경 칸도 해당 없음이다', () => {
      renderMixed(
        makeLiveMentoringRow({
          status: 'PAYMENT_PENDING',
          reservationStartAt: null,
          reservationEndAt: null,
        }),
      );
      const liveMentoringCell = screen.getByText('1:1 LIVE 멘토링');
      const liveMentoringTr = liveMentoringCell.closest('tr') as HTMLElement;
      // 출석·뱃지 네 칸은 '-' 로 표시되어 '해당 없음' 텍스트가 아니다.
      // 예약 변경 칸 하나만 '해당 없음'이다.
      expect(within(liveMentoringTr).getAllByText('해당 없음')).toHaveLength(1);
      expect(
        within(liveMentoringTr).queryByRole('button', { name: '예약 변경' }),
      ).not.toBeInTheDocument();
    });

    it('예약 변경 클릭 시 해당 신청으로 onLiveMentoringReschedule 를 호출한다', () => {
      const onLiveMentoringReschedule = vi.fn();
      const liveMentoringRow = makeLiveMentoringRow();
      render(
        <ReservationListView
          {...baseProps}
          onLiveMentoringReschedule={onLiveMentoringReschedule}
          reservations={[liveMentoringRow]}
          isLoading={false}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
      expect(onLiveMentoringReschedule).toHaveBeenCalledWith(
        liveMentoringRow.kind === 'LIVE_MENTORING'
          ? liveMentoringRow.reservation
          : undefined,
      );
    });

    it('예약 슬롯이 없는 신청도 행으로 보여 준다', () => {
      renderMixed(
        makeLiveMentoringRow({
          status: 'PAYMENT_PENDING',
          reservationStartAt: null,
          reservationEndAt: null,
        }),
      );
      expect(screen.getByText('예약 슬롯 없음')).toBeInTheDocument();
      expect(screen.getByText('결제 대기 · 30분')).toBeInTheDocument();
    });
  });

  /*
    LC-3336 — 1:1 행의 멘토·멘티 뱃지도 챌린지와 같은 진리표로 판정한다.
    세션은 2026-05-30 19:00~19:30 이고, 목록은 렌더 시각을 기준으로 가른다.
  */
  describe('1:1 LIVE 멘토링 행 — 진리표 뱃지', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    const renderAt = (
      now: string,
      overrides: Partial<AdminLiveMentoringReservation> = {},
    ) => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(now));
      render(
        <ReservationListView
          {...baseProps}
          reservations={[row, makeLiveMentoringRow(overrides)]}
          isLoading={false}
        />,
      );
    };

    /** 멘토 뱃지·멘티 뱃지 칸의 글자. 헤더 순서상 8·9번째 칸이다. */
    const badgeCells = (kindLabel: string) => {
      const tr = screen.getByText(kindLabel).closest('tr') as HTMLElement;
      const cells = within(tr).getAllByRole('cell');
      return [cells[7].textContent, cells[8].textContent];
    };
    const liveMentoringBadges = () => badgeCells('1:1 LIVE 멘토링');

    it('세션 전이면 둘 다 진행 예정이다', () => {
      renderAt('2026-05-30T18:00:00');
      expect(liveMentoringBadges()).toEqual(['진행 예정', '진행 예정']);
    });

    it('세션 중이면 둘 다 진행 중이다', () => {
      renderAt('2026-05-30T19:10:00');
      expect(liveMentoringBadges()).toEqual(['진행 중', '진행 중']);
    });

    it.each([
      ['PRESENT', 'PRESENT', '진행 완료', '진행 완료'],
      ['PRESENT', 'ABSENT', '진행 완료', '미참여'],
      ['ABSENT', 'ABSENT', '미진행', '미참여'],
      ['PENDING', 'PENDING', '미진행', '미참여'],
      ['ABSENT', 'PRESENT', '미진행', '확인 필요'],
    ] as const)(
      '세션 후 멘토 %s · 멘티 %s 면 %s / %s 이다',
      (mentorStatus, menteeStatus, mentorBadge, menteeBadge) => {
        renderAt('2026-05-30T20:00:00', { mentorStatus, menteeStatus });
        expect(liveMentoringBadges()).toEqual([mentorBadge, menteeBadge]);
      },
    );

    it('취소된 신청은 표시하지 않는다', () => {
      renderAt('2026-05-30T20:00:00', {
        status: 'CANCELED',
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
      });
      expect(liveMentoringBadges()).toEqual(['-', '-']);
    });

    // 진행 시점을 가를 시각이 없다. 결제 완료로 와도 추측하지 않고 '-' 로 둔다.
    it('예약 슬롯이 없는 행은 깨지지 않고 - 로 그린다', () => {
      renderAt('2026-05-30T20:00:00', {
        status: 'CONFIRMED',
        reservationStartAt: null,
        reservationEndAt: null,
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
      });
      expect(screen.getByText('예약 슬롯 없음')).toBeInTheDocument();
      expect(liveMentoringBadges()).toEqual(['-', '-']);
    });

    // 챌린지 행(05-29 17:00~17:30, 출석 미체크)은 같은 표에서 전과 같게 그린다.
    it('챌린지 행의 뱃지는 바뀌지 않는다', () => {
      renderAt('2026-05-30T18:00:00');
      expect(badgeCells('챌린지 라이브 피드백')).toEqual(['미진행', '미참여']);
    });

    /*
      1:1 행도 챌린지 행과 같은 규칙으로 행 배경을 칠한다(resolveRowTone).
      진행 중=연보라 / 진행 예정=없음 / 둘 다 참여=초록 / 한쪽만=빨강 / 둘 다 미참여=회색.
    */
    const TONE_CLASSES = [
      'bg-[#EEF0FF]',
      'bg-green-50',
      'bg-red-50',
      'bg-neutral-90',
    ];
    const liveMentoringRowTone = () => {
      const tr = screen
        .getByText('1:1 LIVE 멘토링')
        .closest('tr') as HTMLElement;
      return TONE_CLASSES.filter((c) => tr.classList.contains(c));
    };

    it.each([
      ['세션 전', '2026-05-30T18:00:00', 'PENDING', 'PENDING', []],
      [
        '세션 중',
        '2026-05-30T19:10:00',
        'PENDING',
        'PENDING',
        ['bg-[#EEF0FF]'],
      ],
      [
        '세션 후 둘 다 참여',
        '2026-05-30T20:00:00',
        'PRESENT',
        'PRESENT',
        ['bg-green-50'],
      ],
      [
        '세션 후 멘토만 참여',
        '2026-05-30T20:00:00',
        'PRESENT',
        'ABSENT',
        ['bg-red-50'],
      ],
      [
        '세션 후 멘티만 참여',
        '2026-05-30T20:00:00',
        'ABSENT',
        'PRESENT',
        ['bg-red-50'],
      ],
      [
        '세션 후 둘 다 미참여',
        '2026-05-30T20:00:00',
        'PENDING',
        'PENDING',
        ['bg-neutral-90'],
      ],
    ] as const)(
      '%s 이면 행 배경이 %s 로 칠해진다',
      (_, now, mentorStatus, menteeStatus, expected) => {
        renderAt(now, { mentorStatus, menteeStatus });
        expect(liveMentoringRowTone()).toEqual(expected);
      },
    );

    it('취소된 신청은 칠하지 않는다', () => {
      renderAt('2026-05-30T20:00:00', {
        status: 'CANCELED',
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
      });
      expect(liveMentoringRowTone()).toEqual([]);
    });

    it('슬롯 없는 신청은 출석이 있어도 칠하지 않는다', () => {
      renderAt('2026-05-30T20:00:00', {
        reservationStartAt: null,
        reservationEndAt: null,
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
      });
      expect(liveMentoringRowTone()).toEqual([]);
    });

    // 같은 출석 조합이면 두 종류의 행이 같은 색이어야 한다.
    it('출석 조합이 같으면 챌린지 행과 같은 색이다', () => {
      renderAt('2026-05-30T20:00:00');
      const challengeTr = screen
        .getByText('챌린지 라이브 피드백')
        .closest('tr') as HTMLElement;
      const challengeTone = TONE_CLASSES.filter((c) =>
        challengeTr.classList.contains(c),
      );
      expect(challengeTone).toEqual(['bg-neutral-90']);
      expect(liveMentoringRowTone()).toEqual(challengeTone);
    });
  });
});
