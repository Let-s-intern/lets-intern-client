'use client';

import { capturePaymentCtaClicked } from '../analytics';
import BarCountdown from './BarCountdown';
import { openPlanSheet } from '../lib/planSheet';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';
import useMembershipSheetStore from '../store/useMembershipSheetStore';
import { APPLY_BAR } from '../data/plans';
import { formatKRW } from '../data/membership';
import {
  ctaLabel,
  IS_CTA_DISABLED,
  IS_RECRUITMENT_CLOSED,
} from '../lib/membershipChallenge';

/**
 * 하단 고정 신청 바 (개편 시안).
 *
 * 어두운 알약 하나가 떠 있고, 왼쪽은 주황 제목과 회색 부제, 오른쪽은 남은 시간과
 * 주황 버튼이다. 버튼 글자에 가격이 들어간다 — 값을 보고 누를지 정하는 자리라
 * "지금 바로 신청" 보다 금액이 먼저다.
 *
 * 가격은 어드민 값(`salePrice`)을 쓴다. 가격 섹션·최종 CTA 와 어긋나면 안 된다.
 */
export default function ApplyBar() {
  const isSheetOpen = useMembershipSheetStore((s) => s.isSheetOpen);
  const { deadline, salePrice } = useMembershipChallengeData();

  // 결제 시트가 열려 있으면 시트와 겹치므로 하단 바를 숨긴다.
  if (isSheetOpen) return null;

  return (
    <div className="apply-bar">
      <div className="apply-bar-info">
        <span className="apply-bar-title">
          {IS_RECRUITMENT_CLOSED
            ? '이번 기수 모집은 마감되었어요'
            : APPLY_BAR.title}
        </span>
        <span className="apply-bar-sub">{APPLY_BAR.sub}</span>
      </div>

      <div className="apply-bar-right">
        {/* 모집이 끝나면 남은 시간을 셀 이유가 없다 — 카운트다운을 렌더하지 않는다. */}
        {!IS_RECRUITMENT_CLOSED && <BarCountdown deadline={deadline} />}
        <button
          className="apply-bar-btn"
          onClick={() => {
            capturePaymentCtaClicked({ location: 'apply_bar' });
            openPlanSheet();
          }}
          disabled={IS_CTA_DISABLED}
        >
          {ctaLabel(`${formatKRW(salePrice)}${APPLY_BAR.ctaSuffix}`)}
        </button>
      </div>
    </div>
  );
}
