'use client';

import NavBar from '@/common/layout/header/NavBar';
import { useEffect, useRef, useState } from 'react';

// 하반기 멤버십(이벤트) 랜딩은 별도 레포로 분리 배포되며 화면 전체 iframe(내부 스크롤)으로
// 임베드한다. 헤더는 본 사이트의 실제 NavBar 를 그대로 쓰되, iframe 이 스크롤 방향·모달
// 상태를 알려주면(아래로 스크롤/모달 열림 → 숨김, 위로 스크롤 → 표시) 헤더를 내렸다 올린다.
// URL 은 환경변수로 바꾸면 되고, 추후 어드민/BE 로 URL 을 내려주면 이 상수만 교체하면 된다.
const LANDING_URL =
  process.env.NEXT_PUBLIC_MEMBERSHIP_LANDING_URL ??
  'https://letscareer-membership-landing.vercel.app';

const LANDING_ORIGIN = (() => {
  try {
    return new URL(LANDING_URL).origin;
  } catch {
    return '';
  }
})();

export default function MembershipEmbed() {
  const navRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [navHeight, setNavHeight] = useState(115);

  useEffect(() => {
    const measure = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    measure();

    const handleMessage = (event: MessageEvent) => {
      if (LANDING_ORIGIN && event.origin !== LANDING_ORIGIN) return;
      if (event.data?.type === 'membership:header') {
        setHeaderVisible(!!event.data.visible);
      }
    };

    window.addEventListener('resize', measure);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <div
        ref={navRef}
        className="fixed inset-x-0 top-0 z-40 transition-transform duration-300"
        style={{
          transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <NavBar disableFixed />
      </div>
      <iframe
        src={LANDING_URL}
        title="렛츠커리어 하반기 멤버십"
        className="fixed inset-x-0 w-full border-0 transition-all duration-300"
        style={{
          top: headerVisible ? navHeight : 0,
          // iframe 은 replaced element 라 top+bottom 으로는 안 늘어난다(높이 명시 필요).
          height: headerVisible ? `calc(100dvh - ${navHeight}px)` : '100dvh',
        }}
      />
    </>
  );
}
