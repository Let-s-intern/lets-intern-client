import ProgramSection from '../../../components/common/home/current/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/current/overview/ProgramOverviewSection';
import AdvantageSection from '../../../components/common/home/current/advantage/AdvantageSection';

const Home = () => {
  return (
    <div className="px-5">
      <div className="mx-auto mb-16 mt-6 flex max-w-[1080px] flex-col gap-16 sm:gap-20">
        <ProgramSection />
        <ProgramOverviewSection />
        <AdvantageSection />
        <section>
          <h1 className="text-sm-1.125-bold lg:text-md-1.5-semibold text-neutral-0">
            렛츠커리어인들은 어디서 커리어를 시작했을까?
          </h1>
          <p className="text-xs-0.875-light lg:text-xs-1-light text-neutral-30">
            기업 로고를 클릭해 합격 후기를 확인해보세요!
          </p>
          <ul className="mt-6 flex flex-nowrap gap-x-4 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <li
                key={index}
                className="h-[6.25rem] w-[14.5rem] flex-shrink-0 overflow-hidden rounded-xs"
              >
                <div className="h-full w-full bg-neutral-80" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
