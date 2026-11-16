// 메인 web 으로 이동하는 외부 링크의 호스트.
// VITE_WEB_URL 미설정 시 admin 자기 자신의 root 로 fallback (안전장치).
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '/';

const ProgramRecommendCTA = () => {
  return (
    <section className="mb-5 mt-[66px] flex w-full flex-col items-center justify-between gap-2.5 rounded-sm bg-primary-10 p-5 md:mb-4 md:mt-16 md:flex-row md:rounded-sm">
      <span className="text-xsmall14 font-bold text-primary md:text-xsmall16">
        나에게 맞는 프로그램을 찾기 어려우신가요?
      </span>
      <a
        href={`${WEB_URL}/curation`}
        className="text-0.75-medium shrink-0 rounded-xs bg-primary px-4 py-2 text-static-100 transition-colors hover:bg-primary-dark md:px-4 md:py-2 md:text-xsmall14"
      >
        나에게 맞는 프로그램 찾기
      </a>
    </section>
  );
};

export default ProgramRecommendCTA;
