import dayjs from '@/lib/dayjs';

interface Props {
  startDate: string;
  endDate: string;
}

/** U-1 대시보드 "남은 기간" 카드 — D-day + 진행 바 + 이용 기간 */
export default function RemainingPeriodCard({ startDate, endDate }: Props) {
  const now = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const totalDays = end.startOf('day').diff(start.startOf('day'), 'day');
  const elapsedDays = now.startOf('day').diff(start.startOf('day'), 'day');
  const dDay = Math.max(0, end.startOf('day').diff(now.startOf('day'), 'day'));
  // 진행 바: 이용 기간 중 경과 비율
  const progress =
    totalDays > 0 ? Math.min(Math.max(elapsedDays / totalDays, 0), 1) : 0;

  return (
    <div className="border-neutral-80 rounded-xs flex w-[120px] flex-col justify-between gap-4 border p-3 md:w-[300px] md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 md:text-xsmall16 text-neutral-10">
          남은 기간
        </span>
        <span className="text-medium22 md:text-medium24 text-neutral-0 font-bold">
          D-{dDay}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-neutral-90 h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary-light h-full rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xxsmall10 md:text-xxsmall12 text-neutral-50">
          {/* 모바일: 종료일만 "까지" / 데스크탑: 시작 ~ 종료 이용 */}
          <span className="md:hidden">{end.format('YYYY.MM.DD')}까지</span>
          <span className="hidden md:inline">
            {start.format('YYYY.MM.DD')} ~ {end.format('YYYY.MM.DD')} 이용
          </span>
        </span>
      </div>
    </div>
  );
}
