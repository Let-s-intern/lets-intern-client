import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import duration, { Duration as DayjsDuration } from 'dayjs/plugin/duration';
import { ReactNode, useEffect, useState } from 'react';

dayjs.extend(duration);

export function Duration({
  deadline,
  disabled = false,
  numberBoxClassName,
}: {
  deadline: Dayjs;
  disabled?: boolean;
  numberBoxClassName?: string;
}) {
  const [duration, setDuration] = useState<DayjsDuration>();

  useEffect(() => {
    setDuration(dayjs.duration(deadline.diff(dayjs())));
  }, [deadline]);

  /* 마감 일자 타이머 설정 */
  useEffect(() => {
    if (disabled) return;

    const timer = setInterval(() => {
      setDuration((prev) => prev?.subtract(1, 'second') ?? prev);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, disabled]);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <DurationBox className={numberBoxClassName}>
        {duration?.days() ?? '-'}일
      </DurationBox>
      <DurationBox className={numberBoxClassName}>
        {duration?.hours() ?? '-'}시간
      </DurationBox>
      <DurationBox className={numberBoxClassName}>
        {duration?.minutes() ?? '-'}분
      </DurationBox>
      <DurationBox className={numberBoxClassName}>
        {duration?.seconds() ?? '-'}초
      </DurationBox>
    </div>
  );
}

function DurationBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'rounded-xxs bg-primary-10 p-1 text-xxsmall12 font-bold text-primary',
        className,
      )}
    >
      {children}
    </div>
  );
}
