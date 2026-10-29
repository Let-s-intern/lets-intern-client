'use client';

import NavBar from '@/common/layout/header/NavBar';
import useAuthStore from '@/store/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  MENTOR_APPLY_PATH,
  MENTOR_APPLY_STATUS_PATH,
  MENTOR_JOIN_PATH,
} from '../data/links';

/** 멘토 모집 랜딩·신청서·현황 조회를 감싸는 경로인지 */
export const isMentorJoinPath = (pathname: string) =>
  pathname === MENTOR_JOIN_PATH || pathname.startsWith(MENTOR_APPLY_PATH);

/**
 * 멘토 모집 화면의 겉틀. 시안(lets-mentor)의 헤더·푸터를 그대로 쓴다.
 * 렛츠커리어에 로그인한 사람에게는 시안 헤더 대신 렛츠커리어 헤더를 보인다.
 * 로그인 상태를 복원하기 전에는 어느 헤더도 그리지 않아, 회원에게 시안 헤더가 잠깐 비치지 않게 한다
 */
export default function MentorJoinLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <div className="flex min-h-screen flex-col break-keep bg-white text-zinc-900">
      {!isInitialized ? null : isLoggedIn ? <NavBar /> : <MentorJoinHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
        문의:{' '}
        <a
          href="mailto:official@letscareer.co.kr"
          className="hover:text-zinc-600 hover:underline"
        >
          official@letscareer.co.kr
        </a>
      </footer>
    </div>
  );
}

function MentorJoinHeader() {
  // 신청서 작성 중에는 다른 페이지로 빠져나가지 않도록 버튼을 숨긴다
  const isApplyPage = usePathname() === MENTOR_APPLY_PATH;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={MENTOR_JOIN_PATH} className="flex min-w-0 items-center">
          {/* 좁은 화면에서는 우측 버튼 자리를 남기고 비율대로 줄어든다 (최대 높이 24px) */}
          <Image
            src="/mentor-join/logo.svg"
            alt="렛츠커리어"
            width={234}
            height={26}
            priority
            unoptimized
            className="h-auto w-full max-w-[216px]"
          />
        </Link>
        {isApplyPage ? null : (
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm">
            <Link
              href={MENTOR_APPLY_STATUS_PATH}
              className="rounded-[6px] px-2.5 py-2 text-zinc-600 hover:bg-zinc-100 sm:px-3"
            >
              신청 현황 조회
            </Link>
            <Link
              href={MENTOR_APPLY_PATH}
              className="rounded-[6px] bg-[#4d55f5] px-2.5 py-2 font-semibold text-white hover:bg-[#3a41d6] sm:px-3"
            >
              신청하기
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
