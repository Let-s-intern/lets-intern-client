import { render, screen } from '@testing-library/react';
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

  it('page 모드: 저장 시 onClose 미호출, 취소 버튼은 "되돌리기" 라벨', async () => {
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

    await user.click(screen.getByRole('button', { name: '저장하기' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: '되돌리기' }),
    ).toBeInTheDocument();
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
