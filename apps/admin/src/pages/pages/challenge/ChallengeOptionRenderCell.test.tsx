import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Row } from '@/types/interface';

import { getMissionColumns } from './ChallengeOperationCells';

const mockOptions = vi.hoisted(() => ({
  challengeOptionList: [] as {
    challengeOptionId: number;
    title?: string | null;
    code?: string | null;
    type?: 'WRITTEN_FEEDBACK' | 'LIVE_FEEDBACK' | null;
  }[],
}));

vi.mock('@/api/challenge/challengeOption', () => ({
  useGetChallengeOptions: () => ({ data: mockOptions }),
}));
vi.mock('@/hooks/useUpdateMissionOption', () => ({
  useUpdateMissionOption: () => ({ updateMissionOption: vi.fn() }),
}));

const renderOptionCell = (challengeOptionId: number | null) => {
  const column = getMissionColumns().find(
    (c) => c.field === 'challengeOptionId',
  );
  if (!column?.renderCell) {
    throw new Error('옵션 컬럼 renderCell 을 찾지 못했습니다.');
  }
  const params = {
    value: challengeOptionId,
    row: { id: 10, missionType: 'GENERAL' } as unknown as Row,
  };
  return render(<>{column.renderCell(params as never)}</>);
};

describe('미션 등록 화면 옵션 셀', () => {
  beforeEach(() => {
    mockOptions.challengeOptionList = [
      {
        challengeOptionId: 1,
        title: '서면 피드백',
        code: 'WFB1',
        type: 'WRITTEN_FEEDBACK',
      },
      { challengeOptionId: 2, title: '   ', code: 'BASIC' },
      { challengeOptionId: 3, title: null, code: 'PREMIUM' },
    ];
  });

  it('선택한 옵션의 title 을 보여준다', () => {
    renderOptionCell(1);

    expect(screen.getByRole('combobox')).toHaveTextContent('서면 피드백');
    expect(screen.getByRole('combobox')).not.toHaveTextContent('WFB1');
  });

  it('title 이 공백이면 code 를 보여준다', () => {
    renderOptionCell(2);

    expect(screen.getByRole('combobox')).toHaveTextContent('BASIC');
  });

  it('title 이 없으면 code 를 보여준다', () => {
    renderOptionCell(3);

    expect(screen.getByRole('combobox')).toHaveTextContent('PREMIUM');
  });

  it('선택한 옵션이 없으면 없음을 보여준다', () => {
    renderOptionCell(null);

    expect(screen.getByRole('combobox')).toHaveTextContent('없음');
  });

  it('드롭다운 항목도 title 우선, 없으면 code 로 보여준다', () => {
    renderOptionCell(null);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = within(screen.getByRole('listbox'));

    expect(listbox.getByText('서면 피드백')).toBeInTheDocument();
    expect(listbox.queryByText('WFB1')).not.toBeInTheDocument();
    expect(listbox.getByText('BASIC')).toBeInTheDocument();
    expect(listbox.getByText('PREMIUM')).toBeInTheDocument();
  });
});
