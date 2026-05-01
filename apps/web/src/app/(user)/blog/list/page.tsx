import BlogListContent from '@/domain/blog/BlogListContent';
import * as Sentry from '@sentry/nextjs';

export default function Page() {
  Sentry.setTag('domain', 'blog');
  Sentry.setTag('blog.route', '/blog/list');

  return (
    <div className="flex flex-col items-center">
      {/* 블로그 배너 */}
      <header className="bg-blog-banner-sm md:bg-blog-banner-md lg:bg-blog-banner-lg mb-8 flex h-[154px] w-full items-center bg-cover bg-no-repeat px-5 md:mb-11 md:h-[168px] md:px-0">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-1 md:gap-2">
          <h1 className="text-small20 md:text-medium24 font-bold text-neutral-100">
            렛츠커리어 블로그
          </h1>
          <p className="text-xsmall14 md:text-xsmall16 text-white/90">
            취업 준비부터 실무까지, 커리어의 시작을 돕습니다.
            <br />
            독자적인 커리어 교육 콘텐츠를 확인해보세요.
          </p>
        </div>
      </header>

      {/* 블로그 콘텐츠 */}
      <main className="mx-auto mb-12 w-full max-w-[1100px] px-5 md:mb-20 md:px-0">
        <BlogListContent />
      </main>
    </div>
  );
}
