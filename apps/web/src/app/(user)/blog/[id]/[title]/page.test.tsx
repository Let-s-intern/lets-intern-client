// 블로그 상세의 팝업 마운트 지점 검증.
// 페이지는 async 서버 컴포넌트라 엘리먼트를 await 한 뒤 렌더한다.
// 데이터 계층과 무거운 하위 UI 는 stub — 관심사는 팝업이 걸리는지 여부다.
jest.mock('@sentry/nextjs', () => ({
  __esModule: true,
  setTag: jest.fn(),
  startSpan: (_options: unknown, callback: () => unknown) => callback(),
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

const fetchBlogDataMock = jest.fn();
const fetchRecommendBlogDataMock = jest.fn();
jest.mock('@/api/blog/blog', () => ({
  __esModule: true,
  fetchBlogData: (...args: unknown[]) => fetchBlogDataMock(...args),
  fetchRecommendBlogData: (...args: unknown[]) =>
    fetchRecommendBlogDataMock(...args),
}));

jest.mock('@/api/program', () => ({
  __esModule: true,
  fetchProgramRecommend: jest.fn().mockResolvedValue({ challengeList: [] }),
}));

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

// 팝업 트리거 진행률은 값으로 직접 제어한다.
let readingProgress = 1;
jest.mock('@/domain/blog/hooks/useReadingProgress', () => ({
  __esModule: true,
  default: () => readingProgress,
}));

jest.mock('@/domain/blog/ui/BlogArticle', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/ui/BlogLikeBtn', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/ui/BlogLilnkShareBtn', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/ui/BlogKakaoShareBtn', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/ad/BlogNewsletterSidePanel', () => ({
  __esModule: true,
  default: () => null,
}));
// `@letscareer/api` 의 env 모듈이 `import.meta` 를 써서 jest 가 파싱하지 못한다.
// 이 테스트의 관심사가 아니므로 그 모듈을 끌어오는 카드들도 stub 한다.
jest.mock('@/domain/blog/ui/ProgramRecommendCard', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/ui/BlogRecommendCard', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/blog/utils/captureBlogError', () => ({
  __esModule: true,
  captureBlogError: jest.fn(),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import axios from '@/utils/axios';
import { getBlogSlug } from '@/utils/url';
import BlogDetailPage from './page';

const axiosGet = axios.get as jest.Mock;
const axiosPost = axios.post as jest.Mock;

const BLOG_ID = '42';
const BLOG_TITLE = '테스트 블로그 글';
const POPUP_ID = 7;

function blogDetail() {
  return {
    blogDetailInfo: {
      id: Number(BLOG_ID),
      title: BLOG_TITLE,
      category: 'JOB_PREPARATION_TIPS',
      thumbnail: '',
      description: '설명',
      content: '{}',
      displayDate: '2026-08-01T00:00:00',
      isDisplayed: true,
      likeCount: 0,
    },
  };
}

async function renderPage() {
  const element = await BlogDetailPage({
    params: Promise.resolve({ id: BLOG_ID, title: getBlogSlug(BLOG_TITLE) }),
  });

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return render(element, { wrapper: Wrapper });
}

describe('블로그 상세 페이지의 팝업 마운트', () => {
  beforeEach(() => {
    readingProgress = 1;
    window.localStorage.clear();
    axiosGet.mockReset();
    axiosPost.mockReset();
    axiosPost.mockResolvedValue({ data: { data: null } });
    fetchBlogDataMock.mockReset();
    fetchBlogDataMock.mockResolvedValue(blogDetail());
    fetchRecommendBlogDataMock.mockReset();
    fetchRecommendBlogDataMock.mockResolvedValue({ blogInfos: [] });
  });

  it('팝업이 있으면 글 id 로 조회해 노출한다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          blogPopupInfo: {
            blogPopupId: POPUP_ID,
            imageUrl:
              'https://letscareer-test-bucket.s3.ap-northeast-2.amazonaws.com/popup.png',
            link: 'https://example.com/subscribe',
            triggerRatio: 0.6,
          },
        },
      },
    });

    await renderPage();

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(axiosGet).toHaveBeenCalledWith('/blog-popup', {
      params: { blogId: Number(BLOG_ID) },
    });
  });

  it('팝업이 없으면 아무것도 노출하지 않는다', async () => {
    axiosGet.mockResolvedValue({ data: { data: { blogPopupInfo: null } } });

    await renderPage();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
