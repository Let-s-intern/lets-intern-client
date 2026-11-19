import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import AddLandingDialog from './AddLandingDialog';

const { save, create, refetch } = vi.hoisted(() => ({
  save: vi.fn(async () => true),
  create: vi.fn(async () => undefined),
  refetch: vi.fn(),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));
vi.mock('../hooks/useSavePlacements', () => ({
  useSavePlacements: () => ({ save, isPending: false }),
}));
vi.mock('../programCategoryApi', () => ({
  useCreateProgramCategoryGroup: () => ({
    mutateAsync: create,
    isPending: false,
  }),
  useAdminProgramCategoryGroupsQuery: () => ({ refetch }),
}));

const group = (
  id: number,
  title: string,
  extra: Partial<ProgramCategoryGroup> = {},
): ProgramCategoryGroup => ({
  id,
  title,
  sortOrder: 0,
  isVisible: true,
  placements: [],
  categoryList: [],
  ...extra,
});

const groups = [
  group(1, '이력서 랜딩', {
    placements: [{ placementType: 'LANDING', slug: 'resume' }],
  }),
];

const typeAddress = (value: string) =>
  fireEvent.change(screen.getByLabelText('페이지 주소'), {
    target: { value },
  });

describe('AddLandingDialog', () => {
  beforeEach(() => {
    save.mockClear();
    create.mockClear();
    refetch.mockReset();
  });

  it('처음 열었을 때는 오류를 보이지 않는다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    expect(screen.queryByText('페이지 주소가 필요합니다')).toBeNull();
    expect(screen.queryByText('이름을 넣어 주세요')).toBeNull();
  });

  it('비운 채 추가를 누르면 오류를 보이고 아무것도 만들지 않는다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('페이지 주소가 필요합니다')).toBeTruthy();
    expect(screen.getByText('이름을 넣어 주세요')).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('주소 칸을 건드리고 나가면 그때 오류를 보인다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    fireEvent.blur(screen.getByLabelText('페이지 주소'));
    expect(screen.getByText('페이지 주소가 필요합니다')).toBeTruthy();
  });

  it('이미 쓰는 주소면 목록을 만들기 전에 막는다', () => {
    render(<AddLandingDialog groups={groups} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('페이지 이름'), {
      target: { value: '새 페이지' },
    });
    typeAddress('resume');
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('이미 쓰고 있는 주소예요')).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });

  it('새 이름이면 목록을 만들고, 다시 받은 목록에서 찾아 주소를 붙인다', async () => {
    refetch.mockResolvedValue({
      data: [...groups, group(8, '면접'), group(9, '면접')],
    });
    const onClose = vi.fn();
    render(<AddLandingDialog groups={groups} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('페이지 이름'), {
      target: { value: ' 면접 ' },
    });
    typeAddress('interview');
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    await waitFor(() => expect(save).toHaveBeenCalled());
    expect(create).toHaveBeenCalledWith({ title: '면접' });
    expect(save).toHaveBeenCalledWith(9, [
      {
        placementType: 'LANDING',
        slug: 'interview',
        mergeChallenges: true,
        matchMode: 'ANY',
      },
    ]);
    expect(onClose).toHaveBeenCalled();
  });
});
