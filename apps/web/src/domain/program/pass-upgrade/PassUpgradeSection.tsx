'use client';

import Link from 'next/link';
import { usePassUpgradeOffer } from './usePassUpgradeOffer';

interface Props {
  challengeId: number;
  /** 지금 결제할 챌린지 금액 */
  paymentAmount: number;
}

/** 결제하기 화면의 올인원 패스 업그레이드 구좌. 누르면 패스 상세로 이동한다 */
function PassUpgradeSection({ challengeId, paymentAmount }: Props) {
  const { visible, passHref, passPrice, contentLabels } = usePassUpgradeOffer(
    challengeId,
    challengeId > 0,
  );

  if (!visible || !passHref) return null;

  const extraAmount =
    passPrice !== null ? Math.max(passPrice - paymentAmount, 0) : null;

  return (
    <Link
      href={passHref}
      className="pass_upgrade_payment mb-10 block overflow-hidden rounded-sm border-2 border-primary"
    >
      <div className="flex items-center justify-between bg-primary px-4 py-2.5 md:px-5">
        <span className="text-xsmall14 font-semibold tracking-wide text-white">
          ALL-IN-ONE PASS 업그레이드
        </span>
        <span className="text-xxsmall12 font-medium text-[#FFD43B]">
          결제 전 마지막 기회!
        </span>
      </div>
      <div className="flex flex-col gap-3 bg-white px-4 py-4 md:px-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 h-6 w-6 shrink-0 rounded-xs border-2 border-primary"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xsmall16 font-bold text-neutral-0">
              이 챌린지 대신 올인원 패스로 결제할게요
            </p>
            {contentLabels.length > 0 && (
              <p className="text-xsmall14 text-neutral-30">
                {contentLabels.join(' + ')}
              </p>
            )}
          </div>
        </div>
        {extraAmount !== null && (
          <div className="flex items-center justify-between rounded-xs bg-primary-5 px-4 py-3">
            <span className="text-xsmall14 text-neutral-30">
              챌린지 {paymentAmount.toLocaleString()}원 → 패스로 바꾸면 추가
            </span>
            <strong className="text-small18 font-bold text-primary">
              +{extraAmount.toLocaleString()}원
            </strong>
          </div>
        )}
      </div>
    </Link>
  );
}

export default PassUpgradeSection;
