import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgramCategory } from '../programCategoryApi';
import SectionEditor from './SectionEditor';

const mutateAsync = vi.fn(async () => undefined);

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));
vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('../hooks/usePublicCategoryTargets', () => ({
  usePublicCategoryTargets: () => ({ data: [], isLoading: false }),
}));
vi.mock('../ProgramCategoryTargetList', () => ({ default: () => null }));
vi.mock('../programCategoryApi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useUpdateProgramCategory: () => ({ mutateAsync, isPending: false }),
}));

const section = (displayType: ProgramCategory['displayType']) => ({
  id: 7,
  title: '멘토링',
  sortOrder: 0,
  isVisible: true,
  programCount: 0,
  displayType,
});

describe('SectionEditor 카드 모양', () => {
  beforeEach(() => mutateAsync.mockClear());

  it('예전 값(MENTOR)은 카드 목록으로 보이고, 안 바꾸면 보내지 않는다', async () => {
    render(
      <SectionEditor
        category={section('MENTOR')}
        groups={[]}
        onDone={vi.fn()}
      />,
    );
    expect(
      screen
        .getByRole('radio', { name: /카드 목록/ })
        .getAttribute('aria-checked'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({
      id: 7,
      displayType: undefined,
    });
  });

  it('바꾸면 고른 값을 보낸다', async () => {
    render(
      <SectionEditor category={section(null)} groups={[]} onDone={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('radio', { name: /대표 상품 1개/ }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({
      displayType: 'FEATURED',
    });
  });

  it('대표 상품에서 카드 목록으로 바꾸면 AUTO 를 보낸다', async () => {
    render(
      <SectionEditor
        category={section('FEATURED')}
        groups={[]}
        onDone={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: /카드 목록/ }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({ displayType: 'AUTO' });
  });

  it('선택지는 둘뿐이다', () => {
    render(
      <SectionEditor category={section('AUTO')} groups={[]} onDone={vi.fn()} />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });
});
