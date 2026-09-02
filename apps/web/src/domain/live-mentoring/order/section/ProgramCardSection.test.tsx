import { render, screen } from '@testing-library/react';

import type { LiveMentoringOrderDraft } from '../hooks/useOrderDraft';
import ProgramCardSection from './ProgramCardSection';

const slot = (slotId: number, time: string, endTime: string) => ({
  slotId,
  date: '2026-09-19',
  time,
  startDate: `2026-09-19T${time}:00`,
  endDate: `2026-09-19T${endTime}:00`,
});

function makeDraft(
  overrides: Partial<LiveMentoringOrderDraft> = {},
): LiveMentoringOrderDraft {
  return {
    mentorId: 1,
    openingId: 6,
    productName: '어드민 1대1 라이브 멘토링',
    thumbnail: null,
    duration: 60,
    durationPriceId: 5,
    price: 60000,
    slots: [slot(158, '12:00', '12:30'), slot(159, '12:30', '13:00')],
    mentoringCategory: 'PERSONAL_STATEMENT',
    reservationChangeAgreed: true,
    ...overrides,
  };
}

describe('ProgramCardSection', () => {
  /*
    60분 플랜은 30분짜리 두 칸이다. 그대로 두면 "12:00~12:30, 12:30~13:00" 두 줄이
    되는데 사용자가 산 것은 한 시간짜리 멘토링 하나다. 서버도 신청 생성 응답에서
    같은 방식으로 startAt/endAt 을 만든다.
  */
  it('60분 플랜의 연속 2슬롯을 한 구간으로 합쳐 보여준다', () => {
    render(<ProgramCardSection draft={makeDraft()} />);

    expect(
      screen.getByText('2026.09.19 (토) 12:00 ~ 13:00'),
    ).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
  });

  it('30분 플랜은 한 칸 그대로 보여준다', () => {
    render(
      <ProgramCardSection
        draft={makeDraft({
          duration: 30,
          price: 35000,
          slots: [slot(148, '10:30', '11:00')],
        })}
      />,
    );

    expect(
      screen.getByText('2026.09.19 (토) 10:30 ~ 11:00'),
    ).toBeInTheDocument();
    expect(screen.getByText('30분')).toBeInTheDocument();
  });

  /* 슬롯 순서는 계약에 없다. 뒤집혀 들어와도 구간은 같아야 한다. */
  it('슬롯이 역순으로 들어와도 같은 구간을 만든다', () => {
    render(
      <ProgramCardSection
        draft={makeDraft({
          slots: [slot(159, '12:30', '13:00'), slot(158, '12:00', '12:30')],
        })}
      />,
    );

    expect(
      screen.getByText('2026.09.19 (토) 12:00 ~ 13:00'),
    ).toBeInTheDocument();
  });

  it('상품명과 1:1 LIVE 멘토링 라벨을 함께 보여준다', () => {
    render(<ProgramCardSection draft={makeDraft()} />);

    expect(screen.getByText('1:1 LIVE 멘토링')).toBeInTheDocument();
    expect(screen.getByText('어드민 1대1 라이브 멘토링')).toBeInTheDocument();
  });
});
