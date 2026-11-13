'use client';

import AiChat from '@/domain/ai-chat/AiChat';
import { useEffect, useRef, useState } from 'react';

import { useHomeChatting } from './HomeChattingContext';
import styles from './HomeHero.module.css';

/**
 * 대화 중 한 화면 높이 = 뷰포트 - 고정 네비바·여백(모바일 96px / 데스크톱 171px)
 * - 입력창·간격·아래 여백(모바일 56+16+16px + 하단 탭바 64px = 152px / 데스크톱 60+20+16px = 96px)
 * 대화 중에는 제목을 숨기고 입력창이 네비바 바로 아래에 온다.
 */
const MOBILE_CHAT_HEIGHT = 'h-[calc(100svh-96px-152px)] min-h-[320px]';
const DESKTOP_CHAT_HEIGHT = 'md:h-[calc(100svh-171px-96px)] md:min-h-[360px]';

const HomeHero = () => {
  const { isChatting, setIsChatting } = useHomeChatting();
  const sectionRef = useRef<HTMLElement>(null);

  const [askCount, setAskCount] = useState(0);

  // 질문할 때마다 제목~대화창이 한 화면에 들어오도록 섹션을 네비바 바로 아래로 올린다.
  // isChatting 도 의존해서, 띠배너가 사라지는 렌더가 끝난 뒤의 위치로 스크롤한다
  useEffect(() => {
    if (askCount === 0 || !isChatting) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [askCount, isChatting]);

  return (
    // scroll-mt: 고정 네비바 높이(84px / 155px) + 여백
    <section
      ref={sectionRef}
      className="flex w-full max-w-[1120px] scroll-mt-[96px] flex-col items-center px-5 pb-6 md:scroll-mt-[171px] md:pb-14 xl:px-0"
    >
      {!isChatting && (
        <>
          <span
            className={`text-xsmall16 text-primary md:text-small20 mb-2 font-semibold md:mb-3 ${styles.fadeUp}`}
          >
            취업 준비의 모든 순간, 렛츠커리어
          </span>
          <h1
            className={`text-medium24 text-neutral-0 md:text-xxlarge36 break-keep text-center font-bold ${styles.fadeUp} ${styles.delay1}`}
          >
            막막한 취업 준비,
            <br className="md:hidden" />{' '}
            <span className={styles.shimmer}>렛츠커리어</span>와 함께 해결해요.
          </h1>
        </>
      )}

      <AiChat
        onChattingChange={setIsChatting}
        onAsk={() => setAskCount((n) => n + 1)}
        mobileHeightClassName={MOBILE_CHAT_HEIGHT}
        desktopHeightClassName={DESKTOP_CHAT_HEIGHT}
      />
    </section>
  );
};

export default HomeHero;
