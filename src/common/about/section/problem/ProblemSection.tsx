import ProblemChart from './ProblemChart';
import ProblemInterview from './ProblemInterview';

const ProblemSection = () => {
  return (
    <section className="md:md-[8.75rem] flex flex-col items-center gap-[3.75rem] overflow-hidden bg-[#101348] px-5 py-[6.25rem] text-static-100 md:gap-[6.25rem] md:px-10">
      <h2 className="text-1.5-bold xl:text-1.75-bold text-center">
        대한민국의 많은 청년들은
        <br />
        취업 준비를 앞두고
        <br />
        <span className="text-[#8247FF]">막막함</span>을 느끼고 있습니다
      </h2>

      <div className="flex flex-col gap-[6.25rem] px-5 py-[6.25rem] md:flex-row lg:gap-[8.75rem]">
        <ProblemChart />
        <ProblemInterview />
      </div>
    </section>
  );
};

export default ProblemSection;
