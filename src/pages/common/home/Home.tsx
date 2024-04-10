import ProgramSection from '../../../components/common/home/current/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/current/overview/ProgramOverviewSection';

const Home = () => {
  return (
    <div className="px-5">
      <div className="mx-auto max-w-[1080px]">
        <ProgramSection />
        <ProgramOverviewSection />
      </div>
    </div>
  );
};

export default Home;
