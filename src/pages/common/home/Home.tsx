import ProgramSection from '../../../components/common/home/current/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/current/overview/ProgramOverviewSection';
import AdvantageSection from '../../../components/common/home/current/advantage/AdvantageSection';

const Home = () => {
  return (
    <div className="px-5">
      <div className="mx-auto mb-16 max-w-[1080px]">
        <ProgramSection />
        <ProgramOverviewSection />
        <AdvantageSection />
      </div>
    </div>
  );
};

export default Home;
