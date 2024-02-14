import DailyMissionInfoSection from './DailyMissionInfoSection';
import DailyMissionSubmitSection from './DailyMissionSubmitSection';

interface Props {
  dailyMission: any;
}

const DailyMissionSection = ({ dailyMission }: Props) => {
  return (
    <section className="mt-5 text-[#333333]">
      <h2 className="text-lg font-bold">데일리 미션</h2>
      <div className="mt-2 rounded bg-[#F6F8FB] px-12 py-8">
        <DailyMissionInfoSection dailyMission={dailyMission} />
        <hr className="my-8 border-[0.5px] border-[#DEDEDE]" />
        <DailyMissionSubmitSection dailyMission={dailyMission} />
      </div>
    </section>
  );
};

export default DailyMissionSection;
