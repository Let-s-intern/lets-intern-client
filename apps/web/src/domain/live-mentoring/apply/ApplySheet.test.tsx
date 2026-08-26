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

/*
  멘토는 오픈 설정에서 `자기소개서` 만 골랐는데(`categories`), 상세 페이지에는
  `이력서` 카드도 남아 있다. 신청 화면에는 고른 것만 나와야 한다.
*/
const DETAIL = {
  title: '어드민 1대1 라이브 멘토링',
  categories: ['PERSONAL_STATEMENT'],
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
        {
          id: 2,
          typeName: '이력서',
          title: '고르지 않은 유형',
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
  // 60분 플랜은 연속 두 칸이 버튼 하나로 합쳐져 있다
  fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:30' }));
  fireEvent.click(screen.getByRole('radio', { name: '자기소개서' }));
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
      mentoringCategory: 'PERSONAL_STATEMENT',
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

describe('ApplySheet 플랜 잠금', () => {
  const sixtyRadio = () =>
    screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ });

  it('시간을 고르면 플랜이 잠기고 선택을 풀면 다시 열린다', () => {
    openSheet();
    fireEvent.click(sixtyRadio());
    expect(sixtyRadio()).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:30' }));
    expect(sixtyRadio()).toBeDisabled();

    // 같은 버튼을 다시 누르면 선택이 풀린다
    fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:30' }));
    expect(sixtyRadio()).toBeEnabled();
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

  /*
    플랜은 항상 하나가 골라져 있어야 해서 삭제 버튼을 없앴다.
    대신 다른 플랜으로 바꾸면 슬롯 선택이 함께 풀리는지를 본다.
  */
  it('멘토가 오픈 설정에서 고른 유형만 보여준다', () => {
    openSheet();

    expect(
      screen.getByRole('radio', { name: '자기소개서' }),
    ).toBeInTheDocument();
    // 상세 페이지에 카드가 남아 있어도 고르지 않은 유형은 뜨지 않는다
    expect(screen.queryByRole('radio', { name: '이력서' })).toBeNull();
  });

  it('플랜을 바꾸면 슬롯 선택이 함께 풀린다', () => {
    openSheet();
    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: '09:30 ~ 10:30' }));

    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(30분\)/ }),
    );

    expect(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(30분\)/ }),
    ).toBeChecked();
    // 슬롯 선택이 함께 풀려 신청하기는 잠겨 있다
    expect(submitButton()).toBeDisabled();
  });
});
