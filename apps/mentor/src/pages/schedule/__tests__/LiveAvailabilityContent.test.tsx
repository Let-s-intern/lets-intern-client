import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LiveAvailabilityContent from '../live-availability/LiveAvailabilityContent';

const focusDate = '2026-05-11'; // 월요일

describe('LiveAvailabilityContent', () => {
  it('초기 슬롯 카운트가 푸터에 노출된다', () => {
    render(
      <LiveAvailabilityContent
        initialSlots={[
          { date: focusDate, time: '10:00' },
          { date: focusDate, time: '10:30' },
        ]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );

    expect(screen.getByText(/선택된 가능 시간: 2개/)).toBeInTheDocument();
  });

  it('modal 모드: 저장 버튼 클릭 시 onSave + onClose 호출', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <LiveAvailabilityContent
        initialSlots={[{ date: focusDate, time: '10:00' }]}
        onSave={onSave}
        onClose={onClose}
        mode="modal"
        focusDate={focusDate}
      />,
    );

    await user.click(screen.getByRole('button', { name: '저장하기' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('page 모드: 저장 시 onClose 미호출 + 변경(드래그) 시에만 "되돌리기" 노출/복원', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <LiveAvailabilityContent
        initialSlots={[{ date: focusDate, time: '10:00' }]}
        onSave={onSave}
        onClose={onClose}
        mode="page"
        focusDate={focusDate}
      />,
    );

    // page 모드는 저장해도 닫히지 않는다
    await user.click(screen.getByRole('button', { name: '저장하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    // 저장 직후엔 변경사항이 없으므로 되돌리기는 숨겨진다
    expect(
      screen.queryByRole('button', { name: '되돌리기' }),
    ).not.toBeInTheDocument();

    // 선택된 셀을 드래그(mouseDown)로 해제 → 변경 발생 → 되돌리기 노출
    fireEvent.mouseDown(screen.getByRole('button', { name: '예약 가능' }));
    expect(
      screen.getByRole('button', { name: '되돌리기' }),
    ).toBeInTheDocument();

    // 되돌리기 클릭 시 마지막 저장 시점으로 복원 → 되돌리기 다시 숨김
    await user.click(screen.getByRole('button', { name: '되돌리기' }));
    expect(
      screen.queryByRole('button', { name: '되돌리기' }),
    ).not.toBeInTheDocument();
  });

  it('requiredSlotCount 미달 시 저장 버튼이 disabled', () => {
    render(
      <LiveAvailabilityContent
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
        requiredSlotCount={3}
      />,
    );

    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
  });

  it('requiredSlotCount 만족 시 저장 버튼 활성화', () => {
    render(
      <LiveAvailabilityContent
        initialSlots={[
          { date: focusDate, time: '10:00' },
          { date: focusDate, time: '10:30' },
          { date: focusDate, time: '11:00' },
        ]}
        onSave={() => {}}
        focusDate={focusDate}
        requiredSlotCount={3}
      />,
    );

    expect(screen.getByRole('button', { name: '저장하기' })).not.toBeDisabled();
  });
});
