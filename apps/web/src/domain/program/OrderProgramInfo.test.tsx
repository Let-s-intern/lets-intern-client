import { render, screen } from '@testing-library/react';

import OrderProgramInfo from './OrderProgramInfo';

/*
  결제 상세의 "프로그램 정보" 블록이다. 1대1 라이브 멘토링 분기를 더하면서
  **기존 상품 표시가 그대로인지**를 함께 못박는다 — 이 파일은 챌린지·라이브·VOD·
  가이드북 결제 상세가 모두 지나가는 자리라 회귀가 가장 위험하다.
*/
describe('OrderProgramInfo — 기존 상품 (회귀)', () => {
  it('챌린지는 진행 일정을 날짜 구간으로 보여준다', () => {
    render(
      <OrderProgramInfo
        programType="CHALLENGE"
        title="자기소개서 챌린지"
        startDate="2026-09-01T00:00:00"
        endDate="2026-09-30T00:00:00"
      />,
    );

    expect(screen.getByText('진행 일정')).toBeInTheDocument();
    expect(screen.getByText('2026.09.01 - 2026.09.30')).toBeInTheDocument();
    expect(screen.queryByText('예약 일시')).not.toBeInTheDocument();
  });

  it('라이브는 진행 일정과 진행 방식을 보여준다', () => {
    render(
      <OrderProgramInfo
        programType="LIVE"
        title="라이브 클래스"
        startDate="2026-09-01T00:00:00"
        endDate="2026-09-02T00:00:00"
        progressType="ONLINE"
      />,
    );

    expect(screen.getByText('진행 일정')).toBeInTheDocument();
    expect(screen.getByText('진행 방식')).toBeInTheDocument();
    expect(screen.getByText('온라인')).toBeInTheDocument();
  });

  it('가이드북·VOD 는 열람 방식을 보여준다', () => {
    const { unmount } = render(
      <OrderProgramInfo
        programType="GUIDEBOOK"
        title="가이드북"
        accessMethod="이메일 발송"
      />,
    );
    expect(screen.getByText('열람 방식')).toBeInTheDocument();
    expect(screen.getByText('이메일 발송')).toBeInTheDocument();
    unmount();

    render(
      <OrderProgramInfo
        programType="VOD"
        title="VOD 클래스"
        accessMethod="바로 시청"
      />,
    );
    expect(screen.getByText('열람 방식')).toBeInTheDocument();
  });
});

/*
  1대1 라이브 멘토링은 기간이 아니라 예약 일시다. 시작·종료가 같은 날 30분·60분
  구간이라 "진행 일정 2026.09.13 - 2026.09.13" 으로 그리면 아무것도 알려주지 못한다.
*/
describe('OrderProgramInfo — 1:1 LIVE 멘토링', () => {
  it('예약 일시를 시각 구간으로 보여준다', () => {
    render(
      <OrderProgramInfo
        programType="LIVE_MENTORING"
        title="어드민 1:1 LIVE 멘토링"
        startDate="2026-09-13T10:00:00"
        endDate="2026-09-13T11:00:00"
        mentoringPlan="60분"
      />,
    );

    expect(screen.getByText('예약 일시')).toBeInTheDocument();
    expect(
      screen.getByText(/2026\.09\.13 .* 10:00 ~ 11:00/),
    ).toBeInTheDocument();
    // 기간 표기로 새지 않는다
    expect(screen.queryByText('진행 일정')).not.toBeInTheDocument();
  });

  it('구매 플랜 행을 보여준다', () => {
    render(
      <OrderProgramInfo
        programType="LIVE_MENTORING"
        title="어드민 1:1 LIVE 멘토링"
        startDate="2026-09-13T10:00:00"
        endDate="2026-09-13T10:30:00"
        mentoringPlan="30분"
      />,
    );

    expect(screen.getByText('구매 플랜')).toBeInTheDocument();
    expect(screen.getByText('30분')).toBeInTheDocument();
  });

  it('플랜을 못 받았으면 그 행만 빠진다', () => {
    render(
      <OrderProgramInfo
        programType="LIVE_MENTORING"
        title="어드민 1:1 LIVE 멘토링"
        startDate="2026-09-13T10:00:00"
        endDate="2026-09-13T11:00:00"
      />,
    );

    expect(screen.getByText('예약 일시')).toBeInTheDocument();
    expect(screen.queryByText('구매 플랜')).not.toBeInTheDocument();
  });

  it('예약 시각이 비면 자리를 비워 두고 깨지지 않는다', () => {
    render(
      <OrderProgramInfo programType="LIVE_MENTORING" title="1:1 LIVE 멘토링" />,
    );

    expect(screen.getByText('예약 일시')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

/*
  VOD 이용권(LC-3438)은 기간이 아니라 이용권 상태를 그린다. 상태는 이용권 목록에서
  찾아 넘기며, 조회가 실패하면 넘어오지 않는다.
*/
describe('OrderProgramInfo — VOD 이용권', () => {
  it('진행 일정·진행 방식 대신 넘겨받은 상태를 보여준다', () => {
    render(
      <OrderProgramInfo
        title="VOD 전체 이용권"
        programType="VOD_PASS"
        startDate={null}
        endDate={null}
        vodPassRows={[
          { label: '이용권 상태', value: '이용 중' },
          { label: '이용 종료일', value: '2026.11.11' },
        ]}
      />,
    );

    expect(screen.getByText('VOD 전체 이용권')).toBeInTheDocument();
    expect(screen.getByText('이용 중')).toBeInTheDocument();
    expect(screen.getByText('2026.11.11')).toBeInTheDocument();
    expect(screen.queryByText('진행 일정')).not.toBeInTheDocument();
    expect(screen.queryByText('진행 방식')).not.toBeInTheDocument();
    // 이용권에는 썸네일이 없다
    expect(screen.queryByAltText('thumbnail')).not.toBeInTheDocument();
  });

  it('이용권 조회가 실패해 상태가 없으면 제목만 보여준다', () => {
    render(<OrderProgramInfo title="VOD 전체 이용권" programType="VOD_PASS" />);

    expect(screen.getByText('VOD 전체 이용권')).toBeInTheDocument();
    expect(screen.queryByText('이용권 상태')).not.toBeInTheDocument();
    expect(screen.queryByText('진행 일정')).not.toBeInTheDocument();
  });

  it('썸네일이 있는 다른 상품은 이전처럼 이미지를 보여준다', () => {
    render(
      <OrderProgramInfo
        programType="CHALLENGE"
        title="챌린지"
        thumbnail="/thumb.png"
        startDate="2026-10-01T00:00:00"
        endDate="2026-10-31T00:00:00"
      />,
    );

    expect(screen.getByAltText('thumbnail')).toBeInTheDocument();
  });
});
