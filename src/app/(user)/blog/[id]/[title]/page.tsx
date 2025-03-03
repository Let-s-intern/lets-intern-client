import { fetchBlogData, fetchRecommendBlogData } from '@/api/blog';
import { BlogContent, ProgramRecommendItem } from '@/api/blogSchema';
import { fetchProgramRecommend } from '@/api/program';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ProgramStatusEnum, ProgramTypeEnum } from '@/schema';
import { blogCategory } from '@/utils/convert';
import {
  getBaseUrlFromServer,
  getBlogPathname,
  getBlogTitle,
} from '@/utils/url';
import BlogKakaoShareBtn from '@components/common/blog/BlogKakaoShareBtn';
import BlogLikeBtn from '@components/common/blog/BlogLikeBtn';
import BlogLinkShareBtn from '@components/common/blog/BlogLilnkShareBtn';
import BlogRecommendCard from '@components/common/blog/BlogRecommendCard';
import LexicalContent from '@components/common/blog/LexicalContent';
import ProgramRecommendCard from '@components/common/blog/ProgramRecommendCard';
import MoreHeader from '@components/common/ui/MoreHeader';
import HorizontalRule from '@components/ui/HorizontalRule';
import { CircleChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
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

  // 공개 예정 여부
  const willBePublished = dayjs(blog.blogDetailInfo.displayDate).isAfter(
    dayjs(),
  );
  const blogInfo = blog.blogDetailInfo;
  const contentJson: BlogContent = JSON.parse(blogInfo?.content ?? '{}');
  // 구버전은 기존 content에서 렉시컬 내용 가져오기
  const lexical = contentJson.blogRecommend
    ? contentJson.lexical
    : blogInfo?.content;
  const blogRecommendList = await getBlogRecommendList();
  const programRecommendList = await getProgramRecommendList();

  async function getProgramRecommendList() {
    const result = contentJson.programRecommend?.filter(
      (item) => item.ctaTitle !== undefined,
    );

    if (result?.length !== 0) return result;

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
        ctaLink: `/program/${item.programType?.toLowerCase()}/${item.id}`,
        ctaTitle: ctaTitles[item.challengeType ?? 'CAREER_START'],
      }));
      list.push(...targets);
    }

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

    if (list.length !== 0) return list;

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
          <article>
            {/* 썸네일 */}
            <div className="relative mb-8 h-[16rem] overflow-hidden rounded-md bg-neutral-95 md:h-[25.5rem]">
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
            <div className="mb-7 flex flex-col gap-y-4">
              {/* 제목 */}
              <div>
                {blogInfo.category && (
                  <Heading2 className="mb-1.5 text-primary" id="blog-category">
                    {blogCategory[blogInfo.category]}
                  </Heading2>
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
                <div className="flex items-center gap-3 md:gap-4">
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
                    <p className="text-xsmall14 text-neutral-35 md:text-xsmall16">
                      {dayjs(blogInfo.displayDate).format(YYYY_MM_DD)}{' '}
                      {willBePublished ? '공개 예정' : '작성'}
                    </p>
                  )}
                </div>
                {/* 공유 버튼 */}
                <BlogLinkShareBtn />
              </div>
            </div>

            {/* 블로그 본문 */}
            {willBePublished ? (
              <p className="py-16 text-center">
                아직 공개되지 않은 블로그입니다 🫥
              </p>
            ) : (
              lexical && (
                <div className="w-full break-all text-xsmall16">
                  <LexicalContent node={JSON.parse(lexical as string).root} />
                </div>
              )
            )}
          </article>

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
                className="p-2"
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
            className="flex w-full items-center justify-center gap-2 py-5 md:rounded-xs md:bg-neutral-95"
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

function Heading2({
  children,
  className,
  id,
}: {
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={twMerge(
        'text-small20 font-semibold text-neutral-0',
        className,
      )}
    >
      {children}
    </h2>
  );
}

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
