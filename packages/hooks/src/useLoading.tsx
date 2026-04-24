import { useEffect, useState } from 'react';

/* 일부러 로딩하여 컴포넌트를 표시할 때 사용 */
export default function useLoading(delay: number) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);

    return () => clearTimeout(timer);
  }, []);

  return isLoading;
}
