import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import DailyMissionInfoSection from './DailyMissionInfoSection';
import DailyMissionSubmitSection from './DailyMissionSubmitSection';

interface Props {
  dailyMission: any;
}

const DailyMissionSection = ({ dailyMission }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollTo = searchParams.get('scroll_to');
    if (scrollTo === 'daily-mission') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSearchParams({}, { replace: true });
    }
  }, [sectionRef, searchParams, setSearchParams]);

  return (
    <section
      className="mt-5 scroll-mt-[calc(6rem+1rem)] text-[#333333]"
      ref={sectionRef}
    >
      <h2 className="text-lg font-bold">미션 수행하기</h2>
      <div className="rounded mt-2 bg-[#F6F8FB] px-12 py-8">
        <DailyMissionInfoSection dailyMission={dailyMission} />
        <hr className="my-8 border-[0.5px] border-[#DEDEDE]" />
        <DailyMissionSubmitSection dailyMission={dailyMission} />
      </div>
    </section>
  );
};

export default DailyMissionSection;
