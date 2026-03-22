import {
  fetchUserMagnetList,
  userMagnetDetailQueryOptions,
} from '@/api/magnet/magnet';
import { MagnetType } from '@/api/magnet/magnetSchema';
import { ProgramRecommendItem } from '@/api/blog/blogSchema';
import { fetchProgramRecommend } from '@/api/program';
import LikeButton from '@/common/button/LikeButton';
import ContentCard from '@/common/card/ContentCard';
import MoreHeader from '@/common/header/MoreHeader';
import HorizontalRule from '@/common/HorizontalRule';
import BlogKakaoShareBtn from '@/domain/blog/button/BlogKakaoShareBtn';
import BlogLinkShareBtn from '@/domain/blog/button/BlogLilnkShareBtn';
import ProgramRecommendCard from '@/domain/blog/card/ProgramRecommendCard';
import Heading2 from '@/domain/blog/ui/BlogHeading2';
import LibraryArticle from '@/domain/library/ui/LibraryArticle';
import { twMerge } from '@/lib/twMerge';
import { ProgramStatusEnum, ProgramTypeEnum } from '@/schema';
import {
  getBaseUrlFromServer,
  getLibraryPathname,
  getLibraryTitle,
} from '@/utils/url';
import { QueryClient } from '@tanstack/react-query';
import { CircleChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const { CHALLENGE } = ProgramTypeEnum.enum;

const MAGNET_TYPE_LABEL: Record<MagnetType, string> = {
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  MATERIAL: '직무 자료집',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '이벤트',
};

function toUrlSlug(title: string) {
  return encodeURIComponent(title.replace(/\s+/g, '-'));
}

async function getMagnetDetail(magnetId: number) {
  const queryClient = new QueryClient();
  try {
    return await queryClient.fetchQuery(
      userMagnetDetailQueryOptions(magnetId),
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getMagnetDetail(Number(id));

  if (!data) return {};

  const { magnetInfo } = data;

  return {
    title: getLibraryTitle({ title: magnetInfo.title }),
    description: magnetInfo.description,
    openGraph: {
      title: magnetInfo.title,
      description: magnetInfo.description ?? undefined,
      url:
        getBaseUrlFromServer() +
        getLibraryPathname({ id: magnetInfo.magnetId, title: magnetInfo.title }),
      images: magnetInfo.desktopThumbnail
        ? [{ url: magnetInfo.desktopThumbnail }]
        : [],
    },
    alternates: {
      canonical:
        getBaseUrlFromServer() +
        getLibraryPathname({ id: magnetInfo.magnetId, title: magnetInfo.title }),
    },
  };
}

export default async function LibraryDetailPage({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) {
  const { id } = await params;

  const data = await getMagnetDetail(Number(id));
  if (!data) notFound();

  const { magnetInfo } = data;
  const [programRecommendList, recentMagnetList] = await Promise.all([
    getProgramRecommendList(),
    getRecentMagnetList(magnetInfo.magnetId),
  ]);

  async function getProgramRecommendList() {
    const fetchedData = await fetchProgramRecommend();
    const list: ProgramRecommendItem[] = [];
    const ctaTitles: Record<string, string> = {
      CAREER_START: '경험 정리부터 이력서 완성까지',
      PERSONAL_STATEMENT: '합격을 만드는 자소서 작성법',
      PORTFOLIO: '나를 돋보이게 하는 포트폴리오',
      PERSONAL_STATEMENT_LARGE_CORP: '합격을 만드는 자소서 작성법',
    };

    if (fetchedData.challengeList.length > 0) {
      const targets = fetchedData.challengeList.slice(0, 3).map((item) => ({
        id: `${CHALLENGE}-${item.id}`,
        ctaLink: `/program/${CHALLENGE.toLowerCase()}/${item.id}`,
        ctaTitle: ctaTitles[item.challengeType ?? 'CAREER_START'],
      }));
      list.push(...targets);
    }

    return list;
  }

  async function getRecentMagnetList(currentMagnetId: number) {
    try {
      const data = await fetchUserMagnetList({ page: 1, size: 5 });
      return data.magnetList
        .filter((m) => m.magnetId !== currentMagnetId)
        .slice(0, 4);
    } catch {
      return [];
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] pb-12 pt-6 md:pb-[7.5rem] md:pt-[60px]">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-20">
        {/* 본문 */}
        <section className="w-full px-5 md:px-0">
          <LibraryArticle magnetInfo={magnetInfo} />

          <section className="mb-9 mt-10 flex items-center justify-between md:mb-6">
            {/* 좋아요 */}
            <LikeButton id={id} likeCount={0} storageKey="library_like" />
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
                title={magnetInfo.title}
                description={magnetInfo.description ?? ''}
                thumbnail={magnetInfo.desktopThumbnail ?? ''}
                pathname={getLibraryPathname({
                  id: magnetInfo.magnetId,
                  title: magnetInfo.title,
                })}
              />
              <span className="text-xsmall14 font-medium text-neutral-35 md:hidden">
                공유하기
              </span>
            </div>
          </section>

          <HorizontalRule className="-mx-5 h-3 md:hidden" />
          <Link
            href="/library/list"
            className="flex w-full items-center justify-center gap-2 py-5 md:rounded-xs md:bg-neutral-95"
          >
            <p className="text-xsmall16 font-semibold text-neutral-0 md:font-medium">
              <span className="font-semibold text-primary">자료집 홈</span>{' '}
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
        {programRecommendList.length > 0 && (
          <aside className="w-full px-5 py-9 md:sticky md:top-[100px] md:max-w-[20.5rem] md:rounded-md md:border md:border-neutral-80 md:px-6 md:py-5">
            <Heading2 className="text-neutral-0 md:text-xsmall16">
              렛츠커리어 프로그램 참여하고
              <br />
              취뽀 성공해요!
            </Heading2>
            <section className="mb-6 mt-5 flex flex-col gap-6">
              {programRecommendList.map((item) => (
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

      {/* 다른 자료집 추천 */}
      <section className="px-5 py-9 md:mt-[6.25rem] md:p-0">
        <MoreHeader
          href="/library/list"
          gaText="다른 취준생들이 함께 찾은 콘텐츠"
          hideMoreWhenMobile
        >
          다른 취준생들이 함께 찾은 콘텐츠
        </MoreHeader>
        <div className="mb-6 mt-5 flex flex-col gap-5 md:mt-6 md:grid md:grid-cols-4 md:items-start md:gap-5">
          {recentMagnetList.map((magnet) => (
            <ContentCard
              key={magnet.magnetId}
              variant="library-card"
              className="min-w-0"
              href={`/library/${magnet.magnetId}/${toUrlSlug(magnet.title)}`}
              thumbnail={
                magnet.desktopThumbnail ? (
                  <Image
                    src={magnet.desktopThumbnail}
                    alt={magnet.title}
                    fill
                    className="object-cover"
                  />
                ) : undefined
              }
              category={MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type}
              title={magnet.title}
            />
          ))}
        </div>
        <MoreLink href="/library/list" className="md:hidden">
          더 많은 자료집 보기
        </MoreLink>
      </section>
    </main>
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
