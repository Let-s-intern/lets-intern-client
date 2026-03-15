import Link from 'next/link';

const ProgramRecommendCTA = () => {
  return (
    <section className="flex w-full items-center justify-between rounded-sm bg-neutral-95 px-6 py-5 md:rounded-md md:px-10 md:py-6">
      <span className="text-0.875-medium md:text-1-semibold text-neutral-10">
        나에게 맞는 프로그램을 찾기 어려우신가요?
      </span>
      <Link
        href="/program-recommend"
        className="text-0.75-medium md:text-0.875-medium shrink-0 rounded-sm bg-primary px-4 py-2 text-static-100 transition-colors hover:bg-primary-dark md:px-6 md:py-2.5"
      >
        나에게 맞는 프로그램 찾기
      </Link>
    </section>
  );
};

export default ProgramRecommendCTA;
