import { useChallengeQuery } from '@/api/challenge';
import BaseButton from '@/components/common/ui/button/BaseButton';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
      className="hidden text-xsmall14 font-medium text-neutral-45 md:inline"
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
  const location = useLocation();
  const params = useParams();
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
    setTimeout(() => (window.location.href = clickUrl), 300);
  };

  // 'me' 경로에 포함되어 있으면 컴포넌트를 렌더링하지 않음
  if (location.pathname.includes('me')) {
    return null;
  }

  console.log(isLoading, programs.length);
  if (isLoading || programs.length === 0) return null;

  return (
    <>
      <hr className="mx-5 my-8 border-t border-neutral-85 md:mx-auto md:my-12 md:max-w-[1120px]" />
      <section className="flex flex-col gap-5 pb-12">
        <div className="flex w-full max-w-[1120px] items-center justify-between px-5 md:mx-auto md:px-0">
          <h2 className="text-xsmall16 font-semibold md:text-small18">
            함께 들으면 더 좋아요. <br className="md:hidden" />
            참가자들이 선택한 프로그램만 모았어요.
          </h2>
          <MoreButton
            visible={moreButtonInfo?.visible}
            onClick={() =>
              handleClickMore(moreButtonInfo?.url ?? '', challenge?.title)
            }
          />
        </div>
        <RecommendedProgramSwiper programs={programs} />
        <MobileMoreButton
          visible={moreButtonInfo?.visible}
          onClick={() =>
            handleClickMore(moreButtonInfo?.url ?? '', challenge?.title)
          }
        />
      </section>
    </>
  );
}

export default RecommendedProgramSection;
