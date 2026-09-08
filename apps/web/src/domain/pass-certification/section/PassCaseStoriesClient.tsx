'use client';

import dynamic from 'next/dynamic';

// career_stories 블로그는 클라이언트에서만 fetch 한다.
// ssr:false 로 빌드 타임 prerender 에서 제외해야 내부 useSuspenseQuery 가
// 빌드 중 API 를 호출(prerender 에러)하지 않는다. (홈 InterviewSection 과 동일 패턴)
export default dynamic(() => import('./PassCaseStories'), { ssr: false });
