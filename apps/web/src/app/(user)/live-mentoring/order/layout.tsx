import type { Metadata } from 'next';

// 신청서·결제·결과 화면은 검색에 나올 이유가 없다. 아래 모든 하위 경로에 적용된다
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const LiveMentoringOrderLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => children;

export default LiveMentoringOrderLayout;
