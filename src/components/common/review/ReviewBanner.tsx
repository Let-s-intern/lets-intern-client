'use client';

import { BlogType, useBlogListQuery } from '@/api/blog';
import { useGetReviewCount } from '@/api/review';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const description = {
  blog: (
    <>
      렛츠커리어 프로그램 참여자들이 직접 작성한 <br className="md:hidden" />
      생생한 블로그 후기를 한곳에 모았습니다.
      <br />
      실제 참여자들의 솔직한 이야기를 지금 바로 확인해보세요!
    </>
  ),
  program: (
    <>
      취업 노하우가 잔뜩 담긴 프로그램에
      <br className="md:hidden" /> 참여한
      <br className="hidden md:block" /> 참여자들의 100% 솔직 후기를 가감 없이
      <br className="md:hidden" /> 그대로 보여드립니다.
    </>
  ),
};

function ReviewBanner() {
  const pathname = usePathname();
  const { data } = useGetReviewCount();
  const { data: blogData } = useBlogListQuery({
    pageable: { page: 1, size: 0 },
    types: [BlogType.PROGRAM_REVIEWS],
  });

  const reviewsCount =
    (data?.count ?? 0) + (blogData?.pageInfo.totalElements ?? 0);

  const heading = {
    all: (
      <>
        렛츠커리어 100% 솔직 후기{' '}
        {reviewsCount !== 0 && (
          <span className="items-center rounded-[4px] bg-[#4C64A5] px-[6px] py-[4px] text-xsmall14 font-semibold md:text-small18">
            총 {reviewsCount.toLocaleString()}개
          </span>
        )}
      </>
    ),
    program: '참여 후기',
    mission: '미션 수행 후기',
    blog: '블로그 후기',
    interview: '프로그램 참여자 인터뷰',
  };

  type HeadingKey = keyof typeof heading;

  return (
    <header className="relative flex bg-[#152B65] md:px-5">
      <div className="relative mx-auto flex h-[228px] w-full max-w-[1100px] flex-col items-center md:h-[172px] md:flex-row md:px-3">
        {/* 본문 */}
        <div className="z-10 mt-10 flex w-full max-w-[1100px] flex-col gap-1 px-5 md:mt-0 md:gap-2 md:px-0">
          {/* pathname에 따라 제목 불러오기 */}
          <h1 className="flex items-center gap-2 text-small20 font-semibold text-white md:text-medium24">
            {pathname === '/review'
              ? heading.all
              : heading[pathname.split('/')[2] as HeadingKey]}
          </h1>
          <p className="text-justify text-xsmall14 text-neutral-90 md:text-left md:text-xsmall16">
            {pathname === '/review/blog'
              ? description.blog
              : description.program}
          </p>
        </div>

        {/* 이미지 */}
        <div className="bg-light relative mt-4 h-[6.75rem] w-full overflow-hidden md:absolute md:bottom-0 md:right-0 md:mt-0 md:h-full md:w-[28rem]">
          {/* 모바일 전용 */}
          <Image
            unoptimized
            fill
            className="object-cover object-top md:hidden"
            src="/images/review-banner-mobile.png"
            alt="렛츠커리어 행사 사진"
            sizes="100vw"
            priority
          />
          {/* 데스크탑 전용 */}
          <Image
            unoptimized
            fill
            className="hidden object-cover md:block"
            src="/images/review-banner.png"
            alt="렛츠커리어 행사 사진"
            sizes="(min-width: 768px) 36rem, 100vw"
            priority
          />
          {/* 이미지 위에 올라가는 Gradient 배경 */}
          <div className="absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-b from-[#152B6500] to-[#152B6575] md:left-auto md:top-0 md:bg-gradient-to-t" />
        </div>
      </div>
    </header>
  );
}

export default ReviewBanner;
