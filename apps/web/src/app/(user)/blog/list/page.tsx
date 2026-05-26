import BlogListContent from '@/domain/blog/BlogListContent';
import { NEWSLETTER_SUBSCRIBE_URL } from '@/domain/blog/ad/data/newsletter';
import * as Sentry from '@sentry/nextjs';
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
          <NewsletterSubscribeButton url={NEWSLETTER_SUBSCRIBE_URL} />
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
 * 배너 우측 "뉴스레터 구독하기" pill 버튼.
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동.
 * 구독 링크(`NEWSLETTER_SUBSCRIBE_URL`)가 아직 비어 있으면 클릭은 비활성이지만
 * 버튼 자체는 노출한다(추후 링크 입력 시 자동 활성화).
 */
function NewsletterSubscribeButton({ url }: { url: string }) {
  const label = '🔥 렛츠커리어 뉴스레터 구독하기';
  const className =
    'text-primary text-xsmall14 md:text-xsmall16 w-fit shrink-0 whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold shadow-sm transition-colors hover:bg-white/90';

  if (!url) {
    return (
      <span className={className} aria-disabled>
        {label}
      </span>
    );
  }

  if (url.startsWith('http')) {
    return (
      <a href={url} target="_blank" rel="noopener" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={url} className={className}>
      {label}
    </Link>
  );
}
