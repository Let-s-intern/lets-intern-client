import BlogListContent from '@/domain/blog/BlogListContent';
import { blogListBannerButtonData } from '@/domain/blog/ad/data/listBanner.data';
import * as Sentry from '@sentry/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  Sentry.setTag('domain', 'blog');
  Sentry.setTag('blog.route', '/blog/list');

  return (
    <div className="flex flex-col items-center">
      {/* 블로그 배너 */}
      <header className="bg-blog-banner-sm md:bg-blog-banner-md lg:bg-blog-banner-lg mb-8 flex h-[154px] w-full items-center bg-cover bg-no-repeat px-5 md:mb-11 md:h-[168px] md:px-0">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-2">
          <div className="flex flex-col gap-1 md:gap-2">
            <h1 className="text-small20 md:text-medium24 font-bold text-neutral-100">
              렛츠커리어 블로그
            </h1>
            <p className="text-xsmall14 md:text-xsmall16 text-white/90">
              취업 준비부터 실무까지, 커리어의 시작을 돕습니다.
              <br />
              독자적인 커리어 교육 콘텐츠를 확인해보세요.
            </p>
          </div>
          <NewsletterSubscribeButton url={blogListBannerButtonData.link} />
        </div>
      </header>

      {/* 블로그 콘텐츠 */}
      <main className="mx-auto mb-12 w-full max-w-[1100px] px-5 md:mb-20 md:px-0">
        <BlogListContent />
      </main>
    </div>
  );
}

/**
 * 배너 우측 "뉴스레터 바로 신청하기" 이미지 버튼.
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동.
 * 구독 링크(`blogListBannerButtonData.link`)가 아직 비어 있으면 클릭은 비활성이지만
 * 버튼 자체는 노출한다(추후 링크 입력 시 자동 활성화).
 * 크기/위치는 `listBanner.data.ts`의 size 값으로 조정한다.
 */
function NewsletterSubscribeButton({ url }: { url: string }) {
  const { image, width, height, alt, size } = blogListBannerButtonData;

  // 비율(width:height) 자동 유지 — pc/모바일 너비·위치(offsetX/Y)를 데이터로 조정
  const buttonImage = (
    <>
      {/* 데스크톱 */}
      <Image
        src={image}
        width={width}
        height={height}
        alt={alt}
        className="hidden h-auto md:block"
        style={{
          width: size.pc.widthPx,
          transform: `translate(${size.pc.offsetX}px, ${size.pc.offsetY}px)`,
        }}
      />
      {/* 모바일 */}
      <Image
        src={image}
        width={width}
        height={height}
        alt={alt}
        className="block h-auto md:hidden"
        style={{
          width: size.mobile.widthPx,
          transform: `translate(${size.mobile.offsetX}px, ${size.mobile.offsetY}px)`,
        }}
      />
    </>
  );

  if (!url) {
    return <span className="w-fit shrink-0">{buttonImage}</span>;
  }

  if (url.startsWith('http')) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="w-fit shrink-0 transition-opacity hover:opacity-90"
      >
        {buttonImage}
      </a>
    );
  }

  return (
    <Link
      href={url}
      className="w-fit shrink-0 transition-opacity hover:opacity-90"
    >
      {buttonImage}
    </Link>
  );
}
