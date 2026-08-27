import { renderHook, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import {
  sendBlogPopupClick,
  sendBlogPopupImpression,
  useBlogPopupImpression,
} from './blogPopupCount';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const axiosPost = axios.post as jest.Mock;

describe('blogPopupCount', () => {
  beforeEach(() => {
    axiosPost.mockReset();
    axiosPost.mockResolvedValue({ data: { data: null } });
  });

  it('노출·클릭 수를 각각의 엔드포인트로 보낸다', async () => {
    await sendBlogPopupImpression(7);
    await sendBlogPopupClick(7);

    expect(axiosPost).toHaveBeenNthCalledWith(1, '/blog-popup/7/impression');
    expect(axiosPost).toHaveBeenNthCalledWith(2, '/blog-popup/7/click');
  });

  it('전송이 실패해도 예외를 전파하지 않는다', async () => {
    axiosPost.mockRejectedValue(new Error('network'));

    await expect(sendBlogPopupImpression(7)).resolves.toBeUndefined();
    await expect(sendBlogPopupClick(7)).resolves.toBeUndefined();
  });

  describe('useBlogPopupImpression', () => {
    it('팝업 id 가 들어오면 노출 수를 1회 보낸다', async () => {
      renderHook(() => useBlogPopupImpression(7));

      await waitFor(() =>
        expect(axiosPost).toHaveBeenCalledWith('/blog-popup/7/impression'),
      );
      expect(axiosPost).toHaveBeenCalledTimes(1);
    });

    it('같은 팝업으로 리렌더돼도 다시 보내지 않는다', async () => {
      const { rerender } = renderHook(
        ({ id }: { id: number }) => useBlogPopupImpression(id),
        { initialProps: { id: 7 } },
      );

      rerender({ id: 7 });
      rerender({ id: 7 });

      await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(1));
    });

    it('조회 전(undefined)이나 팝업이 없으면(null) 보내지 않는다', async () => {
      renderHook(() => useBlogPopupImpression(undefined));
      renderHook(() => useBlogPopupImpression(null));

      await waitFor(() => expect(axiosPost).not.toHaveBeenCalled());
    });

    it('다른 팝업이 내려오면 그 팝업의 노출을 새로 센다', async () => {
      const { rerender } = renderHook(
        ({ id }: { id: number }) => useBlogPopupImpression(id),
        { initialProps: { id: 7 } },
      );

      rerender({ id: 9 });

      await waitFor(() => expect(axiosPost).toHaveBeenCalledTimes(2));
      expect(axiosPost).toHaveBeenNthCalledWith(2, '/blog-popup/9/impression');
    });
  });
});
