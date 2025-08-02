import { useChallengeQuery } from '@/api/program';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BaseButton from '../ui/button/BaseButton';
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

  const { data: challenge, isLoading } = useChallengeQuery(params.programId);

  const descJson = useMemo<ChallengeContent | null>(() => {
    if (!challenge?.desc) return null;
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [challenge?.desc]);

  const isDashboardPage = /^\/challenge\/\d+\/dashboard\/\d+$/.test(
    location.pathname,
  );
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

  if (!isDashboardPage || isLoading || programs.length === 0) return null;

  return (
    <section className="mb-10 flex flex-col gap-5 bg-primary-5 pb-12 pt-10 md:mb-16">
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
  );
}

export default RecommendedProgramSection;
