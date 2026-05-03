import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MentorOpenScheduleModal from '../modal/MentorOpenScheduleModal';

const focusDate = '2026-05-11';

describe('MentorOpenScheduleModal (콘텐츠 추출 후 회귀)', () => {
  it('isOpen=false 일 때 본문을 렌더하지 않는다', () => {
    render(
      <MentorOpenScheduleModal
        isOpen={false}
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    expect(
      screen.queryByRole('button', { name: '저장하기' }),
    ).not.toBeInTheDocument();
  });

  it('isOpen=true 일 때 콘텐츠가 마운트되고 모달 모드 라벨("취소") 노출', () => {
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    expect(screen.getByRole('button', { name: '저장하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 onClose 호출', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={onClose}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('저장 버튼 클릭 시 onSave + onClose 모두 호출', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={onClose}
        initialSlots={[{ date: focusDate, time: '10:00' }]}
        onSave={onSave}
        focusDate={focusDate}
      />,
    );
    await user.click(screen.getByRole('button', { name: '저장하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('challengeTitle 이 상단 바에 노출된다', () => {
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        challengeTitle="테스트 챌린지"
        focusDate={focusDate}
      />,
    );
    expect(screen.getByText('테스트 챌린지')).toBeInTheDocument();
  });
});
