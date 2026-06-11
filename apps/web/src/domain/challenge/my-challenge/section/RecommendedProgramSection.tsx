import { useChallengeHome } from '@/api/challenge/challenge';
import BaseButton from '@/common/button/BaseButton';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ChallengeHome } from '@/schema';
import { useParams, usePathname, useRouter } from 'next/navigation';
import RecommendedProgramSwiper from './RecommendedProgramSwiper';

type RecommendSection = ChallengeHome['programRecommendList'][0];

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
      className="dashboard_moreprogramrec text-xsmall14 text-neutral-45 hidden font-medium md:inline"
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
        className="rounded-xxs w-full border bg-transparent md:hidden"
        onClick={onClick}
      >
        프로그램 더보기
      </BaseButton>
    </div>
  );
};

const RecommendSection = ({ section }: { section: RecommendSection }) => {
  const router = useRouter();
  const trackEvent = useGoogleAnalytics();

  const handleClickMore = () => {
    if (!section.moreUrl) return;
    trackEvent({
      eventName: 'dashboard_moreprogramrec',
      eventData: { click_url: section.moreUrl },
    });
    router.push(section.moreUrl);
  };

  return (
    <section className="mt-14 flex flex-col gap-5 pb-12 md:mt-[72px]">
      <div className="flex w-full max-w-[1120px] items-center justify-between px-5 md:mx-auto md:px-0">
        <h2 className="text-xsmall16 md:text-small18 font-semibold">
          {section.title}
        </h2>
        <MoreButton
          visible={section.isMoreVisible && !!section.moreUrl}
          onClick={handleClickMore}
        />
      </div>
      <RecommendedProgramSwiper programs={section.programs} />
      <MobileMoreButton
        visible={section.isMoreVisible && !!section.moreUrl}
        onClick={handleClickMore}
      />
    </section>
  );
};

function RecommendedProgramSection() {
  const pathname = usePathname();
  const params = useParams<{ programId: string }>();

  const { data: homeData } = useChallengeHome(Number(params.programId));

  const programRecommendList = homeData?.programRecommendList ?? [];

  const EXCLUDED_PATHS = ['me', 'guides', 'user/info', 'feedback'];
  const shouldHideSection = EXCLUDED_PATHS.some((path) =>
    pathname.includes(path),
  );
  if (shouldHideSection) return null;

  if (programRecommendList.length === 0) return null;

  return (
    <>
      {programRecommendList.map((section) => (
        <RecommendSection key={section.id} section={section} />
      ))}
    </>
  );
}

export default RecommendedProgramSection;
