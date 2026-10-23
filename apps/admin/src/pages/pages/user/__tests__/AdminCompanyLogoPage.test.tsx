import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

// 두 탭의 내용은 각자 테스트에서 본다. 여기서는 탭 전환·URL·이탈 확인만 본다
vi.mock('@/domain/company-logo/CompanyLogoManager', () => ({
  default: () => <span>로고목록목</span>,
}));
vi.mock('@/domain/company-logo/bulk/CompanyLogoBulkRegister', () => ({
  default: ({
    onDirtyChange,
    onGoToList,
  }: {
    onDirtyChange?: (isDirty: boolean) => void;
    onGoToList: () => void;
  }) => (
    <div>
      <span>일괄등록목</span>
      <button type="button" onClick={() => onDirtyChange?.(true)}>
        행만들기
      </button>
      <button type="button" onClick={onGoToList}>
        목록가기
      </button>
    </div>
  ),
}));

import AdminCompanyLogoPage from '../AdminCompanyLogoPage';

const Search = () => <span data-testid="search">{useLocation().search}</span>;

const renderPage = (entry = '/mentors/company-logos') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <AdminCompanyLogoPage />
      <Search />
    </MemoryRouter>,
  );

afterEach(() => vi.restoreAllMocks());

describe('AdminCompanyLogoPage 탭', () => {
  it('기본 탭은 로고 목록이다', () => {
    renderPage();
    expect(screen.getByText('로고목록목')).toBeInTheDocument();
  });

  it('?tab=bulk 로 일괄 등록 탭을 복원한다', () => {
    renderPage('/mentors/company-logos?tab=bulk');
    expect(screen.getByText('일괄등록목')).toBeInTheDocument();
  });

  it('탭을 누르면 URL 의 tab 을 바꾼다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '일괄 등록' }));
    expect(screen.getByText('일괄등록목')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toHaveTextContent('?tab=bulk');
  });

  it('일괄 등록에 저장하지 않은 행이 있으면 탭을 옮기기 전에 묻는다', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage('/mentors/company-logos?tab=bulk');
    fireEvent.click(screen.getByRole('button', { name: '행만들기' }));

    fireEvent.click(screen.getByRole('button', { name: '로고 목록' }));
    expect(confirm).toHaveBeenCalledWith(
      '저장하지 않은 변경 사항이 있습니다. 이동할까요?',
    );
    expect(screen.getByText('일괄등록목')).toBeInTheDocument();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: '목록가기' }));
    expect(screen.getByText('로고목록목')).toBeInTheDocument();
  });

  it('저장하지 않은 행이 없으면 묻지 않는다', () => {
    const confirm = vi.spyOn(window, 'confirm');
    renderPage('/mentors/company-logos?tab=bulk');
    fireEvent.click(screen.getByRole('button', { name: '로고 목록' }));
    expect(confirm).not.toHaveBeenCalled();
    expect(screen.getByText('로고목록목')).toBeInTheDocument();
  });
});
