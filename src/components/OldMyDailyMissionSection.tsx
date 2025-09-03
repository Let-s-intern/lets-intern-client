import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyDailyMission, userChallengeMissionDetail } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DailyMissionInfoSection from './common/challenge/my-challenge/section/DailyMissionInfoSection';
import DailyMissionSubmitSection from './common/challenge/my-challenge/section/DailyMissionSubmitSection';

interface Props {
  myDailyMission: MyDailyMission;
}

const OldMyDailyMissionSection = ({ myDailyMission }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentChallenge } = useCurrentChallenge();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollTo = searchParams.get('scroll_to');
    if (scrollTo === 'daily-mission') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSearchParams({}, { replace: true });
    }
  }, [sectionRef, searchParams, setSearchParams]);

  const { data: missionDetail } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: [
      'challenge',
      currentChallenge?.id,
      'mission',
      'daily-mission-detail',
    ],
    queryFn: async () => {
      const res = await axios.get(
        `challenge/${currentChallenge?.id}/missions/${myDailyMission.dailyMission?.id}`,
      );
      return userChallengeMissionDetail.parse(res.data.data).missionInfo;
    },
  });

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

export default OldMyDailyMissionSection;
