import Providers from '@/context/Providers';
import type { Metadata } from 'next';

/**
 * 라이브 피드백 입장 페이지 레이아웃.
 *
 * 알림톡 링크로 진입하는 독립 랜딩이므로 (user)/mentor 그룹의 네비·푸터 없이
 * QueryClientProvider 등 공통 Provider만 제공한다. (개인 세션이라 noindex)
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const LiveFeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default LiveFeedbackLayout;
