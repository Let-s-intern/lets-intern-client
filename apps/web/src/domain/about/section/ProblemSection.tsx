export default function ProblemSection() {
  return (
    <section className="md:md-[8.75rem] text-static-100 flex flex-col items-center gap-[3.75rem] overflow-hidden bg-[#101348] px-5 py-[6.25rem] md:gap-[6.25rem] md:px-10">
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
}

const CAPTION = ['교내활동', '대외활동', '인턴십'];

const ProblemInterview = () => {
  return (
    <div className="flex w-80 flex-col items-center">
      <div className="relative flex w-[22rem] flex-col items-center pb-9">
        <div className="flex flex-col items-center gap-6">
          {CAPTION.map((item) => (
            <div className="relative" key={item}>
              <div className="bg-static-100/15 h-11 w-[9.875rem] translate-x-1 translate-y-2 rounded-md" />
              <div className="border-static-100/65 bg-static-100/15 shadow-static-100/40 absolute top-0 flex h-11 w-[9.875rem] -translate-x-1 items-center justify-center rounded-md border shadow-[0_0_8px_0]">
                <span className="text-0.875-bold text-neutral-100">{item}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Icons */}
        <img
          className="absolute left-8 top-8"
          alt="light1"
          src="/icons/light1.svg"
        />
        <img
          className="absolute right-8 top-20"
          alt="light2"
          src="/icons/light2.svg"
        />
        <img
          className="absolute left-16 top-36"
          alt="circle"
          src="/icons/circle.svg"
        />
        {/* Background */}
        <div className="absolute bottom-0 top-0 h-full w-full bg-gradient-to-b from-[#101348]/0 via-[#101348]/65 to-[#101348]/95 to-90%" />
      </div>
      <div className="border-primary mb-8 flex h-11 w-[9.875rem] -translate-x-1 items-center justify-center rounded-md border border-dashed">
        <span className="text-0.875-bold text-primary">자신감</span>
      </div>
      <span className="text-0.75-medium xl:text-1-medium text-primary-dark">
        취업 준비생 인터뷰
      </span>
      <p className="text-1-medium xl:text-1.25 text-static-100/65 mt-3 text-center">
        경쟁의 굴레 속에 끊임없이 남들과
        <br />
        비교하며 자신감을 잃어가는 취업 준비생
      </p>
    </div>
  );
};

const chartStyle = {
  background: 'conic-gradient(#181957 55deg, #4138A3 55deg, #8247FF)',
};

const ProblemChart = () => {
  return (
    <div className="flex w-80 flex-col items-center">
      <div className="relative">
        <div className="relative mb-6">
          <div style={chartStyle} className="h-64 w-64 rounded-full" />
          <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#101348]">
            <span className="text-0.75-medium xl:text-0.875-medium text-neutral-60">
              취업 정보 수집 어려움
            </span>
            <span className="text-1.5-bold xl:text-1.75-bold">84.5%</span>
          </div>
        </div>
        <img
          className="absolute bottom-12 right-0"
          src="/icons/lucide_mouse-pointer.svg"
          alt="마우스 포인터 아이콘"
        />
      </div>
      <span className="text-0.75-medium xl:text-1-medium text-primary-dark">
        2022.02 잡코리아
      </span>
      <p className="text-1-medium xl:text-1.25 text-static-100/65 mt-3 text-center">
        어디서 어떤 정보를 얻어야 할지 몰라
        <br />
        어려움을 겪는 취업 준비생
      </p>
    </div>
  );
};
