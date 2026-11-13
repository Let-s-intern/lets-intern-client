'use client';

import AiChat from '@/domain/ai-chat/AiChat';
import { useEffect, useRef, useState } from 'react';

/**
 * 한 화면 높이 = 뷰포트 - 고정 네비바·여백(모바일 96px / 데스크톱 171px)
 * - 제목·입력창·간격(모바일 약 196px + 하단 탭바 64px / 데스크톱 약 150px + 아래 여백 16px)
 */
const MOBILE_CHAT_HEIGHT = 'h-[calc(100svh-96px-260px)] min-h-[360px]';
const DESKTOP_CHAT_HEIGHT = 'md:h-[calc(100svh-171px-166px)] md:min-h-[400px]';

const HomeHero = () => {
  const [isChatting, setIsChatting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 대화가 시작되면 제목~대화창이 한 화면에 들어오도록 섹션을 네비바 바로 아래로 올린다
  useEffect(() => {
    if (!isChatting) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isChatting]);

  return (
    // scroll-mt: 고정 네비바 높이(84px / 155px) + 여백
    <section
      ref={sectionRef}
      className="flex w-full max-w-[1120px] scroll-mt-[96px] flex-col items-center px-5 pb-6 md:scroll-mt-[171px] md:pb-14 xl:px-0"
    >
      {!isChatting && (
        <span className="text-xsmall16 text-primary md:text-small20 mb-2 font-semibold md:mb-3">
          취업 준비의 모든 순간, 렛츠커리어
        </span>
      )}
      <h1 className="text-medium24 text-neutral-0 md:text-xxlarge36 break-keep text-center font-bold">
        막막한 취업 준비,
        <br className="md:hidden" />{' '}
        <span className="text-primary">렛츠커리어</span>와 함께 해결해요.
      </h1>

      <AiChat
        onChattingChange={setIsChatting}
        mobileHeightClassName={MOBILE_CHAT_HEIGHT}
        desktopHeightClassName={DESKTOP_CHAT_HEIGHT}
      />
    </section>
  );
};

export default HomeHero;
