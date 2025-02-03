'use client';

import { useGetReviewCount } from '@/api/review';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const description = {
  blog: (
    <>
      렛츠커리어 프로그램 참여자들이 직접 작성한 생생한 블로그 후기를 한곳에
      모았습니다.
      <br />
      실제 참여자들의 솔직한 이야기를 지금 바로 확인해보세요!
    </>
  ),
  program: (
    <>
      렛츠커리어만의 취업 노하우가 잔뜩 담긴 프로그램에 참여한
      <br className="hidden md:block" />
      참여자들의 100% 솔직 후기를 가감 없이 그대로 보여드립니다.
    </>
  ),
};

function ReviewBanner() {
  const pathname = usePathname();
  const { data } = useGetReviewCount();

  const heading = {
    all: `렛츠커리어 100% 솔직 후기 ${data?.count ? `총 ${data.count}개` : ''}`,
    program: '프로그램 참여 후기',
    mission: '미션 수행 후기',
    blog: '블로그 후기',
    interview: '프로그램 참여자 인터뷰',
  };

  type HeadingKey = keyof typeof heading;

  return (
    <header className="relative flex bg-secondary px-5 md:justify-center py-10 h-[11.125rem] md:h-[10.75rem]">
      {/* 본문 */}
      <div className="flex flex-col z-10 gap-1 w-full md:pl-3 md:gap-2 max-w-[1100px]">
        {/* pathname에 따라 제목 불러오기 */}
        <h1 className="text-white md:text-medium24 text-small20 font-bold">
          {pathname === '/review'
            ? heading.all
            : heading[pathname.slice(8) as HeadingKey]}
        </h1>
        <p className="text-neutral-90 md:text-xsmall16 text-xsmall14 text-justify md:text-left">
          {pathname === '/review/blog' ? description.blog : description.program}
        </p>
      </div>

      {/* 이미지 */}
      <div className="w-full md:w-[36rem] md:h-full bg-light absolute bottom-0 md:top-0 md:left-auto left-0 right-0 h-[6.75rem]">
        <Image
          className="object-cover"
          src="/images/review-banner.png"
          alt="렛츠커리어 행사 사진"
          fill
          sizes="(min-width: 768px) 36rem, 100vw"
          priority
        />
        {/* 이미지 위에 올라가는 Gradient 배경 */}
        <div className="absolute w-full bottom-0 md:top-0 md:left-auto left-0 right-0 h-full bg-gradient-to-t md:bg-gradient-to-l from-secondary/0 to-secondary" />
      </div>
    </header>
  );
}

export default ReviewBanner;
