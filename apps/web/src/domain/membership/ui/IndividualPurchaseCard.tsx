import { Check } from 'lucide-react';
import { COMPARE_COPY } from '../data/compare';
import { formatKRW } from '../data/membership';
import type { ComparePriceItem } from '../lib/useComparePrices';

interface Props {
  items: ComparePriceItem[];
  total: number;
  isLoading: boolean;
}

/**
 * 좌측 "개별 구매" 카드 (시안 4.png 왼쪽).
 *
 * 금액은 전부 어드민 가격에서 온다. 로딩 중에는 폴백 숫자를 그리지 않고 회색 바를 둔다 —
 * 틀린 값이 잠깐 보이는 편이 빈 자리보다 나쁘기 때문이다(결정 8).
 */
export default function IndividualPurchaseCard({
  items,
  total,
  isLoading,
}: Props) {
  // 합계 문구의 "n개" 는 실제로 값을 가져온 항목 수다. 모집 중인 기수가 없어 빠진
  // 항목까지 세면 합계와 개수가 어긋난다.
  const countedItems = items.filter((item) => item.price !== null).length;

  return (
    <article className="cmp-card cmp-card-individual">
      <ul className="cmp-list">
        {items.map((item) => (
          <li className="cmp-row" key={item.challengeType}>
            <span className="cmp-row-ic" aria-hidden>
              <Check size={13} strokeWidth={3.4} />
            </span>
            <p className="cmp-row-name">{item.name}</p>
            {isLoading ? (
              <span className="cmp-skeleton" aria-label="가격 불러오는 중" />
            ) : item.price === null ? (
              <span className="cmp-row-empty">
                {COMPARE_COPY.priceUnavailable}
              </span>
            ) : (
              <span className="cmp-row-price">
                {COMPARE_COPY.priceCaption}{' '}
                <strong className="num">{formatKRW(item.price)}</strong>
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="cmp-total">
        <span className="cmp-total-cap">
          {COMPARE_COPY.totalCaption.replace('{n}', String(countedItems))}
        </span>
        {isLoading ? (
          <span
            className="cmp-skeleton cmp-skeleton-lg"
            aria-label="합계 불러오는 중"
          />
        ) : (
          <strong className="cmp-total-price num">{formatKRW(total)}원</strong>
        )}
      </div>
    </article>
  );
}
