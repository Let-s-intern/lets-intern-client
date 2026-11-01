// 나의 패스 이용 > VOD 탭 상단. VOD 이용권 기간은 패스 기간과 달라 따로 보여준다.
import dayjs from '@/lib/dayjs';
import {
  getVodPassDDayLabel,
  type VodPassPeriod,
} from '../../utils/vodPassPeriod';

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

const VodPassPeriodCard = ({ period }: { period: VodPassPeriod }) => (
  <div className="border-neutral-80 rounded-xs flex items-center justify-between gap-3 border p-3 md:p-4">
    <div className="flex flex-col gap-1">
      <span className="text-xxsmall12 md:text-xsmall14 text-neutral-40">
        VOD 이용 기간
      </span>
      <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-semibold">
        {formatDate(period.startsAt)} ~ {formatDate(period.endsAt)}
      </span>
    </div>
    <span className="text-medium22 md:text-medium24 text-neutral-0 shrink-0 font-bold">
      {getVodPassDDayLabel(period.endsAt)}
    </span>
  </div>
);

export default VodPassPeriodCard;
