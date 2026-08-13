import { render, screen } from '@testing-library/react';

import DetailCTAButtons from './DetailCTAButtons';

/** 마지막 슬롯이 9/30 17:30 에 끝나는 기간. */
const BEGINNING = '2030-09-01T10:00:00';
const DEADLINE = '2030-09-30T17:30:00';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('DetailCTAButtons', () => {
  it('슬롯이 없으면(beginning/deadline 이 null) 비활성 바와 안내 문구를 노출한다', () => {
    jest.setSystemTime(new Date('2030-08-12T09:00:00'));
    render(
      <DetailCTAButtons
        title="포폴메이커 멘토의 1:1 멘토링"
        beginning={null}
        deadline={null}
      />,
    );

    // 모바일·데스크탑 두 벌이 함께 렌더된다(반응형 클래스로 하나만 보인다)
    const buttons = screen.getAllByRole('button', {
      name: '현재 예약 가능한 일정이 없습니다',
    });
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => expect(button).toBeDisabled());

    // 공용 CTA 의 "출시알림신청" 으로 빠지지 않아야 한다
    expect(screen.queryByText('출시알림신청')).not.toBeInTheDocument();
    expect(screen.queryByText('지금 바로 신청')).not.toBeInTheDocument();
    // 바 자체는 남아 상품명을 계속 보여준다
    expect(
      screen.getAllByText('포폴메이커 멘토의 1:1 멘토링').length,
    ).toBeGreaterThan(0);
  });

  it('예약 가능한 슬롯이 있으면 기존 신청 CTA 를 노출한다', () => {
    jest.setSystemTime(new Date('2030-08-12T09:00:00'));
    render(
      <DetailCTAButtons
        title="포폴메이커 멘토의 1:1 멘토링"
        beginning={BEGINNING}
        deadline={DEADLINE}
      />,
    );

    expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2);
    expect(screen.queryByText('출시알림신청')).not.toBeInTheDocument();
    expect(
      screen.queryByText('현재 예약 가능한 일정이 없습니다'),
    ).not.toBeInTheDocument();
  });

  /*
    공개 슬롯 API 는 시작이 미래인 슬롯만 내려준다. 첫 슬롯 시작을 그대로 넘기면
    `ApplyCTA` 의 isOutOfDate 가 항상 참이 되어 "출시알림신청" 이 뜬다.
  */
  it('첫 슬롯이 아직 시작 전이어도 신청 가능 상태로 둔다', () => {
    jest.setSystemTime(new Date('2030-08-12T09:00:00'));
    render(
      <DetailCTAButtons
        title="상품"
        beginning={BEGINNING}
        deadline={DEADLINE}
      />,
    );

    expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2);
  });

  it('마지막 슬롯 종료 직전까지는 신청 가능하다', () => {
    jest.setSystemTime(new Date('2030-09-30T17:29:00'));
    render(
      <DetailCTAButtons
        title="상품"
        beginning={BEGINNING}
        deadline={DEADLINE}
      />,
    );

    expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2);
  });

  /*
    기간이 날짜 단위이던 시절에는 deadline 에 endOf('day') 보정을 걸었다.
    슬롯은 시각 단위라 그 보정이 남아 있으면 17:30 에 끝난 일정이 23:59 까지
    신청 가능한 것처럼 보인다.
  */
  it('마지막 슬롯 종료 직후에는 마감으로 판정한다(같은 날이어도)', () => {
    jest.setSystemTime(new Date('2030-09-30T17:31:00'));
    render(
      <DetailCTAButtons
        title="상품"
        beginning={BEGINNING}
        deadline={DEADLINE}
      />,
    );

    expect(screen.getAllByText('출시알림신청')).toHaveLength(2);
    expect(screen.queryByText('지금 바로 신청')).not.toBeInTheDocument();
  });

  it('신청을 누르면 결제 준비 중 알럿을 띄운다', () => {
    jest.setSystemTime(new Date('2030-08-12T09:00:00'));
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <DetailCTAButtons
        title="상품"
        beginning={BEGINNING}
        deadline={DEADLINE}
      />,
    );

    screen.getAllByText('지금 바로 신청')[0].click();

    expect(alertSpy).toHaveBeenCalledWith(
      '결제 기능은 준비 중입니다. 곧 신청하실 수 있어요!',
    );
    alertSpy.mockRestore();
  });
});
