import { render, screen } from '@testing-library/react';
import React from 'react';

const mockUseSuspenseQuery = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: (...args: unknown[]) => mockUseSuspenseQuery(...args),
}));
jest.mock('@/api/magnet/magnet', () => ({
  useGetUserMagnetListQuery: () => ({ data: undefined }),
  usePatchMagnetViewDateMutation: () => ({ mutate: jest.fn() }),
  userMagnetDetailQueryOptions: (magnetId: number) => ({ magnetId }),
}));
jest.mock('@/common/boundary/AsyncBoundary', () => ({
  AsyncBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock('@/common/lexical/LexicalContent', () => () => null);
jest.mock('@/store/useAuthStore', () => () => ({ isLoggedIn: true }));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock(
  './StickyApplyBox',
  () =>
    function StickyApplyBox() {
      return <div>자료집 신청하기</div>;
    },
);

import LibraryMainContent from './LibraryMainContent';

const detail = (isApplicable: boolean) => ({
  data: {
    magnetInfo: { mainContents: null, isApplicable },
    viewDate: null,
  },
});

describe('LibraryMainContent 신청 버튼', () => {
  it('신청 가능하면 신청 버튼을 보여준다', () => {
    mockUseSuspenseQuery.mockReturnValue(detail(true));

    render(<LibraryMainContent magnetId={1} />);

    expect(screen.getByText('자료집 신청하기')).toBeInTheDocument();
  });

  it('신청 가능이 꺼져 있으면 신청 버튼을 숨긴다', () => {
    mockUseSuspenseQuery.mockReturnValue(detail(false));

    render(<LibraryMainContent magnetId={1} />);

    expect(screen.queryByText('자료집 신청하기')).not.toBeInTheDocument();
  });
});
