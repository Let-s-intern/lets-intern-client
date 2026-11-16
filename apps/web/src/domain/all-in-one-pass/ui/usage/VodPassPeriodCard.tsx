// 나의 패스 이용 > VOD 탭 상단. VOD 이용권 기간은 패스 기간과 달라 따로 보여준다.
import dayjs from '@/lib/dayjs';
import {
  getVodPassDDayLabel,
  type VodPassPeriod,
} from '../../utils/vodPassPeriod';

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

const VodPassPeriodCard = ({ period }: { period: VodPassPeriod }) => (
  <div className="flex items-center justify-between gap-3 rounded-xs border border-neutral-80 p-3 md:p-4">
    <div className="flex flex-col gap-1">
      <span className="text-xxsmall12 text-neutral-40 md:text-xsmall14">
        VOD 이용 기간
      </span>
      <span className="text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
        {formatDate(period.startsAt)} ~ {formatDate(period.endsAt)}
      </span>
    </div>
    <span className="shrink-0 text-medium22 font-bold text-neutral-0 md:text-medium24">
      {getVodPassDDayLabel(period.endsAt)}
    </span>
  </div>
);

export default VodPassPeriodCard;
