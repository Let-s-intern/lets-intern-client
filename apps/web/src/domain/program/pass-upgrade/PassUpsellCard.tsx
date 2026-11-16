'use client';

import Link from 'next/link';
import { LuCheck } from 'react-icons/lu';
import { usePassUpgradeOffer } from './usePassUpgradeOffer';

/** 결제 완료 화면의 올인원 패스 업셀 카드. 누르면 패스 상세로 이동한다 */
function PassUpsellCard({ challengeId }: { challengeId: number }) {
  const { visible, passHref, passPrice, contentLabels } = usePassUpgradeOffer(
    challengeId,
    challengeId > 0,
  );

  if (!visible || !passHref) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-small20 font-bold text-neutral-0 md:text-medium24">
        다음 서류도 준비돼 있나요?
      </p>
      <div className="flex flex-col gap-4 rounded-md border-2 border-primary px-5 py-6 md:px-8">
        <span className="w-fit rounded-xxs bg-primary px-2 py-1 text-xxsmall12 font-semibold text-white">
          ALL-IN-ONE PASS
        </span>
        <p className="text-small18 font-bold text-neutral-0 md:text-small20">
          지금 올인원 패스로 업그레이드하면
          <br />
          다른 챌린지까지 이어서 준비할 수 있어요
        </p>
        {passPrice !== null && (
          <strong className="text-xlarge28 font-bold text-primary">
            ₩{passPrice.toLocaleString()}
          </strong>
        )}
        {contentLabels.length > 0 && (
          <ul className="flex flex-col gap-2">
            {contentLabels.map((label) => (
              <li
                key={label}
                className="flex items-start gap-1.5 text-xsmall14 text-neutral-20 md:text-xsmall16"
              >
                <LuCheck className="mt-0.5 shrink-0" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={passHref}
          className="pass_upgrade_result flex w-full justify-center rounded-sm bg-primary px-6 py-3 text-xsmall16 font-semibold text-white"
        >
          올인원 패스 자세히 보기
        </Link>
      </div>
    </div>
  );
}

export default PassUpsellCard;
