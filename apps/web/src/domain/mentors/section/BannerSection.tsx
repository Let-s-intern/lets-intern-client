const BannerSection = () => {
  return (
    <section className="w-full bg-[#152B65] px-5 py-10 xl:px-[170px]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-medium24 font-bold text-neutral-100">
            렛츠커리어 멘토
          </h1>
          <p className="text-xsmall16 text-neutral-90">
            렛츠커리와 함께하는 멘토들에게 취업 노하우와
            <br />
            ####를 @@@@ 하세요
          </p>
        </div>

        <button
          type="button"
          className="text-primary hover:text-primary-hover flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-neutral-100 px-5 py-2 font-normal"
        >
          <img src="/logo/logo-gradient.svg" alt="" className="h-6 w-6" />
          현직자 멘토와 1:1 LIVE 멘토링하기
        </button>
      </div>
    </section>
  );
};

export default BannerSection;
