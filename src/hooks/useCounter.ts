import { useEffect, useState } from 'react';

interface CounterProps {
  isStartCount: boolean;
  maxCount: number;
  increment?: number;
}

const duration = 10;

const useCounter = ({
  isStartCount = true,
  maxCount,
  increment,
}: CounterProps) => {
  let timer: NodeJS.Timeout | null = null;

  const [count, setCount] = useState(0);

  const setTimer = () => {
    timer = setInterval(() => {
      setCount((prev) =>
        prev < maxCount ? prev + (increment || 1) : maxCount,
      );
    }, duration);
  };

  // 타이머 시작
  useEffect(() => {
    if (isStartCount) setTimer();
  }, [isStartCount]);
  // 타이머 종료
  useEffect(() => {
    if (timer && count === maxCount) {
      clearInterval(timer);
      timer = null;
    }
  }, [count]);

  return count;
};

export default useCounter;
