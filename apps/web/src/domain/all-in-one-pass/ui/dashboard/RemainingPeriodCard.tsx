import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import { getExtensionStatus } from './extension/extensionStatus';

interface Props {
  startDate: string;
  endDate: string;
  onExtend?: () => void;
}

/** U-1 대시보드 "남은 기간" 카드 — D-day + 진행 바 + 이용 기간 */
export default function RemainingPeriodCard({
  startDate,
  endDate,
  onExtend,
}: Props) {
  const now = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const totalDays = end.startOf('day').diff(start.startOf('day'), 'day');
  const elapsedDays = now.startOf('day').diff(start.startOf('day'), 'day');
  // 진행 바: 이용 기간 중 경과 비율
  const progress =
    totalDays > 0 ? Math.min(Math.max(elapsedDays / totalDays, 0), 1) : 0;

  const status = getExtensionStatus(endDate);
  const label = status.isEnded ? '패스 이용 상태' : '남은 기간';
  const dDayText = status.isEnded ? '이용 종료' : `D-${status.daysLeft}`;

  return (
    <div className="border-neutral-80 rounded-xs flex w-[120px] flex-col justify-between gap-4 border p-3 md:w-[300px] md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 md:text-xsmall16 text-neutral-10">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-medium22 md:text-medium24 text-neutral-0 font-bold">
            {dDayText}
          </span>
          {status.badge && (
            <span className="rounded-xxs text-xxsmall10 md:text-xxsmall12 bg-[#FFF6F0] px-2 py-1 text-[#FF6F0F]">
              {status.badge}
            </span>
          )}
        </div>
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
        {onExtend &&
          status.canExtend &&
          (status.isEnded ? (
            <SolidButton size="sm" className="w-full" onClick={onExtend}>
              기간 연장하기
            </SolidButton>
          ) : (
            <OutlinedButton size="sm" className="w-full" onClick={onExtend}>
              기간 연장하기
            </OutlinedButton>
          ))}
      </div>
    </div>
  );
}
