import { MonitorPlay } from 'lucide-react';
import { formatKRW } from '../data/membership';
import { openPlanSheet } from '../lib/planSheet';

// 취준위키 VOD 모음집 단독 구매 카드. 단일 올패스 카드 하단에 배치.
// 결제는 별도 로직 없이 기존 결제 시트(openPlanSheet)에 위임한다.
// VOD 는 어드민의 +VOD 가격플랜 옵션으로 시트 안에서 선택·결제된다.
const VOD_ORIGINAL_PRICE = 300000;
const VOD_SALE_PRICE = 29900;

export default function VodOptionCard() {
  return (
    <div className="vod-option rv">
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
          <span className="vod-was num">{formatKRW(VOD_ORIGINAL_PRICE)}원</span>
          <span className="vod-now num">
            {formatKRW(VOD_SALE_PRICE)}
            <span className="vod-unit">원</span>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-ghost vod-cta"
          onClick={() => openPlanSheet()}
        >
          VOD 옵션 추가
        </button>
      </div>
    </div>
  );
}
