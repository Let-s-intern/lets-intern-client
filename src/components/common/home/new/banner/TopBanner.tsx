import { useState } from 'react';

const TopBanner = () => {
  const [isShow, setIsShow] = useState(true);

  return isShow ? (
    <section className="mt-3 bg-neutral-0 px-5 py-3">
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-1 text-center text-static-100 md:flex-row">
          <span className="text-1-semibold">면접 아직도 어렵다면?</span>
          <span className="text-0.875-medium">
            👉🏻 면접 준비 7일 속성 부트캠프 2기 신청하기
          </span>
        </div>
        <img
          onClick={() => setIsShow(false)}
          className="absolute right-0 top-0 h-6 w-6 cursor-pointer"
          src="/icons/Close_MD.svg"
          alt="상단띠배너 닫기"
        />
      </div>
    </section>
  ) : (
    <></>
  );
};

export default TopBanner;
