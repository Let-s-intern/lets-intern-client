'use client';

import dynamic from 'next/dynamic';

// 결제내역은 클라이언트에서만 fetch 하는 인증 데이터다.
// ssr:false 로 서버 렌더(빌드 타임 prerender)에서 제외해야
// 내부 useSuspenseQuery 가 빌드 중 실행돼 API 를 호출(prerender 에러)하지 않는다.
const CreditList = dynamic(
  () => import('@/domain/mypage/credit/ui/CreditList'),
  { ssr: false },
);

const Credit = () => {
  return (
    <main className="flex w-full flex-col gap-16">
      <CreditList />
    </main>
  );
};

export default Credit;
