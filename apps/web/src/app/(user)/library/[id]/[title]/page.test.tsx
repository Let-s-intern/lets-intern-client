const mockFetchQuery = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    fetchQuery: (...args: unknown[]) => mockFetchQuery(...args),
  })),
}));
jest.mock('@/api/magnet/magnet', () => ({
  fetchUserMagnetList: jest.fn(),
  userMagnetDetailQueryOptions: (magnetId: number) => ({ magnetId }),
}));
jest.mock('@/api/program', () => ({
  fetchProgramRecommend: jest.fn(),
  getChallenge: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
// 메타데이터만 본다. 화면 컴포넌트는 불러오지 않는다
jest.mock('@/common/header/MoreHeader', () => () => null);
jest.mock('@/common/HorizontalRule', () => () => null);
jest.mock('@/domain/blog/ui/BlogKakaoShareBtn', () => () => null);
jest.mock('@/domain/blog/ui/BlogLilnkShareBtn', () => () => null);
jest.mock('@/domain/blog/ui/ProgramRecommendCard', () => () => null);
jest.mock('@/domain/blog/ui/BlogHeading2', () => () => null);
jest.mock('@/domain/library/ui/LibraryArticle', () => () => null);
jest.mock('@/domain/library/ui/LibraryLikeBtn', () => () => null);
jest.mock('@/domain/library/ui/LibraryRecommendCard', () => () => null);

import { generateMetadata } from './page';

const detail = (isSearchVisible: boolean) => ({
  magnetInfo: {
    magnetId: 7,
    title: '자소서 자료집',
    description: null,
    desktopThumbnail: null,
    isSearchVisible,
  },
});

describe('마그넷 상세 generateMetadata 검색 노출', () => {
  it('검색 노출을 끄면 noindex 를 넣는다', async () => {
    mockFetchQuery.mockResolvedValue(detail(false));

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: '7' }),
    });

    expect(metadata.robots).toBe('noindex, nofollow');
  });

  it('검색 노출이 켜져 있으면 robots 를 넣지 않아 layout 기본값을 따른다', async () => {
    mockFetchQuery.mockResolvedValue(detail(true));

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: '7' }),
    });

    expect(metadata).not.toHaveProperty('robots');
  });
});
