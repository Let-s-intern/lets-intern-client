import ProblemChart from './ProblemChart';
import ProblemInterview from './ProblemInterview';

const ProblemSection = () => {
  return (
    <section className="flex flex-col items-center gap-[3.75rem] bg-[#101348] px-5 py-[6.25rme] text-static-100">
      <h2 className="text-1.5-bold text-center">
        대한민국의 많은 청년들은
        <br />
        취업 준비를 앞두고
        <br />
        <span className="text-[#8247FF]">막막함</span>을 느끼고 있습니다
      </h2>

      <div className="flex flex-col gap-[6.25rem] px-5 py-[6.25rem]">
        <ProblemChart />
        <ProblemInterview />
      </div>
    </section>
  );
};

export default ProblemSection;
