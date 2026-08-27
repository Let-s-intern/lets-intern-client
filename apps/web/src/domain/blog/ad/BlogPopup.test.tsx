const mockCapture = jest.fn();
const posthogMock = {
  capture: (...args: unknown[]) => mockCapture(...args),
  __loaded: true as boolean,
};
jest.mock('posthog-js', () => ({
  __esModule: true,
  get default() {
    return posthogMock;
  },
}));

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

// 진행률은 스크롤 이벤트 대신 값으로 직접 제어한다.
let readingProgress = 0;
jest.mock('../hooks/useReadingProgress', () => ({
  __esModule: true,
  default: () => readingProgress,
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

import axios from '@/utils/axios';
import { BLOG_POPUP_HIDE_UNTIL } from './data/newsletter';
import { BlogPopup } from './BlogPopup';

const axiosGet = axios.get as jest.Mock;
const axiosPost = axios.post as jest.Mock;

const BLOG_ID = 42;
const POPUP_ID = 7;
const IMAGE_URL =
  'https://letscareer-test-bucket.s3.ap-northeast-2.amazonaws.com/popup.png';
const LINK = 'https://example.com/subscribe';

function popupResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        blogPopupInfo: {
          blogPopupId: POPUP_ID,
          imageUrl: IMAGE_URL,
          link: LINK,
          triggerRatio: 0.6,
          ...overrides,
        },
      },
    },
  };
}

function renderPopup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return render(<BlogPopup blogId={BLOG_ID} />, { wrapper: Wrapper });
}

const findPopup = () => screen.findByRole('dialog');
const queryPopup = () => screen.queryByRole('dialog');

describe('BlogPopup', () => {
  beforeEach(() => {
    readingProgress = 0;
    window.localStorage.clear();
    mockCapture.mockClear();
    axiosGet.mockReset();
    axiosPost.mockReset();
    axiosPost.mockResolvedValue({ data: { data: null } });
    axiosGet.mockResolvedValue(popupResponse());
  });

  it('조회에 성공하면 팝업이 뜨기 전에도 노출 수를 1회 보낸다', async () => {
    renderPopup();

    await waitFor(() =>
      expect(axiosPost).toHaveBeenCalledWith(
        `/blog-popup/${POPUP_ID}/impression`,
      ),
    );
    expect(queryPopup()).not.toBeInTheDocument();
  });

  it('진행률이 triggerRatio 에 못 미치면 열리지 않는다', async () => {
    readingProgress = 0.5;
    renderPopup();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(queryPopup()).not.toBeInTheDocument();
  });

  it('triggerRatio 도달 시 1회 열리고 shown 이벤트를 보낸다', async () => {
    readingProgress = 0.6;
    renderPopup();

    expect(await findPopup()).toBeInTheDocument();
    expect(mockCapture).toHaveBeenCalledWith('blog_popup_shown', {
      blog_id: String(BLOG_ID),
      popup_id: POPUP_ID,
      trigger_ratio: 0.6,
    });
  });

  it('triggerRatio 가 비어 오면 끝까지 읽은 시점(1)에 연다', async () => {
    axiosGet.mockResolvedValue(popupResponse({ triggerRatio: null }));
    readingProgress = 0.99;
    const { rerender } = renderPopup();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(queryPopup()).not.toBeInTheDocument();

    readingProgress = 1;
    rerender(<BlogPopup blogId={BLOG_ID} />);
    expect(await findPopup()).toBeInTheDocument();
  });

  it('노출할 팝업이 없으면 아무것도 렌더하지 않는다', async () => {
    axiosGet.mockResolvedValue({ data: { data: { blogPopupInfo: null } } });
    readingProgress = 1;
    renderPopup();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(queryPopup()).not.toBeInTheDocument();
    expect(axiosPost).not.toHaveBeenCalled();
  });

  it('조회가 실패해도 에러 UI 없이 조용히 렌더를 건너뛴다', async () => {
    axiosGet.mockRejectedValue(new Error('network'));
    readingProgress = 1;
    renderPopup();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(queryPopup()).not.toBeInTheDocument();
  });

  it('그 팝업을 하루 숨겨 두면 열리지 않는다', async () => {
    window.localStorage.setItem(
      `${BLOG_POPUP_HIDE_UNTIL}:${POPUP_ID}`,
      String(Date.now() + 10_000),
    );
    readingProgress = 1;
    renderPopup();

    await waitFor(() => expect(axiosGet).toHaveBeenCalled());
    expect(queryPopup()).not.toBeInTheDocument();
  });

  it('다른 팝업을 하루 숨긴 것은 이 팝업에 영향을 주지 않는다', async () => {
    window.localStorage.setItem(
      `${BLOG_POPUP_HIDE_UNTIL}:999`,
      String(Date.now() + 10_000),
    );
    readingProgress = 1;
    renderPopup();

    expect(await findPopup()).toBeInTheDocument();
  });

  it('닫기: 팝업이 사라지고 reason=close 로 기록된다', async () => {
    readingProgress = 1;
    renderPopup();
    await findPopup();

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(queryPopup()).not.toBeInTheDocument();
    expect(mockCapture).toHaveBeenCalledWith('blog_popup_dismissed', {
      blog_id: String(BLOG_ID),
      popup_id: POPUP_ID,
      reason: 'close',
    });
    expect(
      window.localStorage.getItem(`${BLOG_POPUP_HIDE_UNTIL}:${POPUP_ID}`),
    ).toBeNull();
  });

  it('하루 동안 보지 않기: 팝업 단위 키에 차단을 기록한다', async () => {
    readingProgress = 1;
    renderPopup();
    await findPopup();

    await userEvent.click(
      screen.getByRole('button', { name: '하루 동안 보지 않기' }),
    );

    expect(queryPopup()).not.toBeInTheDocument();
    expect(
      window.localStorage.getItem(`${BLOG_POPUP_HIDE_UNTIL}:${POPUP_ID}`),
    ).not.toBeNull();
    expect(mockCapture).toHaveBeenCalledWith('blog_popup_dismissed', {
      blog_id: String(BLOG_ID),
      popup_id: POPUP_ID,
      reason: 'hide_day',
    });
  });

  it('클릭: 클릭 수를 보내고 cta 이벤트를 기록한다', async () => {
    readingProgress = 1;
    renderPopup();
    await findPopup();

    await userEvent.click(
      screen.getByRole('link', { name: '팝업 자세히 보기' }),
    );

    await waitFor(() =>
      expect(axiosPost).toHaveBeenCalledWith(`/blog-popup/${POPUP_ID}/click`),
    );
    expect(mockCapture).toHaveBeenCalledWith('blog_popup_cta_clicked', {
      blog_id: String(BLOG_ID),
      popup_id: POPUP_ID,
    });
  });

  it('링크가 비어 있으면 클릭 영역을 렌더하지 않는다', async () => {
    axiosGet.mockResolvedValue(popupResponse({ link: null }));
    readingProgress = 1;
    renderPopup();

    await findPopup();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
