const CAPTION = [
  '취업, 어디서부터 시작해야 할 지 모르겠어..',
  '나에게 맞는 직무, 어떻게 찾아야 하지?',
  '인턴 어떻게 시작하는 건데?',
];
const TopSection = () => {
  return (
    <header className="via-77% flex flex-col items-center bg-gradient-to-b from-[#4D55F5] via-[#2D328F] to-[#101348] py-20">
      <h1 className="text-1.75-bold mb-[3.25rem] text-center text-static-100">
        커리어의 첫 걸음 🏃‍♀️
        <br />
        <span className="text-[#A9C1FF]">렛츠커리어</span>가 함께 합니다
      </h1>
      <div className="relative flex w-full max-w-[34rem] flex-col items-center overflow-x-hidden">
        <div className="h-10 w-[7.2rem] translate-x-4 rounded-full border border-static-100/15 bg-gradient-to-b from-static-100/20 to-static-100/0 opacity-50" />
        <div className="h-10 w-[8.5rem] -translate-y-6 translate-x-24 rounded-full bg-static-100/10" />
        <div className="h-10 w-[6.375rem] -translate-x-36 -translate-y-6 rounded-full bg-static-100/10 blur-sm" />
        <div className="h-10 w-[11.7rem] -translate-y-2 translate-x-32 rounded-full border border-static-100/15 bg-gradient-to-b from-static-100/0 to-static-100/20 opacity-50" />
        <div className="h-10 w-[8.8rem] -translate-x-36 rounded-full bg-static-100/10" />
        <div className="h-10 w-[7.2rem] -translate-x-20 -translate-y-4 rounded-full border border-static-100/15 bg-gradient-to-b from-static-100/0 to-static-100/20 opacity-50" />
        <div className="absolute left-1/2 top-1/2 flex h-10 w-[277px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-static-100 py-3 shadow-[0_0_12px_0] shadow-static-100/40">
          <span className="text-0.875-semibold text-primary">{CAPTION[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default TopSection;
