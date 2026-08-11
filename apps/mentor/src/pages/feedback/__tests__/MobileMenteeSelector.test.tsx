/**
 * 모바일 멘티 선택 셀렉터의 라벨 분기.
 *
 * 데스크탑 모달과 달리 이 화면은 select option 한 줄에 상태를 압축해 넣는다.
 * 미제출·지각 제출은 피드백 진행 라벨(시작 전/진행중/완료) 대신 제출 상태를 보여줘야
 * 멘토가 "왜 이 멘티는 작성이 안 되는가"를 목록 단계에서 알 수 있다.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import MobileMenteeSelector from '../ui/MobileMenteeSelector';

const noop = () => {};

describe('MobileMenteeSelector 라벨', () => {
  it('제출 상태에 따라 3종 라벨로 갈린다', () => {
    render(
      <MobileMenteeSelector
        attendanceList={[
          {
            id: 1,
            name: '김경험',
            status: 'PRESENT',
            feedbackStatus: 'WAITING',
          },
          {
            id: 2,
            name: '이링크',
            status: 'UPDATED',
            feedbackStatus: 'IN_PROGRESS',
          },
          { id: 3, name: '한지각', status: 'LATE', feedbackStatus: 'WAITING' },
          {
            id: 4,
            name: '오지각',
            status: 'LATE',
            feedbackStatus: 'COMPLETED',
          },
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

    // 정상 제출자만 피드백 진행 라벨을 쓴다.
    expect(screen.getByRole('option', { name: '김경험 · 시작 전' }));
    expect(screen.getByRole('option', { name: '이링크 · 진행중' }));

    // 지각 제출은 feedbackStatus 와 무관하게 제출 상태가 우선한다.
    expect(screen.getByRole('option', { name: '한지각 · 지각 제출' }));
    expect(screen.getByRole('option', { name: '오지각 · 지각 제출' }));

    expect(screen.getByRole('option', { name: '최미제출 · 미제출' }));
  });
});
