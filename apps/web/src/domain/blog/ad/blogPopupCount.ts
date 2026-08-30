'use client';

import axios from '@/utils/axios';
import { useEffect, useRef } from 'react';

/**
 * 노출·클릭 수 전송. 광고 지표라 실패해도 팝업 동작에 영향을 주면 안 된다.
 * 예외를 여기서 삼키고 호출부로 전파하지 않는다.
 */
async function sendCount(path: string): Promise<void> {
  try {
    await axios.post(path);
  } catch {
    // no-op: 지표 전송 실패가 팝업 노출이나 링크 이동을 막지 않는다.
  }
}

export function sendBlogPopupImpression(blogPopupId: number): Promise<void> {
  return sendCount(`/blog-popup/${blogPopupId}/impression`);
}

export function sendBlogPopupClick(blogPopupId: number): Promise<void> {
  return sendCount(`/blog-popup/${blogPopupId}/click`);
}

/**
 * 노출 수를 **조회 성공 시점**에 1회 전송한다. 팝업이 화면에 뜬 시점이 아니다.
 * 클릭률의 분모가 "그 글을 본 사람"이어야 글 간 비교가 성립한다 (PRD 7절).
 *
 * 같은 팝업 id 로 리렌더돼도 다시 보내지 않는다(마운트당 1회). 글을 이동해 다른 팝업이
 * 내려오면 그 팝업의 노출은 새로 센다.
 */
export function useBlogPopupImpression(
  blogPopupId: number | null | undefined,
): void {
  const sentIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (blogPopupId === null || blogPopupId === undefined) return;
    if (sentIdRef.current === blogPopupId) return;

    sentIdRef.current = blogPopupId;
    void sendBlogPopupImpression(blogPopupId);
  }, [blogPopupId]);
}
