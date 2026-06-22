import { useEffect, useState } from "react";

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

export default function BarCountdown({ deadline }: { deadline: Date }) {
  const [t, setT] = useState(() => calc(deadline));

  useEffect(() => {
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
