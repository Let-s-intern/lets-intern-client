'use client';

import { MonitorPlay } from 'lucide-react';
import { formatKRW } from '../data/membership';
import { getDiscountRate } from '../data/plans';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

// 취준위키 VOD 모음집 단독 구매 카드. 단일 올패스 카드 하단에 배치.
// 구매는 하단 고정 ApplyBar 의 결제 시트에서 +VOD 옵션으로 선택·결제된다.
// 가격은 연동 챌린지의 VOD 옵션에서 온다(못 찾으면 data/plans.ts 폴백).
export default function VodOptionCard() {
  const { vodRegularPrice, vodSalePrice } = useMembershipChallengeData();
  const discountRate = getDiscountRate(vodRegularPrice, vodSalePrice);

  return (
    <div className="vod-option rv">
      {/* 시안 3.png 좌측 체크박스 — 실제 선택은 결제 시트에서 하므로 표시 전용 */}
      <span className="vod-check" aria-hidden />

      <span className="vod-ic" aria-hidden>
        <MonitorPlay size={28} strokeWidth={2} />
      </span>

      <div className="vod-body">
        <span className="vod-badge">렛츠커리어 하반기 멤버십 구매자 전용</span>
        <p className="vod-title">취준위키 VOD 모음집 단독 구매</p>
        <p className="vod-sub">
          정가 30만원 상당의 현직자 세미나 VOD 30종을 한 번에
        </p>
      </div>

      <div className="vod-aside">
        <div className="vod-price">
          <span className="vod-was">
            <span className="vod-was-label">정가</span>
            <span className="vod-was-num num">
              {formatKRW(vodRegularPrice)}원
            </span>
          </span>
          <span className="vod-now num">
            {formatKRW(vodSalePrice)}
            <span className="vod-unit">원</span>
          </span>
          {/* 할인율은 정가·판매가에서 계산한다. 성립하지 않으면 배지를 렌더하지 않는다. */}
          {discountRate > 0 && (
            <span className="vod-rate num">{discountRate}% 할인</span>
          )}
        </div>
      </div>
    </div>
  );
}
