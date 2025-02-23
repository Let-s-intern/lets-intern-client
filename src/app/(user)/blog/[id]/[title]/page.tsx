import { fetchBlogData, fetchRecommendBlogData } from '@/api/blog';
import LexicalContent from '@/components/common/blog/LexicalContent';
import RecommendBlogCard from '@/components/common/blog/RecommendBlogCard';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import {
  getBaseUrlFromServer,
  getBlogPathname,
  getBlogTitle,
} from '@/utils/url';
import BlogCTA from '@components/common/blog/BlogCTA';
import BlogHashtag from '@components/common/blog/BlogHashtag';
import BlogHomeButton from '@components/common/blog/BlogHomeButton';
import BlogKakaoShareBtn from '@components/common/blog/BlogKakaoShareBtn';
import BlogLinkShareBtn from '@components/common/blog/BlogLilnkShareBtn';
import BlogRating from '@components/common/blog/BlogRating';
import BlogShareSection from '@components/common/blog/BlogShareSection';
import HorizontalRule from '@components/ui/HorizontalRule';
import { CircleChevronRight, Heart } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlogData(id);

  return {
    title: getBlogTitle(blog.blogDetailInfo),
    description: blog.blogDetailInfo.description,
    openGraph: {
      title: blog.blogDetailInfo.title || undefined,
      description: blog.blogDetailInfo.description || undefined,
      url: getBaseUrlFromServer() + getBlogPathname(blog.blogDetailInfo),
      images: [
        {
          url: blog.blogDetailInfo.thumbnail || '',
        },
      ],
    },
    alternates: {
      canonical: getBaseUrlFromServer() + getBlogPathname(blog.blogDetailInfo),
    },
  };
}

const BlogDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const blog = await fetchBlogData(id);
  const recommendData = await fetchRecommendBlogData({
    type: blog?.blogDetailInfo.category,
    pageable: { page: 0, size: 4 },
  });

  const blogInfo = blog.blogDetailInfo;

  return (
    <main className="mx-auto w-full max-w-[1100px]">
      <div className="flex flex-col items-center md:flex-row md:gap-20">
        {/* 본문 */}
        <section className="w-full px-5 md:px-0">
          <article className="flex flex-col gap-8">
            {/* 썸네일 */}
            <div className="relative h-[16rem] overflow-hidden rounded-md bg-neutral-95 md:h-[25.5rem]">
              <Image
                className="object-contain"
                priority
                fill
                src={blogInfo.thumbnail ?? ''}
                alt="블로그 썸네일"
                sizes="(max-width: 768px) 100vw, 26rem"
              />
            </div>
            {/* 블로그 헤더 */}
            <div className="flex flex-col gap-y-4">
              {/* 제목 */}
              <div>
                {blogInfo.category && (
                  <h2 className="mb-2 text-small20 font-semibold text-primary">
                    {blogCategory[blogInfo.category]}
                  </h2>
                )}
                <h1 className="line-clamp-3 text-xlarge28 font-bold text-neutral-0 md:line-clamp-2">
                  {blogInfo.title}{' '}
                  {!blogInfo.isDisplayed && (
                    <span className="text-xsmall14 text-system-error">
                      (비공개)
                    </span>
                  )}
                </h1>
              </div>
              <div className="flex items-center justify-between">
                {/* 게시 일자 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 justify-center overflow-hidden rounded-full">
                      <Image
                        width={20}
                        height={20}
                        src="/logo/logo-gradient.svg"
                        alt="쥬디 프로필 사진"
                      />
                    </div>
                    <span className="text-xsmall14 font-semibold text-neutral-0">
                      쥬디
                    </span>
                  </div>
                  {blogInfo.displayDate && (
                    <p className="text-xsmall14 text-neutral-35">
                      {dayjs(blogInfo.displayDate).format(YYYY_MM_DD)} 작성
                    </p>
                  )}
                </div>
                {/* 공유 버튼 */}
                <BlogLinkShareBtn />
              </div>
            </div>
            {/* 블로그 본문 */}
            {blogInfo?.content && (
              <div className="w-full break-all text-xsmall16">
                <LexicalContent node={JSON.parse(blogInfo.content).root} />
              </div>
            )}
          </article>

          <section className="mb-9 mt-10 flex items-center justify-between">
            {/* 좋아요 */}
            <button type="button" className="flex items-center gap-2">
              <Heart width={20} height={20} color="#4D55F5" />
              <span className="text-xsmall14 font-medium text-primary">
                좋아요 NNN
              </span>
            </button>
            {/* 공유하기 */}
            <div className="flex items-center">
              <BlogLinkShareBtn
                className="border-none p-2"
                hideCaption
                iconWidth={20}
                iconHeight={20}
              />
              <BlogKakaoShareBtn
                className="p-2"
                title={blogInfo.title ?? ''}
                description={blogInfo.description ?? ''}
                thumbnail={blogInfo.thumbnail ?? ''}
                pathname={getBlogPathname(blogInfo)}
              />
              <span className="text-xsmall14 font-medium text-neutral-35">
                공유하기
              </span>
            </div>
          </section>

          <HorizontalRule className="-mx-5 h-3 md:hidden" />
          <Link
            href="/blog/list"
            className="flex w-full items-center justify-center gap-2 py-5"
          >
            <p className="text-xsmall14 font-semibold text-neutral-0">
              <span className="text-primary">블로그 홈</span> 바로가기
            </p>
            <CircleChevronRight width={16} height={16} color="#5F66F6" />
          </Link>
          <HorizontalRule className="-mx-5 h-3 md:hidden" />
        </section>
        <aside className="w-full px-5 py-9">
          <h2 className="text-small20 font-semibold text-neutral-0">
            렛츠커리어 프로그램 참여하고
            <br />
            취뽀 성공해요!
          </h2>
        </aside>
      </div>
      {/* 프로그램 추천 */}
      <section></section>

      <div className="flex w-full max-w-[1100px] flex-col items-center px-5 md:px-10 md:pt-10">
        <div className="flex w-full flex-col items-center gap-y-8 pt-8 md:px-[100px] md:pt-8">
          <div className="flex w-full items-center justify-center gap-x-3 py-10">
            <div className="flex items-center justify-center rounded-full border border-primary-20 p-[9px]">
              <img
                className="h-[36px] w-[36px]"
                src="/logo/logo-gradient.svg"
                alt="author"
              />
            </div>
            <div className="flex flex-1 flex-col text-neutral-0">
              <h3 className="text-small18 font-bold">렛츠커리어</h3>
              <p className="text-xsmall16">커리어의 첫걸음을 함께 해요</p>
            </div>
          </div>
          <BlogRating blogId={blog.blogDetailInfo.id} />
          <div className="flex w-full flex-wrap items-center gap-1 py-3">
            {blog.tagDetailInfos.map((tag) => (
              <BlogHashtag key={tag.id} text={tag.title || ''} tagId={tag.id} />
            ))}
          </div>
          <div className="flex w-full items-center py-5">
            <hr className="w-full bg-neutral-60" />
          </div>
          <BlogShareSection
            title={blog.blogDetailInfo.title || ''}
            description={
              blog.blogDetailInfo.description?.substring(0, 30) + '...' || ''
            }
            thumbnail={blog.blogDetailInfo.thumbnail || ''}
            pathname={getBlogPathname(blog.blogDetailInfo)}
          />
          <BlogHomeButton />
        </div>
      </div>
      {/* 함께 읽어보면 좋아요 */}
      <div className="mt-8 flex w-full flex-col items-center bg-neutral-100 py-10 md:py-[60px] md:pb-10">
        <div className="flex w-full max-w-[1200px] flex-col px-5 md:px-10">
          <div className="flex w-full flex-col items-center md:px-[100px]">
            <div className="flex w-full flex-col gap-y-5">
              <h3 className="text-xl font-semibold">함께 읽어보면 좋아요</h3>
              <div className="blog_recommend flex w-full flex-col gap-y-5">
                {!recommendData ? (
                  <div className="w-full text-center">
                    추천 글을 찾을 수 없습니다.
                  </div>
                ) : (
                  recommendData.blogInfos
                    .filter(
                      (recommend) =>
                        recommend.blogThumbnailInfo.id !==
                        blog.blogDetailInfo.id,
                    )
                    .map((blog) => (
                      <RecommendBlogCard
                        key={blog.blogThumbnailInfo.id}
                        {...blog}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 블로그 CTA */}
      {blog.blogDetailInfo.ctaText && blog.blogDetailInfo.ctaLink && (
        <BlogCTA
          ctaText={blog.blogDetailInfo.ctaText}
          ctaLink={blog.blogDetailInfo.ctaLink}
        />
      )}
    </main>
  );
};

export default BlogDetailPage;
