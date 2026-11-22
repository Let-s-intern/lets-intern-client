'use client';

import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
import { usePassUpgradeOffer } from './usePassUpgradeOffer';

interface Props {
  challengeId: number;
}

/** 결제하기 화면의 올인원 패스 업그레이드 구좌. 누르면 패스 상세로 이동한다 */
function PassUpgradeSection({ challengeId }: Props) {
  const { visible, passHref } = usePassUpgradeOffer(
    challengeId,
    challengeId > 0,
  );

  if (!visible || !passHref) return null;

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
        <p className="text-xsmall14 text-neutral-10">
          모든 챌린지 무료 참여 가능!
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-xsmall14 text-neutral-10">패스 회원가</span>
        <strong className="text-xsmall16 font-bold text-primary">0원</strong>
      </div>
    </Link>
  );
}

export default PassUpgradeSection;
