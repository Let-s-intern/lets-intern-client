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
      <p className="text-1-medium xl:text-1.25 mt-3 text-center text-static-100/65">
        어디서 어떤 정보를 얻어야 할지 몰라
        <br />
        어려움을 겪는 취업 준비생
      </p>
    </div>
  );
};

export default ProblemChart;
