import { AiChatItem } from '../types/aiChat';
import { formatPeriod, formatWon } from '../utils/format';

/** 카드·비교표에서 공통으로 쓰는 가격 표기 */
export const PriceText = ({ price }: { price: AiChatItem['price'] }) => {
  if (!price) return <span className="text-neutral-45">가격 정보 없음</span>;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      <span className="text-neutral-0 font-bold">
        {formatWon(price.selling)}
      </span>
      {price.original && (
        <span className="text-neutral-50 line-through">
          {formatWon(price.original)}
        </span>
      )}
    </span>
  );
};

/** 카드용 한 줄 요약: 가격 · 모집 마감 · 진행 기간 */
const ProgramMeta = ({ item }: { item: AiChatItem }) => {
  if (item.kind === 'BLOG') return null;
  const schedule = formatPeriod(item.schedule);
  const deadline = item.recruit?.end
    ? formatPeriod({ start: null, end: item.recruit.end })
    : null;

  return (
    <div className="text-xxsmall12 flex flex-col gap-0.5">
      <PriceText price={item.price} />
      {(deadline || schedule) && (
        <span className="text-neutral-40">
          {[deadline && `모집 ${deadline}`, schedule && `진행 ${schedule}`]
            .filter(Boolean)
            .join(' · ')}
        </span>
      )}
    </div>
  );
};

export default ProgramMeta;
