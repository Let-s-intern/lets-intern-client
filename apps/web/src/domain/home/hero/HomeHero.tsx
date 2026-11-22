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
  // isChatting 도 의존해서, 제목·히어로 이미지가 사라지는 렌더가 끝난 뒤의 위치로 스크롤한다
  useEffect(() => {
    if (askCount === 0 || !isChatting) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [askCount, isChatting]);

  return (
    // scroll-mt: 고정 네비바 높이(84px / 155px) + 여백
    <section
      ref={sectionRef}
      className="flex w-full max-w-[1120px] scroll-mt-[96px] flex-col items-center px-5 pb-4 md:scroll-mt-[171px] md:pb-6 xl:px-0"
    >
      {!isChatting && (
        <>
          <span
            className={`mb-2 text-xsmall16 font-semibold text-primary md:mb-3 md:text-small20 ${styles.fadeUp}`}
          >
            취업 준비의 모든 순간, 렛츠커리어
          </span>
          <h1
            className={`break-keep text-center text-medium24 font-bold text-neutral-0 md:text-xxlarge36 ${styles.fadeUp} ${styles.delay1}`}
          >
            취업 준비, 지금 <span className={styles.shimmer}>어디서</span>{' '}
            막혔나요?
          </h1>
          <p
            className={`mt-2 break-keep text-center text-xsmall14 text-neutral-30 md:mt-3 md:text-small18 ${styles.fadeUp} ${styles.delay1}`}
          >
            고민을 바로 물어보거나 아래에서 골라 보세요.
            <br className="md:hidden" /> 딱 맞는 프로그램을 찾아드릴게요.
          </p>
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
