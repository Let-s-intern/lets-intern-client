import { useEffect, useState } from 'react';

interface DecimalCounterProps {
  isStartCount: boolean;
  maxCount: number;
}

const duration = 10;
const increment = 0.1;

const useDecimalCounter = ({
  isStartCount = true,
  maxCount,
}: DecimalCounterProps) => {
  let timer: NodeJS.Timeout | null = null;

  const [count, setCount] = useState(0);

  const setTimer = () => {
    timer = setInterval(() => {
      setCount((prev) => (prev < maxCount ? prev + increment : maxCount));
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

  return count.toFixed(1);
};

export default useDecimalCounter;
