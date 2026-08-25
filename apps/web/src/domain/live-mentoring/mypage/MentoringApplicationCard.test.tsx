import { fireEvent, render, screen } from '@testing-library/react';

import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringApplicationCard, {
  formatReservationPeriod,
  isQuestionButtonVisible,
  questionButtonLabel,
  type MentoringCardPhase,
} from './MentoringApplicationCard';

function makeApplication(
  overrides: Partial<MyLiveMentoringApplication> = {},
): MyLiveMentoringApplication {
  return {
    applicationId: 10,
    paymentId: null,
    mentorName: '어드어드민닉네임',
    thumbnail: 'https://example.test/t.png',
    productName: '어드민 1대1 라이브 멘토링',
    durationMinutes: 60,
    reservationStartAt: '2026-09-13T10:00:00',
    reservationEndAt: '2026-09-13T11:00:00',
    status: 'CONFIRMED',
    questionWritten: true,
    entryLink: null,
    ...overrides,
  };
}

function renderCard(
  phase: MentoringCardPhase,
  overrides: Partial<MyLiveMentoringApplication> = {},
) {
  const onQuestionClick = jest.fn();
  render(
    <MentoringApplicationCard
      application={makeApplication(overrides)}
      phase={phase}
      onQuestionClick={onQuestionClick}
    />,
  );
  return onQuestionClick;
}

/*
  60분 신청의 두 슬롯은 서버가 이미 한 구간으로 합쳐 준다. 화면에서 다시 잇지 않는다.
*/
describe('formatReservationPeriod', () => {
  it('한 구간으로 합쳐진 예약을 시안 표기로 바꾼다', () => {
    expect(
      formatReservationPeriod('2026-09-13T10:00:00', '2026-09-13T11:00:00'),
    ).toBe('26.09.13 (일) 10:00 ~ 11:00');
  });

  it('30분 신청도 같은 형식이다', () => {
    expect(
      formatReservationPeriod('2026-09-14T09:30:00', '2026-09-14T10:00:00'),
    ).toBe('26.09.14 (월) 09:30 ~ 10:00');
  });
});

describe('questionButtonLabel', () => {
  it('질문 미작성이면 작성, 작성됐으면 수정이다', () => {
    expect(questionButtonLabel(false)).toBe('멘토링 질문 작성');
    expect(questionButtonLabel(true)).toBe('멘토링 질문 수정');
  });
});

/*
  서버가 예약 시작 24시간 전에 질문 수정을 닫는다. 그 뒤로는 버튼을 감춘다 —
  눌러도 못 고치는 버튼은 무엇을 하라는 것인지 알 수 없다.
*/
describe('isQuestionButtonVisible — 마감 24시간 경계', () => {
  const START = '2026-09-15T09:00:00';

  it('마감 1분 전이면 보인다', () => {
    expect(
      isQuestionButtonVisible(START, new Date(2026, 8, 14, 8, 59, 0)),
    ).toBe(true);
  });

  it('정확히 24시간 전이면 감춘다', () => {
    expect(isQuestionButtonVisible(START, new Date(2026, 8, 14, 9, 0, 0))).toBe(
      false,
    );
  });

  it('예약 시작 뒤에도 감춘다', () => {
    expect(
      isQuestionButtonVisible(START, new Date(2026, 8, 15, 9, 30, 0)),
    ).toBe(false);
  });

  it('예약 시각을 읽을 수 없으면 감춘다', () => {
    expect(isQuestionButtonVisible('말도 안 되는 값', new Date())).toBe(false);
  });
});

describe('MentoringApplicationCard', () => {
  it('상태 배지·진행기간·구매플랜·상품명을 보여준다', () => {
    renderCard('upcoming');

    expect(screen.getByText('참여예정')).toBeInTheDocument();
    expect(
      screen.getByText(/26\.09\.13 \(일\) 10:00 ~ 11:00/),
    ).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('어드민 1대1 라이브 멘토링')).toBeInTheDocument();
  });

  it('구간마다 배지 문구가 바뀐다', () => {
    const { unmount } = render(
      <MentoringApplicationCard
        application={makeApplication()}
        phase="ongoing"
        onQuestionClick={jest.fn()}
      />,
    );
    expect(screen.getByText('참여중')).toBeInTheDocument();
    unmount();

    render(
      <MentoringApplicationCard
        application={makeApplication()}
        phase="ended"
        onQuestionClick={jest.fn()}
      />,
    );
    expect(screen.getByText('참여완료')).toBeInTheDocument();
  });

  /*
    PRD 4-8 — 입장 링크 발급 구조가 미정이라 서버가 항상 null 을 준다. 버튼을 감추면
    입장 경로가 아예 없는 상품처럼 보인다.
  */
  it('entryLink 가 null 이면 입장 버튼을 감추지 않고 비활성으로 둔다', () => {
    renderCard('upcoming');

    const entryButton = screen.getByRole('button', { name: '멘토링 입장' });
    expect(entryButton).toBeInTheDocument();
    expect(entryButton).toBeDisabled();
  });

  it('entryLink 가 들어오면 입장 버튼이 열린다', () => {
    renderCard('ongoing', { entryLink: 'https://meet.test/abc' });

    expect(screen.getByRole('button', { name: '멘토링 입장' })).toBeEnabled();
  });

  it('질문 버튼을 누르면 신청 id 를 올려 보낸다', () => {
    const onQuestionClick = renderCard('upcoming', { applicationId: 42 });

    fireEvent.click(screen.getByRole('button', { name: '멘토링 질문 수정' }));

    expect(onQuestionClick).toHaveBeenCalledWith(42);
  });

  it('썸네일이 없어도 자리가 무너지지 않는다', () => {
    renderCard('upcoming', { thumbnail: null, productName: null });

    expect(screen.getByText('1:1 LIVE 멘토링')).toBeInTheDocument();
  });
});
