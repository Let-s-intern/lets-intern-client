export default function LibraryBanner() {
  return (
    <div className="w-full overflow-hidden bg-primary-5 px-5 py-9 md:px-0 md:py-10">
      <div className="mx-auto flex w-full max-w-[1100px] justify-between">
        <div className="flex flex-col gap-3 self-center md:gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex size-11 items-center justify-center rounded-sm border border-primary-15 bg-white">
              <img
                src="/icons/magnet-folder.svg"
                className="size-6"
                alt="자료집 아이콘"
              />
            </div>
            <h1 className="text-medium22 font-bold text-neutral-0 md:text-xlarge28">
              렛츠커리어 무료 자료집
            </h1>
          </div>
          <p className="text-xsmall14 leading-[22px] text-neutral-40">
            막막한 취업 준비의 길잡이가 되어드립니다.
            <br className="block" />
            정성껏 준비한 커리어 가이드북을 지금 바로 소장해보세요.
          </p>
        </div>
        <img
          src="/icons/banner-folder.svg"
          className="hidden size-[200px] md:block"
          alt=""
        />
      </div>
    </div>
  );
}
