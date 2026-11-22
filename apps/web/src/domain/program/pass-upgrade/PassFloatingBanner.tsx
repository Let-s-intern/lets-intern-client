'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LuChevronRight, LuX } from 'react-icons/lu';
import { usePassUpgradeOffer } from './usePassUpgradeOffer';

interface Props {
  challengeId: number;
}

/**
 * 결제하기 모바일 화면에서 결제 버튼 위에 떠 있는 올인원 패스 안내.
 * 패스 회원은 챌린지를 무료로 들으므로 회원가는 0원이다. 닫으면 이 화면에서는 다시 안 뜬다.
 */
const PassFloatingBanner = ({ challengeId }: Props) => {
  const { visible, passHref } = usePassUpgradeOffer(
    challengeId,
    challengeId > 0,
  );
  const [closed, setClosed] = useState(false);

  if (!visible || !passHref || closed) return null;

  return (
    <div className="pass_floating_banner absolute inset-x-3 bottom-full mb-2 flex items-center justify-between gap-3 rounded-sm bg-primary-10 px-4 py-3 shadow-05 md:hidden">
      <Link
        href={passHref}
        className="flex flex-1 items-center justify-between gap-3"
        data-url={passHref}
      >
        <span className="flex items-center gap-0.5 text-xsmall14 font-semibold text-primary">
          올인원 패스 혜택 보기
          <LuChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex flex-col items-end text-xxsmall12 text-neutral-20">
          패스 회원가
          <strong className="text-xsmall16 font-bold text-primary">0원</strong>
        </span>
      </Link>
      <button
        type="button"
        aria-label="패스 안내 닫기"
        onClick={() => setClosed(true)}
        className="shrink-0 text-neutral-30"
      >
        <LuX className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default PassFloatingBanner;
