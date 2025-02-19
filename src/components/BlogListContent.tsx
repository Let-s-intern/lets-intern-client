'use client';

import { useBlogListQuery } from '@/api/blog';
import BellIcon from '@/assets/icons/Bell.svg';
import LockKeyHoleIcon from '@/assets/icons/lock-keyhole.svg';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, ReactNode, Suspense, useMemo } from 'react';
import BlogCard from './common/blog/BlogCard';
import BlogFilter from './common/blog/BlogFilter';
import BaseButton from './common/ui/button/BaseButton';
import EmptyContainer from './common/ui/EmptyContainer';
import LoadingContainer from './common/ui/loading/LoadingContainer';

const filterList = Object.entries(blogCategory).map(([key, value]) => ({
  caption: value,
  value: key,
}));

// 블로그 목록 조회 API에서 사용하는 쿼리 파라미터 key
const ParamKeyEnum = {
  type: 'type',
} as const;

// 공개 예정 여부
const willBePublished = (date: string) => dayjs(date).isAfter(dayjs());

const blogBannerMockData = {
  blogBannerList: [
    {
      blogBannerId: 45,
      title: '블로그 배너1',
      link: 'https://www.naver.com/',
      startDate: '2025-02-10T11:27:45.897Z',
      endDate: '2025-04-19T11:27:45.897Z',
      weight: 0,
      isVisible: true,
    },
    {
      blogBannerId: 23,
      title: '블로그 배너2',
      link: 'https://www.naver.com/',
      startDate: '2025-02-18T11:27:45.897Z',
      endDate: '2025-02-20T11:27:45.897Z',
      weight: 0,
      isVisible: true,
    },
  ],
};

const Content = () => {
  const params = useSearchParams();

  return (
    <>
      <section className="mb-6 flex flex-col gap-6 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-0">
        <Heading2>블로그 콘텐츠</Heading2>
        <BlogFilter
          label="콘텐츠 카테고리"
          list={filterList}
          paramKey={ParamKeyEnum.type}
        />
      </section>

      <BlogList type={params.get(ParamKeyEnum.type)?.toUpperCase()} />
    </>
  );
};

function Heading2({ children }: { children?: ReactNode }) {
  return <h2 className="text-small20 font-semibold">{children}</h2>;
}

function BlogList({ type }: { type?: string | null }) {
  const router = useRouter();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: isMobile ? 6 : 14 },
    type,
  });

  if (isLoading) {
    return (
      <LoadingContainer
        className="pb-[60vh]"
        text="블로그를 가져오는 중입니다.."
      />
    );
  }

  if (data?.blogInfos.length === 0) {
    return (
      <section className="flex flex-col items-center gap-6 md:gap-8">
        <div className="py-20">
          <EmptyContainer
            className="h-fit pb-8 pt-0"
            text={`준비 중인 콘텐츠입니다.\n조금만 기다려주세요!`}
          />
          <BaseButton
            className="rounded-xs border px-5 py-2 text-xsmall14"
            variant="outlined"
            onClick={() => router.replace('/blog/list')}
          >
            다른 블로그 콘텐츠 둘러보기
          </BaseButton>
        </div>

        <div className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <Heading2>이런 콘텐츠는 어떠세요?</Heading2>
            <Link
              className="text-xsmall14 font-medium text-neutral-45"
              href="/blog/list"
            >
              더보기
            </Link>
          </div>
          <BlogRecommendList />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-[4.25rem]">
      {data?.blogInfos.map(({ blogThumbnailInfo }, index) => {
        /**
         * 블로그 광고 배너 노출
         * 모바일: 인덱스 2, 5일 때 함께 노출
         * PC: 인덱스 3, 7일 때 함께 노출
         */
        const blogBanners = blogBannerMockData.blogBannerList;
        let blogBannerCard = null;

        if (isMobile && index === 2) {
          blogBannerCard = (
            <BlogCard
              key={blogBanners[0].blogBannerId}
              title={blogBanners[0].title}
              superTitle="커스텀"
              thumbnailItem={
                <img className="h-full w-full object-cover" src="" alt="" />
              }
            />
          );
        }

        if (isMobile && index === 5)
          blogBannerCard = (
            <BlogCard
              key={blogBanners[1].blogBannerId}
              title={blogBanners[1].title}
              superTitle="커스텀"
              thumbnailItem={
                <img className="h-full w-full object-cover" src="" alt="" />
              }
            />
          );

        if (!isMobile && index === 3)
          blogBannerCard = (
            <BlogCard
              key={blogBanners[1].blogBannerId}
              title={blogBanners[1].title}
              superTitle="커스텀"
              thumbnailItem={
                <img className="h-full w-full object-cover" src="" alt="" />
              }
            />
          );

        if (!isMobile && index === 7)
          blogBannerCard = (
            <BlogCard
              key={blogBanners[1].blogBannerId}
              title={blogBanners[1].title}
              superTitle="커스텀"
              thumbnailItem={
                <img className="h-full w-full object-cover" src="" alt="" />
              }
            />
          );

        return (
          <Fragment key={blogThumbnailInfo.id}>
            {blogBannerCard}
            <BlogCard
              title={blogThumbnailInfo.title ?? ''}
              superTitle={
                blogThumbnailInfo.category
                  ? blogCategory[blogThumbnailInfo.category]
                  : '전체'
              }
              thumbnailItem={
                <>
                  <img
                    className="h-full w-full object-cover"
                    src={blogThumbnailInfo.thumbnail ?? undefined}
                    alt={blogThumbnailInfo.title ?? undefined}
                  />
                  {willBePublished(blogThumbnailInfo.displayDate ?? '') && (
                    <div className="absolute inset-0 flex justify-end bg-black/30 p-3">
                      <div className="flex h-fit w-fit items-center rounded-full bg-white/50 py-1 pl-1 pr-1.5">
                        <LockKeyHoleIcon width={16} height={16} />
                        <span className="text-xxsmall12 font-semibold text-[#484848]">
                          공개예정
                        </span>
                      </div>
                    </div>
                  )}
                </>
              }
              displayDate={dayjs(blogThumbnailInfo.displayDate).format(
                YYYY_MM_DD,
              )}
              buttonItem={
                willBePublished(blogThumbnailInfo.displayDate ?? '') ? (
                  <BaseButton
                    variant="point"
                    className="flex items-center gap-1 rounded-xs p-2.5 text-xxsmall12 font-medium"
                  >
                    <BellIcon width={16} height={16} />
                    <span>공개 예정</span>
                  </BaseButton>
                ) : null
              }
            />
          </Fragment>
        );
      })}
    </section>
  );
}

function BlogRecommendList() {
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: 8 },
  });
  // 공개된 블로그 중 최신 게시글 4개 추천
  const displayedBlogblogInfos = useMemo(
    () =>
      data?.blogInfos
        .filter(
          ({ blogThumbnailInfo }) =>
            blogThumbnailInfo.displayDate &&
            !willBePublished(blogThumbnailInfo.displayDate),
        )
        .slice(0, 4),
    [data],
  );

  if (isLoading) return <LoadingContainer />;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-5">
      {displayedBlogblogInfos?.map(({ blogThumbnailInfo }) => (
        <BlogCard
          key={blogThumbnailInfo.id}
          title={blogThumbnailInfo.title ?? ''}
          superTitle={
            blogThumbnailInfo.category
              ? blogCategory[blogThumbnailInfo.category]
              : '전체'
          }
          thumbnailItem={
            <img
              className="h-full w-full object-cover"
              src={blogThumbnailInfo.thumbnail ?? undefined}
              alt={blogThumbnailInfo.title ?? undefined}
            />
          }
          displayDate={
            blogThumbnailInfo.displayDate
              ? dayjs(blogThumbnailInfo.displayDate).format(YYYY_MM_DD)
              : undefined
          }
        />
      ))}
    </div>
  );
}

export default function BlogListContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
