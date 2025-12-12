import { useChallengeQuery } from '@/api/challenge';
import BaseButton from '@/common/ui/button/BaseButton';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ChallengeContent } from '@/types/interface';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RecommendedProgramSwiper from './RecommendedProgramSwiper';

const MoreButton = ({
  visible = false,
  onClick,
}: {
  visible?: boolean;
  onClick?: () => void;
}) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      className="dashboard_moreprogramrec hidden text-xsmall14 font-medium text-neutral-45 md:inline"
      onClick={onClick}
    >
      더보기
    </button>
  );
};

const MobileMoreButton = ({
  visible,
  onClick,
}: {
  visible?: boolean;
  onClick?: () => void;
}) => {
  if (!visible) return null;

  return (
    <div className="px-5">
      <BaseButton
        variant="outlined"
        className="w-full rounded-xxs border bg-transparent md:hidden"
        onClick={onClick}
      >
        프로그램 더보기
      </BaseButton>
    </div>
  );
};

function RecommendedProgramSection() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ programId: string }>();
  const trackEvent = useGoogleAnalytics();
  const { data: challenge, isLoading } = useChallengeQuery({
    challengeId: Number(params.programId),
  });

  const descJson = useMemo<ChallengeContent | null>(() => {
    if (!challenge?.desc) return null;
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [challenge?.desc]);

  const programs = descJson?.operationRecommendProgram?.list ?? [];
  const moreButtonInfo = descJson?.operationRecommendMoreButton;

  const handleClickMore = (
    clickUrl: string,
    currentChallengeTitle?: string,
  ) => {
    trackEvent({
      eventName: 'dashboard_moreprogramrec',
      eventData: {
        click_url: clickUrl,
        current_dashboard_challenge_name: currentChallengeTitle,
      },
    });
    router.push(clickUrl);
  };

  const EXCLUDED_PATHS = ['me', 'guides', 'user/info', 'feedback'];
  // 컴포넌트를 렌더링하지 않음
  const shouldHideSection = EXCLUDED_PATHS.some((path) =>
    pathname.includes(path),
  );
  if (shouldHideSection) {
    return null;
  }

  if (isLoading || programs.length === 0) return null;

  return (
    <>
      <section className="mt-14 flex flex-col gap-5 pb-12 md:mt-[72px]">
        <div className="flex w-full max-w-[1120px] items-center justify-between px-5 md:mx-auto md:px-0">
          <h2 className="text-xsmall16 font-semibold md:text-small18">
            챌린지 참여자들이 선택한 <br className="md:hidden" />
            다른 프로그램도 확인해보세요{' '}
            <span role="img" aria-label="돋보기">
              🔍
            </span>
          </h2>
          <MoreButton
            visible={moreButtonInfo?.visible && !!moreButtonInfo?.url}
            onClick={() =>
              handleClickMore(moreButtonInfo?.url ?? '', challenge?.title)
            }
          />
        </div>
        <RecommendedProgramSwiper programs={programs} />
        <MobileMoreButton
          visible={moreButtonInfo?.visible && !!moreButtonInfo?.url}
          onClick={() =>
            handleClickMore(moreButtonInfo?.url ?? '', challenge?.title)
          }
        />
      </section>
    </>
  );
}

export default RecommendedProgramSection;
