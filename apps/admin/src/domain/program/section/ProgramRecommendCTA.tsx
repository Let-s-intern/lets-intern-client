import { Link } from 'react-router-dom';

const ProgramRecommendCTA = () => {
  return (
    <section className="mb-5 mt-[66px] flex w-full flex-col items-center justify-between gap-2.5 rounded-sm bg-primary-10 p-5 md:mb-4 md:mt-16 md:flex-row md:rounded-sm">
      <span className="text-xsmall14 font-bold text-primary md:text-xsmall16">
        나에게 맞는 프로그램을 찾기 어려우신가요?
      </span>
      <Link
        to="/program-recommend"
        className="text-0.75-medium shrink-0 rounded-xs bg-primary px-4 py-2 text-static-100 transition-colors hover:bg-primary-dark md:px-4 md:py-2 md:text-xsmall14"
      >
        나에게 맞는 프로그램 찾기
      </Link>
    </section>
  );
};

export default ProgramRecommendCTA;
