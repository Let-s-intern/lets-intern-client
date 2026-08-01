import { redirect } from 'next/navigation';

/**
 * 멘토링 목록은 프로그램 페이지의 카탈로그 탭(`/program?catalog=mentoring`)으로 일원화됐다.
 * 기존 링크·북마크가 깨지지 않도록 여기로 들어오면 탭으로 넘긴다.
 * (상품 상세 `/live-mentoring/[liveMentoringId]` 는 그대로 유지된다.)
 */
const Page = () => {
  redirect('/program?catalog=mentoring');
};

export default Page;
