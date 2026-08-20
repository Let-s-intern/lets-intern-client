'use client';

import { useEffect } from 'react';

/**
 * Next.js의 redirect() 이후, scroll 최상단으로 리셋되지 않아 마운트 시 강제로 최상단으로 스크롤
 */
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;
