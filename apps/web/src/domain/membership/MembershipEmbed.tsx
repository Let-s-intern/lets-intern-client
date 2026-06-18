'use client';

import NavBar from '@/common/layout/header/NavBar';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// 하반기 멤버십(이벤트) 랜딩은 별도 레포로 분리 배포되며 화면 전체 iframe(내부 스크롤)으로
// 임베드한다. 헤더는 본 사이트의 실제 NavBar 를 그대로 쓰되, iframe 이 스크롤 방향·모달
// 상태를 알려주면(아래로 스크롤/모달 열림 → 숨김, 위로 스크롤 → 표시) 헤더를 내렸다 올린다.
// URL 은 환경변수로 바꾸면 되고, 추후 어드민/BE 로 URL 을 내려주면 이 상수만 교체하면 된다.
// 빈 문자열도 기본값으로 폴백되도록 ?? 대신 || 를 쓴다(?? 는 '' 를 안 잡음).
const LANDING_URL =
  process.env.NEXT_PUBLIC_MEMBERSHIP_LANDING_URL ||
  'https://letscareer-membership-landing.vercel.app';

const LANDING_ORIGIN = (() => {
  try {
    return new URL(LANDING_URL).origin;
  } catch {
    return '';
  }
})();

// 랜딩이 정상 마운트되면 'membership:ready' 를 보낸다. 이 시간 안에 신호가 없으면
// (네트워크 오류·차단·잘못된 URL·404 페이지 등) 오류로 간주한다.
const READY_TIMEOUT_MS = 10000;

type Status = 'loading' | 'loaded' | 'error';

function EmbedError({ navHeight }: { navHeight: number }) {
  // 본 사이트 404 페이지(app/not-found.tsx)의 타이포·버튼 스타일을 따른다.
  return (
    <div
      className="fixed inset-x-0 bottom-0 overflow-y-auto bg-white"
      style={{ top: navHeight }}
    >
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-screen-sm text-center">
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            페이지를 불러오지 못했어요.
          </p>
          <p className="mb-6 text-lg font-light text-gray-500">
            일시적인 오류이거나 페이지가 준비 중일 수 있어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
          <Link
            href="/"
            className="bg-primary hover:bg-primary-light focus:ring-primary-light inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            홈페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MembershipEmbed() {
  const navRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [navHeight, setNavHeight] = useState(115);
  // URL 이 비어 있으면 처음부터 오류 상태
  const [status, setStatus] = useState<Status>(
    LANDING_URL ? 'loading' : 'error',
  );

  useEffect(() => {
    const measure = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    measure();

    const handleMessage = (event: MessageEvent) => {
      if (LANDING_ORIGIN && event.origin !== LANDING_ORIGIN) return;
      const data = event.data;
      // 랜딩에서 어떤 메시지든 오면(ready/header) 정상 로드된 것으로 본다.
      if (
        data?.type === 'membership:ready' ||
        data?.type === 'membership:header'
      ) {
        setStatus((cur) => (cur === 'loading' ? 'loaded' : cur));
      }
      if (data?.type === 'membership:header') {
        setHeaderVisible(!!data.visible);
      }
    };

    window.addEventListener('resize', measure);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 일정 시간 안에 ready 신호가 없으면 오류로 전환
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = setTimeout(() => {
      setStatus((cur) => (cur === 'loading' ? 'error' : cur));
    }, READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status]);

  // 오류일 때는 헤더가 항상 보이게 한다(홈으로 이동 등 탐색 가능하도록).
  const navVisible = status === 'error' ? true : headerVisible;

  return (
    <>
      <div
        ref={navRef}
        className="fixed inset-x-0 top-0 z-40 transition-transform duration-300"
        style={{
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <NavBar disableFixed />
      </div>

      {status === 'error' ? (
        <EmbedError navHeight={navHeight} />
      ) : (
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
      )}
    </>
  );
}
