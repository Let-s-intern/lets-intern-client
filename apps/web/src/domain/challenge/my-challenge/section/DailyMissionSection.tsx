import { dailyMissionDetailQueryOptions } from '@/domain/challenge/api/missionDetail';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
import { MyDailyMission } from '@/schema';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import DailyMissionInfoSection from './DailyMissionInfoSection';
import DailyMissionSubmitSection from './DailyMissionSubmitSection';

interface Props {
  myDailyMission: MyDailyMission;
}

const DailyMissionSection = ({ myDailyMission }: Props) => {
  const { currentChallenge } = useOldCurrentChallenge();
  const dailyMissionId = myDailyMission.dailyMission?.id;

  // 챌린지/미션 id가 없으면 조회 불가(기존 enabled 조건 보존).
  if (!currentChallenge?.id || !dailyMissionId) return null;

  return (
    <AsyncBoundary pendingFallback={null} rejectedFallback={() => null}>
      <DailyMissionContent
        myDailyMission={myDailyMission}
        challengeId={currentChallenge.id}
        dailyMissionId={dailyMissionId}
      />
    </AsyncBoundary>
  );
};

const DailyMissionContent = ({
  myDailyMission,
  challengeId,
  dailyMissionId,
}: {
  myDailyMission: MyDailyMission;
  challengeId: number;
  dailyMissionId: number;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollTo = searchParams.get('scroll_to');
    if (scrollTo === 'daily-mission') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      router.replace(window.location.pathname);
    }
  }, [sectionRef, searchParams, router]);

  const { data: missionDetail } = useSuspenseQuery(
    dailyMissionDetailQueryOptions(challengeId, dailyMissionId),
  );

  if (!missionDetail) return null;

  return (
    <section
      className="mt-5 scroll-mt-[calc(6rem+1rem)] text-[#333333]"
      ref={sectionRef}
    >
      <h2 className="text-lg font-bold">미션 수행하기</h2>
      <div className="mt-2 rounded-md bg-[#F6F8FB] px-5 py-8">
        {missionDetail && (
          <DailyMissionInfoSection missionDetail={missionDetail} />
        )}
        <hr className="my-6 mt-11 border-[0.5px] border-[#DEDEDE]" />
        {myDailyMission && (
          <DailyMissionSubmitSection myDailyMission={myDailyMission} />
        )}
      </div>
    </section>
  );
};

export default DailyMissionSection;
