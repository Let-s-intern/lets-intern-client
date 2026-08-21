import { fireEvent, render, screen } from '@testing-library/react';

import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringApplicationCard, {
  formatReservationPeriod,
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

describe('questionButtonLabel — 상태 4가지 조합', () => {
  it('참여 예정 + 질문 미작성이면 작성이다', () => {
    expect(questionButtonLabel('upcoming', false)).toBe('멘토링 질문 작성');
  });

  it('참여 예정 + 질문 작성됨이면 수정이다', () => {
    expect(questionButtonLabel('upcoming', true)).toBe('멘토링 질문 수정');
  });

  /* 시작한 뒤에는 읽기만 한다. 서버도 예약 48시간 전에 수정을 닫는다. */
  it('참여 중·종료면 작성 여부와 무관하게 확인이다', () => {
    expect(questionButtonLabel('ongoing', true)).toBe('멘토링 질문 확인');
    expect(questionButtonLabel('ongoing', false)).toBe('멘토링 질문 확인');
    expect(questionButtonLabel('ended', true)).toBe('멘토링 질문 확인');
    expect(questionButtonLabel('ended', false)).toBe('멘토링 질문 확인');
  });
});

describe('MentoringApplicationCard', () => {
  it('상태 배지·진행기간·구매플랜·상품명을 보여준다', () => {
    renderCard('upcoming');

    expect(screen.getByText('참여예정')).toBeInTheDocument();
    expect(screen.getByText(/26\.09\.13 \(일\) 10:00 ~ 11:00/)).toBeInTheDocument();
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
