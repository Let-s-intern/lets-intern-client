import { CalendarDays, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

import { twMerge } from '@/lib/twMerge';

import { AI_CHAT_KIND_LABEL } from '../constants/aiChat';
import { AiChatItem } from '../types/aiChat';
import { formatPeriod, formatWon } from '../utils/format';

/** 가장 싼 항목에 표시를 달기 위한 최저 판매가 */
function getLowestPrice(items: AiChatItem[]) {
  const prices = items
    .map((item) => item.price?.selling)
    .filter((p): p is number => p != null);
  return prices.length >= 2 ? Math.min(...prices) : null;
}

function getDiscountRate(price: AiChatItem['price']) {
  if (!price?.original) return null;
  return Math.round((1 - price.selling / price.original) * 100);
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="text-xxsmall12 flex items-start gap-1.5">
    <span className="text-neutral-45 mt-px shrink-0">{icon}</span>
    <span className="text-neutral-45 w-7 shrink-0">{label}</span>
    <span className="text-neutral-20 font-medium">{value}</span>
  </div>
);

const CompareCard = ({
  item,
  isLowest,
}: {
  item: AiChatItem;
  isLowest: boolean;
}) => {
  const discountRate = getDiscountRate(item.price);

  return (
    <li
      className={twMerge(
        'border-neutral-85 flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-md border bg-white md:w-auto md:min-w-0',
        isLowest && 'border-primary-40',
      )}
    >
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xxsmall12 text-primary font-semibold">
            {AI_CHAT_KIND_LABEL[item.kind] ?? item.kind}
          </span>
          {isLowest && (
            <span className="bg-primary-10 text-primary text-xxsmall10 rounded-full px-1.5 py-0.5 font-semibold">
              최저가
            </span>
          )}
        </div>
        <h4 className="text-xsmall14 text-neutral-0 mt-1 line-clamp-2 min-h-10 font-semibold">
          {item.title}
        </h4>

        <div className="mt-3">
          {item.price ? (
            <>
              {item.price.original && (
                <span className="text-xxsmall12 text-neutral-50 line-through">
                  {formatWon(item.price.original)}
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                {discountRate != null && discountRate > 0 && (
                  <span className="text-small18 text-system-error font-bold">
                    {discountRate}%
                  </span>
                )}
                <span className="text-small18 text-neutral-0 font-bold">
                  {formatWon(item.price.selling)}
                </span>
              </div>
              {item.price.note && (
                <p className="text-xxsmall12 text-neutral-45 mt-0.5">
                  {item.price.note}
                </p>
              )}
            </>
          ) : (
            <span className="text-xsmall14 text-neutral-45">
              가격은 상세에서 확인해 주세요
            </span>
          )}
        </div>

        <div className="border-neutral-85 mt-3 flex flex-col gap-1.5 border-t pt-3">
          <InfoRow
            icon={<CalendarDays size={13} />}
            label="모집"
            value={formatPeriod(item.recruit) ?? '상시'}
          />
          <InfoRow
            icon={<Clock size={13} />}
            label="진행"
            value={
              formatPeriod(item.schedule) ??
              (item.kind === 'LIVE_MENTORING'
                ? '멘토와 일정 선택'
                : '구매 후 바로')
            }
          />
        </div>

        {item.description && (
          <p className="text-xxsmall12 text-neutral-35 mt-3 line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            href={item.href}
            className="ai_chat_compare_cta bg-primary text-xsmall14 hover:bg-primary-hover flex items-center justify-center gap-0.5 rounded-sm px-3 py-2.5 font-semibold text-white"
            data-url={item.href}
            data-text={item.title}
          >
            바로가기
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </li>
  );
};

const ComparePanel = ({ items }: { items: AiChatItem[] }) => {
  const lowest = getLowestPrice(items);

  return (
    <div className="flex min-h-0 flex-col md:h-full">
      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 font-bold">
        한눈에 비교하기
      </h3>
      {/* 모바일은 가로 스와이프, 데스크톱은 2열 그리드(3개 이상이면 세로 스크롤) */}
      <ul className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:min-h-0 md:flex-1 md:grid-cols-2 md:overflow-y-auto md:overflow-x-visible md:px-0">
        {items.map((item) => (
          <CompareCard
            key={item.key}
            item={item}
            isLowest={lowest != null && item.price?.selling === lowest}
          />
        ))}
      </ul>
    </div>
  );
};

export default ComparePanel;
