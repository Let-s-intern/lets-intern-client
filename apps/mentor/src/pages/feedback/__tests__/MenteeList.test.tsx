/**
 * MenteeList 배지 분기 — 서면·라이브 공용 컴포넌트라 양쪽을 함께 검증한다.
 *
 * 라이브 모달(`LiveFeedbackReservationModal`)은 이 리스트에 `status: null` 을 넘긴다.
 * 서면 판정이 null 을 미제출로 취급하면 예약만 된 라이브 세션이 전부 '미제출' 배지가
 * 되는데, 타입이 `string | null` 이라 타입체크로는 잡히지 않는다. 그래서 테스트로 막는다.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import MenteeList from '../ui/MenteeList';

const noop = () => {};

describe('MenteeList — 서면 배지', () => {
  it('제출 상태에 따라 미제출·지각 제출·피드백 진행 배지로 갈린다', () => {
    render(
      <MenteeList
        attendanceList={[
          {
            id: 1,
            name: '김경험',
            status: 'PRESENT',
            feedbackStatus: 'WAITING',
          },
          { id: 2, name: '한지각', status: 'LATE', feedbackStatus: 'WAITING' },
          {
            id: null,
            name: '최미제출',
            status: 'ABSENT',
            feedbackStatus: null,
          },
        ]}
        selectedIndex={0}
        onSelectByIndex={noop}
      />,
    );

    expect(screen.getByText('지각 제출')).toBeInTheDocument();
    expect(screen.getByText('미제출')).toBeInTheDocument();
    // 정상 제출자는 기존대로 피드백 진행 상태 배지를 쓴다.
    expect(screen.getByText('진행 전')).toBeInTheDocument();
  });
});

describe('MenteeList — 라이브 모달 공용 경로', () => {
  /**
   * 라이브가 넘기는 항목 형태 (LiveFeedbackReservationModal.tsx:322-336).
   * `status` 는 항상 null, `liveStatus` 는 세션이 RESERVED 면 undefined 다.
   */
  const liveItem = {
    id: 501,
    name: '박라이브',
    status: null,
    feedbackStatus: 'WAITING' as const,
    date: '2026-05-04',
    startTime: '10:00',
    endTime: '10:30',
  };

  it('liveStatus 가 없는(예약만 된) 세션을 미제출로 표시하지 않는다', () => {
    render(
      <MenteeList
        attendanceList={[liveItem]}
        selectedIndex={0}
        onSelectByIndex={noop}
      />,
    );

    expect(screen.queryByText('미제출')).toBeNull();
    expect(screen.queryByText('지각 제출')).toBeNull();
    expect(screen.getByText('진행 전')).toBeInTheDocument();
  });

  it('liveStatus 가 있으면 라이브 배지 경로를 탄다', () => {
    render(
      <MenteeList
        attendanceList={[{ ...liveItem, liveStatus: 'completed' }]}
        selectedIndex={0}
        onSelectByIndex={noop}
      />,
    );

    expect(screen.queryByText('미제출')).toBeNull();
    expect(screen.getByText('진행 완료')).toBeInTheDocument();
  });
});
