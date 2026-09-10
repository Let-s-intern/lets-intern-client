import { Check, Plus } from 'lucide-react';
import { ALL_IN_ONE_ITEMS, COMPARE_COPY } from '../data/compare';
import { formatKRW } from '../data/membership';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

/**
 * 우측 "올인원 패스로 구매" 카드 (시안 4.png 오른쪽).
 * 가격은 연동 챌린지의 오픈 특가(salePrice)이며 항목 문구는 하드코딩이다.
 */
export default function AllInOneCard() {
  const { salePrice } = useMembershipChallengeData();

  return (
    <article className="cmp-card cmp-card-allinone">
      <ul className="cmp-list">
        {ALL_IN_ONE_ITEMS.map((item) => (
          <li
            className="cmp-row"
            key={item.text}
            data-emphasized={item.emphasized}
          >
            <span className="cmp-row-ic" aria-hidden>
              {item.emphasized ? (
                <Check size={13} strokeWidth={3.4} />
              ) : (
                <Plus size={13} strokeWidth={3.4} />
              )}
            </span>
            <p className="cmp-row-name">{item.text}</p>
          </li>
        ))}
      </ul>

      <div className="cmp-total">
        <span className="cmp-total-cap">
          {COMPARE_COPY.allInOneTotalCaption}
        </span>
        <strong className="cmp-total-price num">
          {formatKRW(salePrice)}원
        </strong>
      </div>
    </article>
  );
}
