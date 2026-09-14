import Link from 'next/link';

interface PlanVersionBannerProps {
  /** 업그레이드할 수 있을 때만 넘긴다 */
  planUpgradeHref?: string;
  /** 버전을 바꿀 수 있을 때만 넘긴다 */
  onVersionChangeClick?: () => void;
}

const CARD_CLASS =
  'border-neutral-80 flex flex-col items-center gap-3 rounded-sm border bg-white p-3 pt-[18px] text-center';
const TEXT_CLASS =
  'text-xsmall16 text-neutral-0 whitespace-pre-line leading-snug tracking-[-0.084px]';
const BUTTON_CLASS =
  'text-primary text-xsmall14 rounded-xs bg-primary-10 w-full px-4 py-2 font-normal';

/**
 * 대시보드 사이드바 쿠폰 배너 아래 플랜 업그레이드·버전 변경 배너 (LC-3247).
 * 쿠폰 배너와 같은 틀에 흰 바탕을 써서 쿠폰 배너보다 한 단계 약하게 보인다.
 * 할 수 없는 쪽은 그리지 않는다.
 */
const PlanVersionBanner = ({
  planUpgradeHref,
  onVersionChangeClick,
}: PlanVersionBannerProps) => {
  if (!planUpgradeHref && !onVersionChangeClick) return null;

  return (
    <>
      {planUpgradeHref && (
        <div className={CARD_CLASS}>
          <p className={TEXT_CLASS}>
            <span className="font-bold">플랜 업그레이드</span>
            <span className="font-medium">{'로\n피드백을 더 받아보세요!'}</span>
          </p>
          <Link href={planUpgradeHref} className={BUTTON_CLASS}>
            플랜 업그레이드하기
          </Link>
        </div>
      )}
      {onVersionChangeClick && (
        <div className={CARD_CLASS}>
          <p className={TEXT_CLASS}>
            <span className="font-bold">버전 변경</span>
            <span className="font-medium">
              {'으로\n나에게 맞는 자료를 받아보세요!'}
            </span>
          </p>
          <button
            type="button"
            className={BUTTON_CLASS}
            onClick={onVersionChangeClick}
          >
            버전 변경하기
          </button>
        </div>
      )}
    </>
  );
};

export default PlanVersionBanner;
