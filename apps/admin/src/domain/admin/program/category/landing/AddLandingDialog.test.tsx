import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import AddLandingDialog from './AddLandingDialog';

const save = vi.fn(async () => true);
vi.mock('../hooks/useSavePlacements', () => ({
  useSavePlacements: () => ({ save, isPending: false }),
}));

const groups: ProgramCategoryGroup[] = [
  {
    id: 1,
    title: '이력서 랜딩',
    sortOrder: 0,
    isVisible: true,
    placements: [],
    categoryList: [],
  },
];

describe('AddLandingDialog', () => {
  it('처음 열었을 때는 오류를 보이지 않는다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    expect(screen.queryByText('페이지 주소가 필요합니다')).toBeNull();
    expect(screen.queryByText('노출 목록을 고르세요')).toBeNull();
  });

  it('비운 채 추가를 누르면 오류를 보이고 저장하지 않는다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('페이지 주소가 필요합니다')).toBeTruthy();
    expect(screen.getByText('노출 목록을 고르세요')).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
  });

  it('주소 칸을 건드리고 나가면 그때 오류를 보인다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    fireEvent.blur(screen.getByLabelText('페이지 주소'));
    expect(screen.getByText('페이지 주소가 필요합니다')).toBeTruthy();
  });
});
