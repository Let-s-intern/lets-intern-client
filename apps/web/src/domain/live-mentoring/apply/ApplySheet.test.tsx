import { fireEvent, render, screen } from '@testing-library/react';

import type {
  LiveMentorDetail,
  LiveMentoringSlot,
} from '@/api/live-mentoring/liveMentoringSchema';
import ApplySheet from './ApplySheet';
import { useApplySheetState } from './hooks/useApplySheetState';
import type { ApplyDraft } from './types';

const DATE = '2026-09-14';

const slot = (
  slotId: number,
  time: string,
  endTime: string,
): LiveMentoringSlot => ({
  slotId,
  startDate: `${DATE}T${time}:00`,
  endDate: `${DATE}T${endTime}:00`,
  status: 'OPEN',
});

const SLOTS = [
  slot(144, '09:30', '10:00'),
  slot(145, '10:00', '10:30'),
  slot(146, '10:30', '11:00'),
];

const DETAIL = {
  title: '어드민 1대1 라이브 멘토링',
  durationPrices: [
    { durationPriceId: 4, duration: 30, price: 35000 },
    { durationPriceId: 5, duration: 60, price: 60000 },
  ],
  template: {
    mentoringTypes: {
      items: [
        {
          id: 1,
          typeName: '자기소개서',
          title: '제목',
          description: '설명',
          tags: [],
        },
      ],
    },
  },
} as unknown as LiveMentorDetail;

/** 시트는 상세 페이지가 상태를 들고 있다. 테스트도 같은 배선을 쓴다. */
function Harness({ onSubmit }: { onSubmit: (draft: ApplyDraft) => void }) {
  const sheet = useApplySheetState();
  return (
    <>
      <button type="button" onClick={() => sheet.open()}>
        시트 열기
      </button>
      <ApplySheet
        detail={DETAIL}
        slots={SLOTS}
        sheet={sheet}
        onSubmit={onSubmit}
      />
    </>
  );
}

function openSheet() {
  const onSubmit = jest.fn();
  render(<Harness onSubmit={onSubmit} />);
  fireEvent.click(screen.getByRole('button', { name: '시트 열기' }));
  return onSubmit;
}

const submitButton = () => screen.getByRole('button', { name: '신청하기' });

/** 60분 플랜 + 연속 2슬롯 + 유형 + 동의까지 전부 채운다. */
function fillEverything() {
  fireEvent.click(
    screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
  );
  fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:00' }));
  fireEvent.click(screen.getByRole('button', { name: /멘토링 유형 선택/ }));
  fireEvent.click(screen.getByRole('checkbox', { name: '자기소개서' }));
  fireEvent.click(screen.getByRole('checkbox', { name: /예약 시간 변경/ }));
}

describe('ApplySheet 제출 조건', () => {
  it('필수 입력이 비어 있으면 신청하기가 잠겨 있다', () => {
    openSheet();
    expect(submitButton()).toBeDisabled();
  });

  it('모두 채우면 신청하기가 열리고 draft 를 그대로 올려 보낸다', () => {
    const onSubmit = openSheet();
    fillEverything();

    expect(submitButton()).toBeEnabled();
    fireEvent.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith({
      duration: 60,
      slots: [
        expect.objectContaining({ slotId: 144, time: '09:30' }),
        expect.objectContaining({ slotId: 145, time: '10:00' }),
      ],
      mentoringTypeIds: [1],
      agreedToScheduleChange: true,
    });
  });

  it('동의를 풀면 다시 잠기고 눌러도 onSubmit 이 불리지 않는다', () => {
    const onSubmit = openSheet();
    fillEverything();
    fireEvent.click(screen.getByRole('checkbox', { name: /예약 시간 변경/ }));

    expect(submitButton()).toBeDisabled();
    fireEvent.click(submitButton());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('ApplySheet 총 결제 금액', () => {
  it('플랜을 고르기 전에는 안내 문구와 0원을 보여준다', () => {
    openSheet();

    expect(
      screen.getByText('플랜을 선택하면 결제 금액이 표시됩니다.'),
    ).toBeInTheDocument();
    expect(screen.getByText('0원')).toBeInTheDocument();
  });

  it('60분을 고르면 합계가 60,000원이다', () => {
    openSheet();
    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );

    // 플랜 행·요약 행·합계 세 곳에 나온다
    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(3);
  });

  it('삭제 버튼을 누르면 플랜과 슬롯 선택이 함께 풀린다', () => {
    openSheet();
    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:00' }));

    fireEvent.click(screen.getByRole('button', { name: '선택한 플랜 삭제' }));

    expect(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    ).not.toBeChecked();
    expect(
      screen.getByText('플랜을 선택하면 결제 금액이 표시됩니다.'),
    ).toBeInTheDocument();
    // 슬롯 선택도 함께 풀려 신청하기는 여전히 잠겨 있다
    expect(submitButton()).toBeDisabled();
  });
});
