import useScrollFade from '@/hooks/useScrollFade';

const Caption = [
  '취업, 어디서부터 시작해야 할 지 모르겠어..',
  '나에게 맞는 직무, 어떻게 찾아야 하지?',
  '인턴 어떻게 시작하는 건데?',
];

const TopSection = () => {
  const { boxRef, ref0, ref1, ref2 } = useScrollFade();

  return (
    <header className="px-auto relative h-[3000px] bg-gradient-to-b from-[#4D55F5] via-[#2D328F] via-80% to-[#101348] pb-24 sm:pb-[6.5rem] xl:pb-32">
      <div
        ref={boxRef}
        className="sticky top-48 flex w-full flex-col items-center"
      >
        <h1 className="text-1.75-bold xl:text-2.25-bold text-static-100 mb-[3.25rem] text-center">
          커리어의 첫 걸음 🏃‍♀️
          <br />
          <span className="text-[#A9C1FF]">렛츠커리어</span>가 함께 합니다
        </h1>
        <div className="relative flex w-full max-w-[34rem] flex-col items-center overflow-x-hidden">
          {/* Background */}
          <div className="border-static-100/15 from-static-100/20 to-static-100/0 h-10 w-[7.2rem] translate-x-4 rounded-full border bg-gradient-to-b opacity-50" />
          <div className="bg-static-100/10 h-10 w-[8.5rem] -translate-y-6 translate-x-24 rounded-full sm:w-[12.4rem] sm:translate-x-32" />
          <div className="bg-static-100/10 h-10 w-[6.375rem] -translate-x-36 -translate-y-6 rounded-full blur-sm" />
          <div className="border-static-100/15 from-static-100/0 to-static-100/20 h-10 w-[11.7rem] -translate-y-2 translate-x-32 rounded-full border bg-gradient-to-b opacity-50" />
          <div className="bg-static-100/10 h-10 w-[8.8rem] -translate-x-36 translate-y-4 rounded-full md:-translate-x-48" />
          <div className="border-static-100/15 from-static-100/0 to-static-100/20 h-10 w-[7.2rem] -translate-x-20 rounded-full border bg-gradient-to-b opacity-50 md:-translate-x-32" />

          <div>
            <div
              ref={ref0}
              className="bg-static-100 shadow-static-100/40 absolute left-1/2 top-1/2 flex h-10 min-w-max -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-6 py-3 shadow-[0_0_12px_0] transition-all duration-300"
            >
              <span className="text-0.875-semibold xl:text-1-semibold text-primary">
                {Caption[0]}
              </span>
            </div>
            <div
              ref={ref1}
              className="bg-static-100 shadow-static-100/40 absolute left-1/2 top-1/2 flex h-10 min-w-max -translate-x-1/2 -translate-y-2/3 items-center justify-center rounded-full px-6 py-3 opacity-0 shadow-[0_0_12px_0] transition-all duration-300"
            >
              <span className="text-0.875-semibold xl:text-1-semibold text-primary">
                {Caption[1]}
              </span>
            </div>
            <div
              ref={ref2}
              className="bg-static-100 shadow-static-100/40 absolute left-1/2 top-1/2 flex h-10 min-w-max -translate-x-1/2 -translate-y-2/3 items-center justify-center rounded-full px-6 py-3 opacity-0 shadow-[0_0_12px_0] transition-all duration-300"
            >
              <span className="text-0.875-semibold xl:text-1-semibold text-primary">
                {Caption[2]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopSection;
