import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import Link from 'next/link';
import { getPeriodText, isClosingSoon } from '../landingCard';
import { getLandingTargetHref } from './TargetCards';

/**
 * 챌린지 섹션의 큰 카드. 챌린지는 기수와 관계없이 대표 기수 하나로 받는다.
 * 가격은 다중 조회에 없어 상세에서 본다
 */
const FeaturedChallenge = ({ target }: { target: ProgramCategoryTarget }) => {
  const period = getPeriodText(target);
  const href = getLandingTargetHref(target);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
      <Link href={href} className="w-full shrink-0 md:w-[300px]">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-95">
          {target.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={target.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        {isClosingSoon(target) && (
          <span className="w-fit rounded-xs bg-system-error/10 px-1.5 py-0.5 text-xxsmall12 font-semibold text-system-error">
            마감 임박
          </span>
        )}
        <h3 className="text-small20 font-bold text-neutral-0 md:text-medium22">
          {target.title}
        </h3>
        {target.shortDesc && (
          <p className="text-xsmall14 text-neutral-30">{target.shortDesc}</p>
        )}
        {period && (
          <p className="text-xsmall14 text-neutral-30">
            진행기간 <span className="text-primary">{period}</span>
          </p>
        )}
        <Link
          href={href}
          className="category_landing_challenge_cta mt-2 w-fit rounded-xs bg-primary px-5 py-2.5 text-xsmall14 font-semibold text-white"
          data-id={target.targetId}
        >
          챌린지 자세히 보기
        </Link>
      </div>
    </div>
  );
};

/** 챌린지 섹션 아래 한 줄. 섹션마다 한 번만 둔다 */
export const PassFreeNotice = ({ passHref }: { passHref: string }) => (
  <Link
    href={passHref}
    className="category_landing_pass_notice flex items-center justify-between rounded-xs bg-primary-5 px-4 py-3 text-xsmall14"
  >
    <span className="flex items-center gap-2">
      <span className="rounded-full bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
        ALL-IN-ONE PASS
      </span>
      올인원 패스 회원은 <span className="text-primary">무료</span>로 참여 가능!
    </span>
    <span className="text-primary">패스 혜택 보기 ›</span>
  </Link>
);

export default FeaturedChallenge;
