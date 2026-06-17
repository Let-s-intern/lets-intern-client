'use client';

import {
  BlogType,
  blogBannerListQueryOptions,
  blogListQueryOptions,
} from '@/api/blog/blog';
import BellIcon from '@/assets/icons/Bell.svg';
import LockKeyHoleIcon from '@/assets/icons/lock-keyhole.svg';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import ContentCard from '@/common/card/ContentCard';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { blogCategory } from '@/utils/convert';
import { useMediaQuery } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import BaseButton from '../../../common/button/BaseButton';
import EmptyContainer from '../../../common/container/EmptyContainer';
import LoadingContainer from '../../../common/loading/LoadingContainer';
import MuiPagination from '@/common/pagination/MuiPagination';
import { BlogRecommendSection } from './BlogRecommendSection';

const willBePublished = (date: string) => dayjs(date).isAfter(dayjs());

interface BlogGridSectionProps {
  types?: BlogType[] | null;
  page: number;
  onChangePage?: (page: number) => void;
}

export function BlogGridSection(props: BlogGridSectionProps) {
  return (
    <AsyncBoundary
      pendingFallback={
        <LoadingContainer
          className="pb-[60vh]"
          text="블로그를 가져오는 중입니다.."
        />
      }
    >
      <BlogGridContent {...props} />
    </AsyncBoundary>
  );
}

function BlogGridContent({ types, page, onChangePage }: BlogGridSectionProps) {
  const router = useRouter();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { data: blogBannerData } = useSuspenseQuery(
    blogBannerListQueryOptions({ page, size: isMobile ? 1 : 2 }),
  );
  const bannerLength = blogBannerData.blogBannerList.length;

  const { data } = useSuspenseQuery(
    blogListQueryOptions({
      pageable: {
        page,
        size: isMobile ? 8 - bannerLength : 16 - bannerLength,
      },
      types,
    }),
  );

  if (data.blogInfos.length === 0) {
    return (
      <section className="flex flex-col items-center gap-6 md:gap-8">
        <div className="py-20">
          <EmptyContainer
            className="h-fit pb-8 pt-0"
            text={`준비 중인 콘텐츠입니다.\n조금만 기다려주세요!`}
          />
          <BaseButton
            className="rounded-xs text-xsmall14 border px-5 py-2"
            variant="outlined"
            onClick={() => router.replace('/blog/list')}
          >
            다른 블로그 콘텐츠 둘러보기
          </BaseButton>
        </div>

        <div className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-small20 font-semibold">
              이런 콘텐츠는 어떠세요?
            </h2>
            <Link
              className="text-xsmall14 text-neutral-45 font-medium"
              href="/blog/list"
            >
              더보기
            </Link>
          </div>
          <BlogRecommendSection />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 grid grid-cols-1 gap-y-7 md:mb-16 md:grid-cols-4 md:gap-x-5 md:gap-y-[3.375rem]">
        {data.blogInfos.map(({ blogThumbnailInfo }, index) => {
          const blogBanners = blogBannerData.blogBannerList;
          let blogBannerCard = null;

          if (
            blogBanners.length > 0 &&
            ((isMobile && index === 3) || (!isMobile && index === 3))
          ) {
            blogBannerCard = (
              <ContentCard
                key={blogBanners[0].blogBannerId}
                href={blogBanners[0].link ?? ''}
                className="blog_banner cursor-pointer"
                category="AD"
                title={blogBanners[0].title ?? ''}
                containerProps={{
                  'data-url': blogBanners[0].link ?? '',
                  'data-text': blogBanners[0].title ?? '',
                }}
                thumbnail={
                  blogBanners[0].file ? (
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                      src={blogBanners[0].file}
                      alt={blogBanners[0].title ?? ''}
                    />
                  ) : null
                }
              />
            );
          }

          if (blogBanners.length > 1 && !isMobile && index === 7) {
            const link = blogBanners[1].link ?? '';
            const title = blogBanners[1].title ?? '';

            blogBannerCard = (
              <ContentCard
                key={blogBanners[1].blogBannerId}
                href={link}
                className="blog_banner cursor-pointer"
                category="AD"
                title={title}
                containerProps={{
                  'data-url': link,
                  'data-text': title,
                }}
                thumbnail={
                  blogBanners[1].file ? (
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                      src={blogBanners[1].file}
                      alt={title}
                    />
                  ) : null
                }
              />
            );
          }

          const isUpcoming = willBePublished(
            blogThumbnailInfo.displayDate ?? '',
          );

          return (
            <Fragment key={blogThumbnailInfo.id}>
              {blogBannerCard}
              <ContentCard
                className={twMerge(
                  'cursor-pointer',
                  isUpcoming ? 'blog_upcoming' : 'blog_item',
                )}
                target={isUpcoming ? '_blank' : '_self'}
                href={
                  isUpcoming
                    ? 'https://forms.gle/HshjtnqqXWPQJ5DH6'
                    : `/blog/${blogThumbnailInfo.id}`
                }
                containerProps={{
                  'data-url': `/blog/${blogThumbnailInfo.id}`,
                  'data-text': blogThumbnailInfo.title,
                }}
                category={
                  blogThumbnailInfo.category
                    ? blogCategory[blogThumbnailInfo.category]
                    : '전체'
                }
                title={blogThumbnailInfo.title ?? ''}
                thumbnail={
                  <>
                    {blogThumbnailInfo.thumbnail && (
                      <Image
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                        src={blogThumbnailInfo.thumbnail}
                        alt={blogThumbnailInfo.title ?? ''}
                      />
                    )}
                    {isUpcoming && (
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
                date={`${dayjs(blogThumbnailInfo.displayDate).format(
                  YYYY_MM_DD,
                )} ${isUpcoming ? '예정' : '작성'}`}
                actionButton={
                  isUpcoming ? (
                    <BaseButton
                      variant="point"
                      className="rounded-xs text-xxsmall12 relative z-10 flex items-center gap-1 p-2.5 font-medium"
                    >
                      <BellIcon width={16} height={16} />
                      <span>알림신청</span>
                    </BaseButton>
                  ) : null
                }
              />
            </Fragment>
          );
        })}
      </div>

      {data.pageInfo && (
        <MuiPagination
          className="flex justify-center"
          page={page}
          pageInfo={data.pageInfo}
          onChange={(_, page) => {
            if (onChangePage) onChangePage(page);
          }}
        />
      )}
    </section>
  );
}
