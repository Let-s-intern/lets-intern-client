'use client';

import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
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
      className="pass_upgrade_payment flex items-center justify-between gap-4 rounded-[8px] bg-primary-10 px-4 py-3"
    >
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-0.5 text-xsmall14 font-semibold text-primary">
          올인원 패스 혜택 보기
          <LuChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
        {contentLabels.length > 0 && (
          <p className="text-xsmall14 text-neutral-10">
            {contentLabels.join(' + ')}
          </p>
        )}
      </div>
      {extraAmount !== null && (
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="text-xsmall14 text-neutral-10">패스로 바꾸면</span>
          <strong className="text-xsmall16 font-bold text-primary">
            +{extraAmount.toLocaleString()}원
          </strong>
        </div>
      )}
    </Link>
  );
}

export default PassUpgradeSection;
