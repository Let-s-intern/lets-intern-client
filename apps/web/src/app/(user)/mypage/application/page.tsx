'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import dynamic from 'next/dynamic';

// 신청 현황은 클라이언트에서만 fetch 하는 인증 데이터다.
// ssr:false 로 서버 렌더(빌드 타임 prerender)에서 제외해야
// 내부 useSuspenseQuery 가 빌드 중 실행돼 API 를 호출(prerender 에러)하지 않는다.
const ApplicationContent = dynamic(
  () => import('@/domain/mypage/application/ApplicationContent'),
  { ssr: false },
);

const Application = () => {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <ApplicationContent />
    </AsyncBoundary>
  );
};

export default Application;
