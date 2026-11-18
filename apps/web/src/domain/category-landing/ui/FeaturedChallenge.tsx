import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import Link from 'next/link';
import ChallengeThumbnail from './ChallengeThumbnail';
import {
  formatPrice,
  getChallengeDisplayTitle,
  getDeadlineText,
  getPeriodText,
  isClosingSoon,
  TARGET_TYPE_LABEL,
} from '../landingCard';
import { getLandingTargetHref } from './TargetCards';

/**
 * 챌린지 섹션의 큰 카드. 챌린지는 기수·버전과 관계없이 대표 하나만 보인다.
 * 가격은 다중 조회에 없어 상세에서 본다
 */
const FeaturedChallenge = ({ target }: { target: ProgramCategoryTarget }) => {
  const period = getPeriodText(target);
  const deadline = getDeadlineText(target);
  const href = getLandingTargetHref(target);
  const price = formatPrice(target.price);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <Link href={href} className="w-full shrink-0 md:w-[288px]">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-95">
          <ChallengeThumbnail
            challengeType={target.challengeType}
            title={target.title}
            displayTitle={getChallengeDisplayTitle(target.title)}
            fallbackSrc={target.thumbnail}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col md:py-3">
        {isClosingSoon(target) && (
          <span className="mb-2 w-fit rounded-xxs bg-system-error/10 px-1.5 py-0.5 text-xxsmall12 font-semibold text-system-error">
            {deadline ? `${deadline} 마감 임박` : '마감 임박'}
          </span>
        )}
        <h3 className="text-small20 font-bold text-neutral-0 md:text-medium22">
          {getChallengeDisplayTitle(target.title)}
        </h3>
        {target.shortDesc && (
          <p className="mt-1.5 text-xsmall14 text-neutral-30 md:text-xsmall16">
            {target.shortDesc}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-neutral-85 pt-4 md:mt-auto">
          <div className="flex flex-col gap-0.5">
            {price && (
              <p className="flex items-baseline gap-3 text-xsmall14 text-neutral-30">
                {TARGET_TYPE_LABEL[target.targetType]} 신청가
                <span className="text-small20 font-bold text-neutral-0">
                  {price}
                </span>
              </p>
            )}
            {period && (
              <p className="text-xsmall14 text-neutral-30">
                진행기간{' '}
                <span className="font-semibold text-primary">{period}</span>
              </p>
            )}
          </div>
          <Link
            href={href}
            className="category_landing_challenge_cta shrink-0 rounded-xs bg-primary px-5 py-2.5 text-xsmall14 font-semibold text-white md:text-xsmall16"
            data-id={target.targetId}
          >
            {TARGET_TYPE_LABEL[target.targetType]} 자세히 보기
          </Link>
        </div>
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
