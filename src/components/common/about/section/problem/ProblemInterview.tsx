const CAPTION = ['교내활동', '대외활동', '인턴십'];

const ProblemInterview = () => {
  return (
    <div className="flex w-80 flex-col items-center">
      <div className="relative flex w-[22rem] flex-col items-center pb-9">
        <div className="flex flex-col items-center gap-6">
          {CAPTION.map((item) => (
            <div className="relative" key={item}>
              <div className="h-11 w-[9.875rem] translate-x-1 translate-y-2 rounded-md bg-static-100/15" />
              <div className="absolute top-0 flex h-11 w-[9.875rem] -translate-x-1 items-center justify-center rounded-md border border-static-100/65 bg-static-100/15 shadow-[0_0_8px_0] shadow-static-100/40">
                <span className="text-0.875-bold text-neutral-100">{item}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Icons */}
        <img className="absolute left-8 top-8" src="/icons/light1.svg" />
        <img className="absolute right-8 top-20" src="/icons/light2.svg" />
        <img className="absolute left-16 top-36" src="/icons/circle.svg" />
        {/* Background */}
        <div className="absolute bottom-0 top-0 h-full w-full bg-gradient-to-b from-[#101348]/0 via-[#101348]/65 to-[#101348]/95 to-90%" />
      </div>
      <div className="mb-8 flex h-11 w-[9.875rem] -translate-x-1 items-center justify-center rounded-md border border-dashed border-primary">
        <span className="text-0.875-bold text-primary">자신감</span>
      </div>
      <span className="text-0.75-medium xl:text-1-medium text-primary-dark">
        취업 준비생 인터뷰
      </span>
      <p className="text-1-medium xl:text-1.25 mt-3 text-center text-static-100/65">
        경쟁의 굴레 속에 끊임없이 남들과
        <br />
        비교하며 자신감을 잃어가는 취업 준비생
      </p>
    </div>
  );
};

export default ProblemInterview;
