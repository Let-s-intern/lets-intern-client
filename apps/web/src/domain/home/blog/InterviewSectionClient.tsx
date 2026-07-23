'use client';

import dynamic from 'next/dynamic';

// 홈 인터뷰 섹션은 클라이언트에서만 fetch 한다.
// ssr:false 로 서버 렌더(빌드 타임 prerender)에서 제외해야
// 내부 useSuspenseQuery 가 빌드 중 실행돼 API 를 호출(prerender 에러)하지 않는다.
export default dynamic(() => import('./InterviewSection'), { ssr: false });
