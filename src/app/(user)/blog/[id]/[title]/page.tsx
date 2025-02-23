import { fetchBlogData } from '@/api/blog';
import LexicalContent from '@/components/common/blog/LexicalContent';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { blogCategory } from '@/utils/convert';
import { generateUuid } from '@/utils/random';
import {
  getBaseUrlFromServer,
  getBlogPathname,
  getBlogTitle,
} from '@/utils/url';
import BlogCTA from '@components/common/blog/BlogCTA';
import BlogKakaoShareBtn from '@components/common/blog/BlogKakaoShareBtn';
import BlogLinkShareBtn from '@components/common/blog/BlogLilnkShareBtn';
import BlogRecommendCard from '@components/common/blog/BlogRecommendCard';
import ProgramRecommendCard from '@components/common/blog/ProgramRecommendCard';
import HorizontalRule from '@components/ui/HorizontalRule';
import { CircleChevronRight, Heart } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

const programMockData = [
  {
    id: generateUuid(),
    ctaTitle: '취업 일단 시작!',
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    ctaLink:
      'https://www.letscareer.co.kr/blog/63/2%EC%9B%94-3%EC%A3%BC%EC%B0%A8-%EC%9D%B8%ED%84%B4-%EC%8B%A0%EC%9E%85-%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0-%5B%EC%99%B8%EA%B5%AD%EA%B3%84-%EA%B8%B0%EC%97%85%5D',
  },
  {
    id: generateUuid(),
    ctaTitle: '취업 일단 시작!',
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    ctaLink:
      'https://www.letscareer.co.kr/blog/63/2%EC%9B%94-3%EC%A3%BC%EC%B0%A8-%EC%9D%B8%ED%84%B4-%EC%8B%A0%EC%9E%85-%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0-%5B%EC%99%B8%EA%B5%AD%EA%B3%84-%EA%B8%B0%EC%97%85%5D',
  },
  {
    id: generateUuid(),
    ctaTitle: '취업 일단 시작!',
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    ctaLink:
      'https://www.letscareer.co.kr/blog/63/2%EC%9B%94-3%EC%A3%BC%EC%B0%A8-%EC%9D%B8%ED%84%B4-%EC%8B%A0%EC%9E%85-%EC%B1%84%EC%9A%A9%EA%B3%B5%EA%B3%A0-%5B%EC%99%B8%EA%B5%AD%EA%B3%84-%EA%B8%B0%EC%97%85%5D',
  },
];

const blogMockData = [
  {
    id: generateUuid(),
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    category: '렛츠커리어 소식',
  },
  {
    id: generateUuid(),
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    category: '렛츠커리어 소식',
  },
  {
    id: generateUuid(),
    title: '2월 3주차 인턴/신입 채용공고 [외국계 기업]',
    thumbnail:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/blog/FeRrTQbYvJ_Frame%201984080307.png',
    category: '렛츠커리어 소식',
  },
];

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

  return (
    <main className="mx-auto w-full max-w-[1100px] pb-12 pt-6">
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
                  <Heading2 className="text-primary">
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

        {/* 프로그램 추천 */}
        <aside className="w-full px-5 py-9">
          <Heading2>
            렛츠커리어 프로그램 참여하고
            <br />
            취뽀 성공해요!
          </Heading2>
          <section className="mb-6 mt-5 flex flex-col gap-6">
            {programMockData.map((item) => (
              <ProgramRecommendCard key={item.id} program={item} />
            ))}
          </section>
          <MoreLink href="/program">모집 중인 프로그램 보기</MoreLink>
        </aside>
      </div>

      <HorizontalRule className="h-3 md:hidden" />

      {/* 다른 블로그 글 */}
      <section className="px-5 py-9 md:px-0">
        <Heading2>
          이 글을 읽으셨다면, <br className="md:hidden" />
          이런 글도 좋아하실 거예요.
        </Heading2>
        <div className="mb-6 mt-5 flex flex-col gap-6">
          {blogMockData.map((item) => (
            <BlogRecommendCard key={item.id} blog={item} />
          ))}
        </div>
        <MoreLink href="/program">더 많은 블로그 글 보기</MoreLink>
      </section>

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

function Heading2({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        'text-small20 font-semibold text-neutral-0',
        className,
      )}
    >
      {children}
    </h2>
  );
}

function MoreLink({ href, children }: { href: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      className="block w-full rounded-xs border border-neutral-85 px-5 py-3 text-center font-medium text-neutral-20"
    >
      {children}
    </Link>
  );
}

export default BlogDetailPage;
