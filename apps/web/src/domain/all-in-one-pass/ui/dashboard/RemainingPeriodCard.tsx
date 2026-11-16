import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import { useGetMyMembershipApplication } from '../../api/dashboard';
import { getExtensionStatus } from './extension/extensionStatus';

interface Props {
  applicationId: number;
  onExtend?: () => void;
}

export default function RemainingPeriodCard({
  applicationId,
  onExtend,
}: Props) {
  const { data } = useGetMyMembershipApplication(applicationId);
  if (!data?.startDate || !data?.endDate) return null;

  const start = dayjs(data.startDate);
  const end = dayjs(data.endDate);
  const totalMs = end.diff(start);
  const progress =
    totalMs > 0 ? Math.min(Math.max(dayjs().diff(start) / totalMs, 0), 1) : 1;

  const status = getExtensionStatus(data.endDate, data.deadline);
  const label = status.isEnded ? '패스 이용 상태' : '남은 기간';
  const dDayText = status.isEnded ? '이용 종료' : `D-${status.daysLeft}`;

  return (
    <div className="flex w-[120px] flex-col justify-between gap-4 rounded-xs border border-neutral-80 p-3 md:w-[300px] md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 text-neutral-10 md:text-xsmall16">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-medium22 font-bold text-neutral-0 md:text-medium24">
            {dDayText}
          </span>
          {status.badge && (
            <span className="rounded-xxs bg-[#FFF6F0] px-2 py-1 text-xxsmall10 text-[#FF6F0F] md:text-xxsmall12">
              {status.badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-90">
          <div
            className="h-full rounded-full bg-primary-light"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xxsmall10 text-neutral-50 md:text-xxsmall12">
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
