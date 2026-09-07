import type { Metadata } from 'next';

import LiveMentoringDetailPreview from '@/domain/live-mentoring/detail/LiveMentoringDetailPreview';

/**
 * 검색에 잡히면 안 된다. 공개 상세와 내용이 같은 주소가 하나 더 생기는 셈이라,
 * 색인되면 원본과 중복 콘텐츠로 서로 순위를 갉아먹는다.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * 멘토 설정 화면이 iframe 으로 띄우는 상세 미리보기(LC-3268).
 *
 * 사람이 직접 여는 주소가 아니다. 공개 상세는 `/live-mentoring/[mentorId]` 다.
 *
 * `(user)` 라우트 그룹 **밖**에 둔다. 그 그룹의 레이아웃이 공통 네비·푸터를 붙이는데,
 * 휴대폰 프레임 안에서는 상세 본문만 보여야 한다 — 네비가 프레임 높이의 상당 부분을
 * 먹고, 거기 있는 링크로 다른 페이지까지 갈 수 있다. 이 경로의 레이아웃
 * (`live-mentoring/layout.tsx`)은 공통 Provider 만 붙인다.
 */
const Page = async ({ params }: { params: Promise<{ mentorId: string }> }) => {
  const { mentorId } = await params;
  return <LiveMentoringDetailPreview mentorId={mentorId} />;
};

export default Page;
