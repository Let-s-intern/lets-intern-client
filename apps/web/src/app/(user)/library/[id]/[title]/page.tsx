import { ProgramRecommendItem } from '@/api/blog/blogSchema';
import {
  fetchUserMagnetList,
  userMagnetDetailQueryOptions,
} from '@/api/magnet/magnet';
import { MagnetType } from '@/api/magnet/magnetSchema';
import { fetchProgramRecommend, getChallenge } from '@/api/program';
import MoreHeader from '@/common/header/MoreHeader';
import HorizontalRule from '@/common/HorizontalRule';
import BlogKakaoShareBtn from '@/domain/blog/ui/BlogKakaoShareBtn';
import BlogLinkShareBtn from '@/domain/blog/ui/BlogLilnkShareBtn';
import ProgramRecommendCard from '@/domain/blog/ui/ProgramRecommendCard';
import Heading2 from '@/domain/blog/ui/BlogHeading2';
import LibraryArticle from '@/domain/library/ui/LibraryArticle';
import LibraryLikeBtn from '@/domain/library/ui/LibraryLikeBtn';
import LibraryRecommendCard from '@/domain/library/ui/LibraryRecommendCard';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ProgramStatusEnum, ProgramTypeEnum } from '@/schema';
import {
  getCanonicalSiteUrl,
  getLibraryPathname,
  getLibraryTitle,
} from '@/utils/url';
import { QueryClient } from '@tanstack/react-query';
import { CircleChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const { CHALLENGE } = ProgramTypeEnum.enum;

const MAGNET_TYPE_LABEL: Record<MagnetType, string> = {
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  MATERIAL: '직무 자료집',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '기타',
};

function toUrlSlug(title: string) {
  return encodeURIComponent(title.replace(/\s+/g, '-'));
}

interface MagnetDescription {
  metaDescription?: string;
  programRecommend?: {
    id: string | null;
    ctaTitle?: string;
    ctaLink?: string;
  }[];
  magnetRecommend?: (number | null)[];
}

/** "CHALLENGE-339" → 339 */
const extractNumericId = (id: string): number | null => {
  const match = id.match(/\d+$/);
  return match ? Number(match[0]) : null;
};

function parseMagnetDescription(description: string | null): MagnetDescription {
  if (!description) return {};
  try {
    return JSON.parse(description);
  } catch {
    return {};
  }
}

async function getMagnetDetail(magnetId: number) {
  const queryClient = new QueryClient();
  try {
    return await queryClient.fetchQuery(userMagnetDetailQueryOptions(magnetId));
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
  const parsed = parseMagnetDescription(magnetInfo.description);
  const metaDescription =
    parsed.metaDescription || `${magnetInfo.title} | 렛츠커리어 무료 자료집`;

  return {
    title: getLibraryTitle({ title: magnetInfo.title }),
    description: metaDescription,
    openGraph: {
      title: magnetInfo.title,
      description: metaDescription ?? undefined,
      url:
        getCanonicalSiteUrl() +
        getLibraryPathname({
          id: magnetInfo.magnetId,
          title: magnetInfo.title,
        }),
      images: magnetInfo.desktopThumbnail
        ? [{ url: magnetInfo.desktopThumbnail }]
        : [],
    },
    alternates: {
      canonical:
        getCanonicalSiteUrl() +
        getLibraryPathname({
          id: magnetInfo.magnetId,
          title: magnetInfo.title,
        }),
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
  const parsed = parseMagnetDescription(magnetInfo.description);

  const programRecommendItems = (parsed.programRecommend ?? []).filter(
    (p) => p.id !== null,
  );

  const magnetRecommendIds = (parsed.magnetRecommend ?? []).filter(
    (id): id is number => id !== null,
  );

  const [programRecommendList, recommendedMagnetList] = await Promise.all([
    getProgramRecommendList(),
    getRecommendedMagnetList(magnetInfo.magnetId, magnetRecommendIds),
  ]);

  async function getProgramRecommendList() {
    const ctaTitles: Record<string, string> = {
      CAREER_START: '경험 정리부터 이력서 완성까지',
      PERSONAL_STATEMENT: '합격을 만드는 자소서 작성법',
      PORTFOLIO: '나를 돋보이게 하는 포트폴리오',
      PERSONAL_STATEMENT_LARGE_CORP: '합격을 만드는 자소서 작성법',
    };

    // description에 등록된 프로그램이 있으면 해당 프로그램 조회
    if (programRecommendItems.length > 0) {
      try {
        const results = await Promise.all(
          programRecommendItems.map(async (item) => {
            const numericId = extractNumericId(item.id!);
            if (numericId === null) return null;
            try {
              const data = await getChallenge(numericId);
              return { id: numericId, data, item };
            } catch {
              return null;
            }
          }),
        );
        const validResults = results
          .filter((r): r is NonNullable<typeof r> => r !== null)
          .map((r) => ({
            id: `${CHALLENGE}-${r.id}`,
            ctaLink:
              r.item.ctaLink ?? `/program/${CHALLENGE.toLowerCase()}/${r.id}`,
            ctaTitle:
              r.item.ctaTitle ??
              ctaTitles[r.data.challengeType ?? 'CAREER_START'],
          }));
        if (validResults.length > 0) return validResults;
        // 전부 실패하면 fallback으로 진행
      } catch {
        // fallback으로 진행
      }
    }

    // 기본값: 이력서, 자기소개서, 포트폴리오 챌린지 3종
    try {
      const fetchedData = await fetchProgramRecommend();
      const list: ProgramRecommendItem[] = [];
      if (fetchedData.challengeList.length > 0) {
        const targets = fetchedData.challengeList.slice(0, 3).map((item) => ({
          id: `${CHALLENGE}-${item.id}`,
          ctaLink: `/program/${CHALLENGE.toLowerCase()}/${item.id}`,
          ctaTitle: ctaTitles[item.challengeType ?? 'CAREER_START'],
        }));
        list.push(...targets);
      }
      return list;
    } catch (error) {
      console.error('프로그램 추천 기본값 조회 실패:', error);
      return [];
    }
  }

  async function getRecommendedMagnetList(
    currentMagnetId: number,
    magnetIds: number[],
  ) {
    // description에 등록된 마그넷이 있으면 해당 마그넷 상세 조회
    if (magnetIds.length > 0) {
      try {
        const queryClient = new QueryClient();
        const magnets = await Promise.all(
          magnetIds.map((id) =>
            queryClient
              .fetchQuery(userMagnetDetailQueryOptions(id))
              .catch(() => null),
          ),
        );
        const validMagnets = magnets
          .filter((m): m is NonNullable<typeof m> => m !== null)
          .map((m) => m.magnetInfo);
        if (validMagnets.length > 0) return validMagnets;
        // 전부 실패하면 fallback으로 진행
      } catch {
        // fallback으로 진행
      }
    }

    // 기본값: 현재 게시글 제외 최신 마그넷(자료집/VOD/무료 템플릿) 4개
    try {
      const MANAGEABLE_TYPES: MagnetType[] = [
        'MATERIAL',
        'VOD',
        'FREE_TEMPLATE',
      ];
      const data = await fetchUserMagnetList({
        page: 1,
        size: 5,
        typeList: MANAGEABLE_TYPES,
      });
      return data.magnetList
        .filter((m) => m.magnetId !== currentMagnetId)
        .slice(0, 4);
    } catch (error) {
      console.error('마그넷 기본 목록 조회 실패:', error);
      return [];
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] pb-12 pt-6 md:pb-[7.5rem] md:pt-[60px]">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-20">
        {/* 본문 */}
        <section className="w-full px-5 md:px-0">
          <LibraryArticle magnetInfo={magnetInfo} />

          <section className="mb-9 mt-20 flex items-center justify-between md:mb-6">
            {/* 좋아요 */}
            <LibraryLikeBtn likeCount={magnetInfo.likes ?? 0} />
            {/* 공유하기 */}
            <div className="flex items-center">
              <span className="text-xsmall14 text-neutral-35 mr-1.5 hidden font-medium md:block">
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
                description={
                  parsed.metaDescription ?? magnetInfo.description ?? ''
                }
                thumbnail={magnetInfo.desktopThumbnail ?? ''}
                pathname={getLibraryPathname({
                  id: magnetInfo.magnetId,
                  title: magnetInfo.title,
                })}
              />
              <span className="text-xsmall14 text-neutral-35 font-medium md:hidden">
                공유하기
              </span>
            </div>
          </section>

          <HorizontalRule className="-mx-5 h-3 md:hidden" />
          <Link
            href="/library/list"
            className="md:rounded-xs md:bg-neutral-95 flex w-full items-center justify-center gap-2 py-5"
          >
            <p className="text-xsmall16 text-neutral-0 font-semibold md:font-medium">
              <span className="text-primary font-semibold">자료집 홈</span>{' '}
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
          <aside className="md:border-neutral-80 w-full px-5 py-9 md:sticky md:top-[100px] md:max-w-[20.5rem] md:rounded-md md:border md:px-6 md:py-5">
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
          {recommendedMagnetList.map((magnet) => {
            const isUpcoming =
              !!magnet.startDate && dayjs().isBefore(dayjs(magnet.startDate));
            return (
              <LibraryRecommendCard
                key={magnet.magnetId}
                href={`/library/${magnet.magnetId}/${toUrlSlug(magnet.title)}`}
                thumbnail={magnet.desktopThumbnail}
                category={MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type}
                title={magnet.title}
                isUpcoming={isUpcoming}
              />
            );
          })}
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
        'rounded-xs border-neutral-80 text-neutral-20 block w-full border px-5 py-3 text-center font-medium',
        className,
      )}
    >
      {children}
    </Link>
  );
}
