'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import dynamic from 'next/dynamic';

// 커리어 기록은 클라이언트에서만 fetch 하는 인증 데이터다.
// ssr:false 로 서버 렌더(빌드 타임 prerender)에서 제외해야
// 내부 useSuspenseQuery 가 빌드 중 실행돼 API 를 호출(prerender 에러)하지 않는다.
const CareerRecordContent = dynamic(
  () => import('@/domain/mypage/career/record/CareerRecordContent'),
  { ssr: false },
);

const Career = () => {
  return (
    <AsyncBoundary
      pendingFallback={
        <LoadingContainer text="커리어 기록 조회 중" className="h-[62vh]" />
      }
    >
      <CareerRecordContent />
    </AsyncBoundary>
  );
};

export default Career;
