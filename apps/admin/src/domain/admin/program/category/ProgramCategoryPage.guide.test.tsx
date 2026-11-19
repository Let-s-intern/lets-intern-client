import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GUIDE_SEEN_KEY } from './utils/guideSeen';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/domain/admin/ui/header/Header', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('@/domain/admin/ui/heading/Heading', () => ({
  default: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));
vi.mock('./hooks/useCategoryActions', () => ({
  useCategoryActions: () => ({}),
}));
vi.mock('./programCategoryApi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAdminProgramCategoryGroupsQuery: () => ({ data: [], isLoading: false }),
}));

import ProgramCategoryPage from './ProgramCategoryPage';

const renderPage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProgramCategoryPage />
    </QueryClientProvider>,
  );

describe('사용법 창', () => {
  beforeEach(() => window.localStorage.clear());

  it('처음 들어오면 저절로 뜨고, 닫으면 다시 뜨지 않는다', () => {
    const { unmount } = renderPage();
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    fireEvent.click(screen.getByRole('button', { name: '시작하기' }));
    expect(window.localStorage.getItem(GUIDE_SEEN_KEY)).toBe('1');
    unmount();

    renderPage();
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '사용법' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
