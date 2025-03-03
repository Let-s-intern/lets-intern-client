import { fetchBlogData, fetchRecommendBlogData } from '@/api/blog';
import { BlogContent, ProgramRecommendItem } from '@/api/blogSchema';
import { fetchProgramRecommend } from '@/api/program';
import { twMerge } from '@/lib/twMerge';
import { ProgramStatusEnum, ProgramTypeEnum } from '@/schema';
import {
  getBaseUrlFromServer,
  getBlogPathname,
  getBlogTitle,
} from '@/utils/url';
import BlogArticle from '@components/common/blog/BlogArticle';
import Heading2 from '@components/common/blog/BlogHeading2';
import BlogKakaoShareBtn from '@components/common/blog/BlogKakaoShareBtn';
import BlogLikeBtn from '@components/common/blog/BlogLikeBtn';
import BlogLinkShareBtn from '@components/common/blog/BlogLilnkShareBtn';
import BlogRecommendCard from '@components/common/blog/BlogRecommendCard';
import ProgramRecommendCard from '@components/common/blog/ProgramRecommendCard';
import MoreHeader from '@components/common/ui/MoreHeader';
import HorizontalRule from '@components/ui/HorizontalRule';
import { CircleChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

const { CHALLENGE } = ProgramTypeEnum.enum;

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

  const blogInfo = blog.blogDetailInfo;
  const contentJson: BlogContent = JSON.parse(
    !blogInfo?.content || blogInfo?.content === '' ? '{}' : blogInfo.content,
  );
  // 구버전은 기존 content에서 렉시컬 내용 가져오기
  const lexical = contentJson.blogRecommend
    ? contentJson.lexical
    : blogInfo?.content;
  const blogRecommendList = await getBlogRecommendList();
  const programRecommendList = await getProgramRecommendList();

  async function getProgramRecommendList() {
    const result = contentJson.programRecommend
      ? contentJson.programRecommend.filter(
          (item) => item.ctaTitle !== undefined,
        )
      : [];

    if (result.length > 0) return result;

    const data = await fetchProgramRecommend();
    const list: ProgramRecommendItem[] = [];
    const ctaTitles: Record<string, string> = {
      CAREER_START: '경험 정리부터 이력서 완성까지',
      PERSONAL_STATEMENT: '합격을 만드는 자소서 작성법',
      PORTFOLIO: '나를 돋보이게 하는 포트폴리오',
      PERSONAL_STATEMENT_LARGE_CORP: '합격을 만드는 자소서 작성법',
    };

    if (data.challengeList.length > 0) {
      const targets = data.challengeList.slice(0, 3).map((item) => ({
        id: `${CHALLENGE}-${item.id}`,
        ctaLink: `/program/${CHALLENGE.toLowerCase()}/${item.id}`,
        ctaTitle: ctaTitles[item.challengeType ?? 'CAREER_START'],
      }));
      list.push(...targets);
    }

    console.log('programRecommendList >>', list);

    return list;
  }

  async function getBlogRecommendList() {
    const data = await Promise.all(
      contentJson.blogRecommend
        ?.filter((id) => id !== null)
        ?.map((id) => fetchBlogData(id)) ?? [],
    );
    const list = data.map((item) => ({
      id: item.blogDetailInfo.id,
      title: item.blogDetailInfo.title,
      category: item.blogDetailInfo.category,
      thumbnail: item.blogDetailInfo.thumbnail,
      displayDate: item.blogDetailInfo.displayDate,
    }));

    if (list.length > 0) return list;

    const recommendData = await fetchRecommendBlogData({
      pageable: { page: 1, size: 10 },
    });

    return recommendData.blogInfos
      .filter(
        // 현재 블로그가 아니고
        // 노출되어 있으며
        // 게시일자가 과거인 게시글
        (info) =>
          info.blogThumbnailInfo.id !== Number(id) &&
          info.blogThumbnailInfo.isDisplayed &&
          info.blogThumbnailInfo.displayDate &&
          new Date(info.blogThumbnailInfo.displayDate) <= new Date(),
      )
      .slice(0, 4)
      .map((item) => ({
        id: item.blogThumbnailInfo.id,
        title: item.blogThumbnailInfo.title,
        category: item.blogThumbnailInfo.category,
        thumbnail: item.blogThumbnailInfo.thumbnail,
        displayDate: item.blogThumbnailInfo.displayDate,
      }));
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] pb-12 pt-6 md:pb-[7.5rem]">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-20">
        {/* 본문 */}
        <section className="w-full px-5 md:px-0">
          <BlogArticle blogInfo={blogInfo} lexical={lexical} />

          <section className="mb-9 mt-10 flex items-center justify-between md:mb-6">
            {/* 좋아요 */}
            <BlogLikeBtn likeCount={blogInfo.likeCount ?? 0} />
            {/* 공유하기 */}
            <div className="flex items-center">
              <span className="mr-1.5 hidden text-xsmall14 font-medium text-neutral-35 md:block">
                나만 보기 아깝다면 공유하기
              </span>
              <BlogLinkShareBtn
                className="border-none p-2"
                hideCaption
                iconWidth={20}
                iconHeight={20}
              />
              <BlogKakaoShareBtn
                className="blog_share p-2"
                title={blogInfo.title ?? ''}
                description={blogInfo.description ?? ''}
                thumbnail={blogInfo.thumbnail ?? ''}
                pathname={getBlogPathname(blogInfo)}
              />
              <span className="text-xsmall14 font-medium text-neutral-35 md:hidden">
                공유하기
              </span>
            </div>
          </section>

          <HorizontalRule className="-mx-5 h-3 md:hidden" />
          <Link
            href="/blog/list"
            className="blog_home flex w-full items-center justify-center gap-2 py-5 md:rounded-xs md:bg-neutral-95"
          >
            <p className="text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16 md:font-medium">
              <span className="font-semibold text-primary">블로그 홈</span>{' '}
              바로가기
            </p>
            <CircleChevronRight
              className="h-4 w-4 md:h-5 md:w-5"
              color="#5F66F6"
            />
          </Link>
          <HorizontalRule className="-mx-5 h-3 md:hidden" />
        </section>

        {/* 프로그램 추천 */}
        {(programRecommendList ?? []).length > 0 && (
          <aside className="w-full px-5 py-9 md:sticky md:top-[100px] md:max-w-[20.5rem] md:rounded-md md:border md:border-neutral-80 md:px-6 md:py-5">
            <Heading2 className="text-neutral-0 md:text-xsmall16">
              렛츠커리어 프로그램 참여하고
              <br />
              취뽀 성공해요!
            </Heading2>
            <section className="mb-6 mt-5 flex flex-col gap-6">
              {programRecommendList?.map((item) => (
                <ProgramRecommendCard key={item.id} program={item} />
              ))}
            </section>
            <MoreLink
              href={`/program/?status=${ProgramStatusEnum.enum.PROCEEDING}`}
            >
              모집 중인 프로그램 보기
            </MoreLink>
          </aside>
        )}
      </div>

      <HorizontalRule className="h-3 md:hidden" />

      {/* 다른 블로그 글 */}
      {blogRecommendList.length > 0 && (
        <section className="px-5 py-9 md:mt-[6.25rem] md:p-0">
          <MoreHeader
            href="/blog/list"
            gaText="이 글을 읽으셨다면, 이런 글도 좋아하실 거예요."
            hideMoreWhenMobile
          >
            이 글을 읽으셨다면, <br className="md:hidden" />
            이런 글도 좋아하실 거예요.
          </MoreHeader>
          <div className="mb-6 mt-5 grid grid-cols-1 gap-6 md:mt-6 md:grid-cols-4 md:items-start md:gap-5">
            {blogRecommendList.map((blog) => (
              <BlogRecommendCard key={blog.id} blog={blog} />
            ))}
          </div>
          <MoreLink href="/blog/list" className="md:hidden">
            더 많은 블로그 글 보기
          </MoreLink>
        </section>
      )}

      {/* [삭제하지 마세요] 블로그 CTA */}
      {/* {blog.blogDetailInfo.ctaText && blog.blogDetailInfo.ctaLink && (
        <BlogCTA
          ctaText={blog.blogDetailInfo.ctaText}
          ctaLink={blog.blogDetailInfo.ctaLink}
        />
      )} */}
    </main>
  );
};

function MoreLink({
  href,
  children,
  className,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={twMerge(
        'block w-full rounded-xs border border-neutral-80 px-5 py-3 text-center font-medium text-neutral-20',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export default BlogDetailPage;
