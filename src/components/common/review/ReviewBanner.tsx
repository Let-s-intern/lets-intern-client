'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const heading = {
  all: '렛츠커리어 100% 솔직 후기 총 NN개',
  program: '프로그램 참여 후기',
  blog: '블로그 후기',
  interview: '프로그램 참여자 인터뷰',
};

type HeadingKey = keyof typeof heading;

function ReviewBanner() {
  const pathname = usePathname();

  return (
    <div className="relative flex bg-secondary px-5 md:justify-center py-10 h-[11.125rem] md:h-[10.75rem]">
      {/* 본문 */}
      <div className="flex flex-col z-10 gap-1 w-full md:gap-2 max-w-[1100px]">
        <h1 className="text-white md:text-medium24 text-small20 font-bold">
          {pathname === '/review'
            ? heading.all
            : heading[pathname.slice(8) as HeadingKey]}
        </h1>
        <p className="text-neutral-90 md:text-xsmall16 text-xsmall14 text-justify md:text-left">
          렛츠커리어만의 취업 노하우가 잔뜩 담긴 프로그램에 참여한{' '}
          <br className="hidden md:block" />
          참여자들의 100% 솔직 후기를 가감 없이 그대로 보여드립니다.
        </p>
      </div>

      {/* 이미지 */}
      <div className="w-full md:w-[36rem] md:h-full bg-light absolute bottom-0 md:top-0 md:left-auto left-0 right-0 h-[6.75rem]">
        <Image
          src="/images/review-banner.png"
          alt="렛츠커리어 행사 사진"
          fill
          objectFit="cover"
        />
        {/* 이미지 위에 올라가는 Gradient 배경 */}
        <div className="absolute w-full bottom-0 md:top-0 md:left-auto left-0 right-0 h-full bg-gradient-to-t md:bg-gradient-to-l from-secondary/0 to-secondary" />
      </div>
    </div>
  );
}

export default ReviewBanner;
