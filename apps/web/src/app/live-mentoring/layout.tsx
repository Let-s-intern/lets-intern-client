import type { Metadata } from 'next';

import Providers from '@/context/Providers';

/**
 * 1대1 세션 입장 라우트 레이아웃.
 *
 * 이 경로는 `(user)` 라우트 그룹 **밖**이라 `(user)/layout.tsx` 의 `Providers` 를
 * 상속받지 못한다. 그런데 입장 화면은 react-query 를 쓰므로, 이 파일이 없으면
 * 페이지가 렌더되는 순간 `No QueryClient set` 으로 500 이 난다.
 *
 * 라이브 피드백이 같은 이유로 `live-feedback/layout.tsx` 를 이미 두고 있다
 * (커밋 `f53cc2bf0`). 같은 형태를 쓴다.
 *
 * 네비·푸터는 두지 않는다. 알림톡 링크로만 진입하는 독립 랜딩이라 공통 Provider 만
 * 있으면 된다.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const LiveMentoringLayout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default LiveMentoringLayout;
