'use client';

import { useEffect } from 'react';

type ClarityWindow = Window & {
  clarity?: (command: string, ...args: string[]) => void;
};

/**
 * 랜딩의 버튼 클릭을 GTM(dataLayer)과 Clarity 에 남긴다.
 * 버튼마다 onClick 을 달면 서버 컴포넌트인 랜딩을 클라이언트로 바꿔야 해서,
 * `data-track-target`·`data-track-location` 을 단 링크를 문서 한 곳에서 잡는다.
 * 이벤트 스펙: `.claude/tasks/memos/2026-10-29-GTM-멘토합류-이벤트-설정.md` (워크스페이스 루트 기준)
 */
export default function MentorJoinClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // 카드 목록을 끌고 놓은 클릭은 DragScroll 이 막는다. 이동이 없으니 세지 않는다
      if (event.defaultPrevented) return;
      const element = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-track-target]',
      );
      if (!element) return;

      const target = element.dataset.trackTarget ?? '';
      const location = element.dataset.trackLocation ?? '';
      window.dataLayer?.push({
        event: 'mentor_join_click',
        button_target: target,
        button_location: location,
        click_url: element.getAttribute('href') ?? '',
        page_url: window.location.pathname,
      });

      const { clarity } = window as ClarityWindow;
      clarity?.('event', 'mentor_join_click');
      clarity?.('set', 'button_target', target);
      clarity?.('set', 'button_location', location);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
