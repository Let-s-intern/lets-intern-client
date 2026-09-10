import { useEffect, useState } from 'react';

// 하단 신청 바 전용 컴팩트 카운트다운 ("8일 17시간 0분 31초" 형태)
function calc(deadline: Date) {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const ZERO: ReturnType<typeof calc> = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function BarCountdown({ deadline }: { deadline: Date }) {
  // SSR/CSR 일치를 위해 마운트 전에는 0으로 고정 렌더(Date.now()는 클라이언트에서만 호출).
  const [t, setT] = useState<ReturnType<typeof calc>>(ZERO);

  useEffect(() => {
    setT(calc(deadline));
    const timer = setInterval(() => setT(calc(deadline)), 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span className="apply-bar-count">
      {t.days}
      <span className="unit">일</span> {t.hours}
      <span className="unit">시간</span> {t.minutes}
      <span className="unit">분</span> {t.seconds}
      <span className="unit">초</span>
      <span className="left">남음</span>
    </span>
  );
}
