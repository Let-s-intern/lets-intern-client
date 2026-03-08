export default function LibraryBanner() {
  return (
    <div className="w-full overflow-hidden bg-primary-5 px-5 py-9 md:px-0 md:py-6">
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
            취업 준비부터 실무까지, 성공적인 커리어의 시작을 돕습니다.
            <br className="hidden md:block" />
            렛츠커리어의 독자적인 커리어 교육 콘텐츠를 확인해보세요.
          </p>
        </div>
        <img
          src="/icons/banner-folder.svg"
          className="hidden size-[230px] opacity-50 md:block"
          alt=""
        />
      </div>
    </div>
  );
}
