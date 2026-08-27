'use client';

import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const BLOG_POPUP_QUERY_KEY = 'BlogPopupQueryKey';

/**
 * 서버 `BlogPopupVo` 와 1:1.
 * 어드민 식별용 `title` 과 운영 지표(`impressionCount`, `clickCount`)는 웹에 내려오지 않는다.
 */
export const blogPopupSchema = z.object({
  blogPopupId: z.number(),
  imageUrl: z.string().nullish(),
  link: z.string().nullish(),
  /** 본문 읽기 진행률 임계값(0~1). 서버 기본값은 1.0 이다. */
  triggerRatio: z.number().nullish(),
});

export type BlogPopup = z.infer<typeof blogPopupSchema>;

/** 노출할 팝업이 없으면 `blogPopupInfo` 가 null 이다. 404 가 아니다. */
const getBlogPopupResponseSchema = z.object({
  blogPopupInfo: blogPopupSchema.nullish(),
});

/**
 * 글 1건에 노출할 팝업을 조회한다. 여러 팝업이 겹쳐도 서버가 1건을 골라 내려주므로
 * 클라이언트는 고르지 않는다.
 *
 * 광고라 실패가 화면에 드러나면 안 된다. 재시도하지 않고, 에러는 호출부에서 무시한다
 * (`BlogPopup` 은 팝업 데이터가 없으면 아무것도 렌더하지 않는다).
 */
export function useBlogPopupQuery(blogId: number) {
  return useQuery({
    queryKey: [BLOG_POPUP_QUERY_KEY, blogId] as const,
    queryFn: async () => {
      const res = await axios.get('/blog-popup', { params: { blogId } });
      return (
        getBlogPopupResponseSchema.parse(res.data.data).blogPopupInfo ?? null
      );
    },
    retry: false,
  });
}
