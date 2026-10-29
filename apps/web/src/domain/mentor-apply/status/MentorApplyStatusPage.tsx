'use client';

import useAuthStore from '@/store/useAuthStore';

import { pageTitleClassName } from '../ui/styles';
import GuestLookupSection from './section/GuestLookupSection';
import MyStatusSection from './section/MyStatusSection';

/** `/mentor-apply/status`. 회원은 본인 신청 목록, 비회원은 성함·연락처 조회 */
export default function MentorApplyStatusPage() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <div className="mx-auto w-full max-w-md break-keep px-4 py-12 text-zinc-900 sm:py-16">
      <h1 className={pageTitleClassName}>신청 현황 조회</h1>
      {/* 로그인 상태를 복원하기 전에는 비회원 폼이 잠깐 보이지 않도록 비워 둔다 */}
      {!isInitialized ? null : isLoggedIn ? (
        <div className="mt-10">
          <MyStatusSection />
        </div>
      ) : (
        <>
          <p className="mt-2 text-zinc-600">
            신청 시 입력한 성함과 연락처를 입력해주세요.
          </p>
          <div className="mt-10">
            <GuestLookupSection />
          </div>
        </>
      )}
    </div>
  );
}
