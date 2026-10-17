import { twMerge } from '@/lib/twMerge';
import { useVodPassHolding } from '@/domain/vod-pass/useVodPassHolding';
import {
  formatVodPassPeriod,
  formatVodPassRemaining,
} from '@/domain/vod-pass/vodPassHolding';
import { VOD_SITE_LIST_URL } from '@/domain/vod-pass/vodSiteUrl';

/**
 * VOD 이용권을 가지고 있으면 보유 중이라는 표시, 남은 기간, VOD 사이트로 가는 버튼을 보여준다 (LC-3438).
 * 이용 중인 이용권이 없거나 조회에 실패하면 아무것도 그리지 않는다.
 */
const VodPassHoldingBanner = ({ className }: { className?: string }) => {
  const holding = useVodPassHolding();

  if (!holding) {
    return null;
  }

  const { current, endsAt, hasScheduled } = holding;

  return (
    <div
      className={twMerge(
        'border-primary-20 bg-primary-5 rounded-xs flex flex-col gap-3 border px-4 py-3 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-primary text-xxsmall12 text-static-100 rounded-full px-2 py-0.5 font-medium">
            VOD 이용권 보유 중
          </span>
          <span className="text-xsmall14 text-neutral-0 font-bold">
            {formatVodPassRemaining(endsAt)}
          </span>
        </div>
        <span className="text-xxsmall12 text-neutral-30">
          {formatVodPassPeriod(current.startsAt ?? endsAt, endsAt)} 이용 가능
          {hasScheduled && ' (예약된 이용권 포함)'}
        </span>
      </div>
      <a
        href={VOD_SITE_LIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary text-xsmall14 text-static-100 rounded-xs shrink-0 px-4 py-2 text-center font-medium"
      >
        내 VOD 사이트로 이동
      </a>
    </div>
  );
};

export default VodPassHoldingBanner;
