import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AttendanceItem } from '@/schema';

import TableRow from './TableRow';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('@/api/attendance/attendance', () => ({
  usePatchAdminAttendance: () => ({ mutateAsync: vi.fn() }),
}));
vi.mock('@/api/challenge/challenge', () => ({
  getChallengeAttendancesQueryKey: () => [],
}));
vi.mock('@/api/review/review', () => ({
  getAdminProgramReviewQueryKey: () => [],
}));
vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  useAdminCurrentChallenge: () => ({ currentChallenge: { id: 1 } }),
}));
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));
vi.mock('./ChoiceCheckbox', () => ({ default: () => null }));
vi.mock('./CommentCell', () => ({ default: () => null }));
vi.mock('./ResultDropdown', () => ({ default: () => null }));
vi.mock('./ReviewCell', () => ({ default: () => null }));
vi.mock('./StatusDropdown', () => ({ default: () => null }));

const renderRow = (
  option: Pick<AttendanceItem, 'optionCodes' | 'optionTitles'>,
) => {
  const attendanceItem = {
    ...option,
    attendance: {
      id: 1,
      name: '홍길동',
      email: 'hong@example.com',
      result: 'PASS',
      createDate: null,
      lastModifiedDate: null,
    },
  } as unknown as AttendanceItem;

  return render(
    <TableRow
      attendanceItem={attendanceItem}
      bgColor="LIGHT"
      isChecked={false}
      setIsCheckedList={vi.fn()}
      refetch={vi.fn()}
    />,
  );
};

describe('제출 상세 표 옵션명 셀', () => {
  it('옵션이 여러 개면 옵션명을 쉼표로 이어서 보여준다', () => {
    renderRow({
      optionCodes: ['WFB1', 'BASIC'],
      optionTitles: ['서면 피드백', 'BASIC'],
    });

    expect(screen.getByText('서면 피드백, BASIC')).toBeInTheDocument();
    expect(screen.queryByText('WFB1, BASIC')).not.toBeInTheDocument();
  });

  it('optionTitles 가 비어 있으면(구버전 응답) 옵션 코드로 대체한다', () => {
    renderRow({ optionCodes: ['WFB1', 'BASIC'], optionTitles: [] });

    expect(screen.getByText('WFB1, BASIC')).toBeInTheDocument();
  });

  it('옵션이 없으면 - 를 보여준다', () => {
    renderRow({ optionCodes: [], optionTitles: [] });

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
