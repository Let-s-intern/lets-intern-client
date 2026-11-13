'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface HomeChattingContextValue {
  isChatting: boolean;
  setIsChatting: (isChatting: boolean) => void;
}

/** 홈 AI 상담이 열려 있는지. 띠배너 아래 히어로 이미지 숨김처럼 홈의 다른 섹션이 반응할 때 쓴다 */
const HomeChattingContext = createContext<HomeChattingContextValue>({
  isChatting: false,
  setIsChatting: () => {},
});

export const HomeChattingProvider = ({ children }: { children: ReactNode }) => {
  const [isChatting, setIsChatting] = useState(false);
  return (
    <HomeChattingContext.Provider value={{ isChatting, setIsChatting }}>
      {children}
    </HomeChattingContext.Provider>
  );
};

export const useHomeChatting = () => useContext(HomeChattingContext);
