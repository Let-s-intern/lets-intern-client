'use client';

import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
import { usePassUpgradeOffer } from './usePassUpgradeOffer';

interface Props {
  challengeId: number;
  /** 방금 결제한 금액. 모르면 null 이고, 그때는 차액 줄을 그리지 않는다 */
  paidAmount: number | null;
}

/** 결제 완료 화면의 올인원 패스 업셀 카드. 누르면 패스 상세로 이동한다 */
function PassUpsellCard({ challengeId, paidAmount }: Props) {
  const { visible, passHref, passPrice, contentRows } = usePassUpgradeOffer(
    challengeId,
    challengeId > 0,
  );

  if (!visible || !passHref) return null;

  const extraAmount =
    passPrice !== null && paidAmount !== null
      ? Math.max(passPrice - paidAmount, 0)
      : null;

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-small18 font-bold text-neutral-0 md:text-small20">
        함께 이용하면 좋은 혜택
      </p>
      <div className="flex flex-col gap-5 rounded-[16px] border border-primary-10 bg-primary-5 px-5 py-6 md:px-7 md:py-8">
        <div className="flex flex-col gap-2">
          <span className="text-xsmall14 font-bold text-primary">
            ALL-IN-ONE PASS
          </span>
          <p className="text-small18 font-bold text-neutral-0 md:text-small20">
            이 챌린지 외에도 필요한 프로그램이 있다면?
          </p>
          <p className="text-xsmall14 text-neutral-30">
            다른 취업 준비도 함께 하고 싶다면, 올인원 패스의 포함 혜택을 확인해
            보세요.
          </p>
        </div>
        {contentRows.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {contentRows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1 rounded-[12px] border border-neutral-90 bg-white px-4 py-4"
              >
                <span className="text-xsmall16 font-semibold text-neutral-0">
                  {row.label}
                </span>
                <span className="text-xxsmall12 text-neutral-40">
                  {row.note}
                </span>
              </li>
            ))}
          </ul>
        )}
        {extraAmount !== null && (
          <div className="flex items-center justify-between gap-4 border-t border-neutral-90 px-1 pt-5">
            <span className="text-xsmall16 font-medium text-neutral-0">
              패스로 변경한다면?
            </span>
            <strong className="text-small20 font-bold text-primary">
              +{extraAmount.toLocaleString()}원
            </strong>
          </div>
        )}
        <Link
          href={passHref}
          className="pass_upgrade_result flex w-full items-center justify-center gap-1 rounded-[8px] bg-primary px-6 py-3 text-xsmall16 font-semibold text-white"
        >
          올인원 패스 자세히 보기
          <LuChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default PassUpsellCard;
