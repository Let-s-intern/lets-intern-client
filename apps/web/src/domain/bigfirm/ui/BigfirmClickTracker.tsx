'use client';

import { useEffect } from 'react';

type ClarityWindow = Window & {
  clarity?: (command: string, ...args: string[]) => void;
};

/**
 * 대기업 멘토관의 버튼 클릭을 GTM(dataLayer)과 Clarity 에 남긴다.
 * 페이지가 서버 컴포넌트라 버튼마다 onClick 을 달지 않고, `data-track-*` 를 단 요소를 문서 한 곳에서 잡는다.
 * next/link 가 클릭에 preventDefault 를 걸기 때문에 defaultPrevented 로 거르지 않는다.
 * 이벤트 스펙: `.claude/tasks/memos/2026-11-04-GTM-대기업멘토관-이벤트-설정.md` (워크스페이스 루트 기준)
 */
export default function BigfirmClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-track-target]',
      );
      if (!element) return;

      const { trackTarget = '', trackLocation = '' } = element.dataset;
      window.dataLayer?.push({
        event: 'bigfirm_click',
        button_target: trackTarget,
        button_location: trackLocation,
        click_url: element.getAttribute('href') ?? '',
        page_url: window.location.pathname,
        mentor_id: element.dataset.trackMentorId ?? '',
        tab: element.dataset.trackTab ?? '',
      });

      const { clarity } = window as ClarityWindow;
      clarity?.('event', 'bigfirm_click');
      clarity?.('set', 'button_target', trackTarget);
      clarity?.('set', 'button_location', trackLocation);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
