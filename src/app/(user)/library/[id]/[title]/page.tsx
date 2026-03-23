import {
  fetchUserMagnetList,
  userMagnetDetailQueryOptions,
} from '@/api/magnet/magnet';
import { MagnetType } from '@/api/magnet/magnetSchema';
import { ProgramRecommendItem } from '@/api/blog/blogSchema';
import { fetchProgramRecommend, getChallenge } from '@/api/program';
import LibraryLikeBtn from '@/domain/library/ui/LibraryLikeBtn';
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
import dayjs from '@/lib/dayjs';
import { CircleChevronRight, LockKeyhole } from 'lucide-react';
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

interface MagnetDescription {
  metaDescription?: string;
  programRecommend?: { id: number | null }[];
  magnetRecommend?: (number | null)[];
}

function parseMagnetDescription(
  description: string | null,
): MagnetDescription {
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
  const parsed = parseMagnetDescription(magnetInfo.description);
  const metaDescription = parsed.metaDescription ?? magnetInfo.description;

  return {
    title: getLibraryTitle({ title: magnetInfo.title }),
    description: metaDescription,
    openGraph: {
      title: magnetInfo.title,
      description: metaDescription ?? undefined,
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
  const parsed = parseMagnetDescription(magnetInfo.description);

  const programRecommendIds = (parsed.programRecommend ?? [])
    .map((p) => p.id)
    .filter((id): id is number => id !== null);

  const magnetRecommendIds = (parsed.magnetRecommend ?? []).filter(
    (id): id is number => id !== null,
  );

  const [programRecommendList, recommendedMagnetList] = await Promise.all([
    getProgramRecommendList(programRecommendIds),
    getRecommendedMagnetList(magnetInfo.magnetId, magnetRecommendIds),
  ]);

  async function getProgramRecommendList(challengeIds: number[]) {
    const ctaTitles: Record<string, string> = {
      CAREER_START: '경험 정리부터 이력서 완성까지',
      PERSONAL_STATEMENT: '합격을 만드는 자소서 작성법',
      PORTFOLIO: '나를 돋보이게 하는 포트폴리오',
      PERSONAL_STATEMENT_LARGE_CORP: '합격을 만드는 자소서 작성법',
    };

    // description에 등록된 프로그램이 있으면 해당 프로그램 조회
    if (challengeIds.length > 0) {
      try {
        const results = await Promise.all(
          challengeIds.map((cId) =>
            getChallenge(cId)
              .then((data) => ({ id: cId, data }))
              .catch((error) => {
                console.error('챌린지 조회 실패:', error);
                return null;
              }),
          ),
        );
        return results
          .filter((r): r is NonNullable<typeof r> => r !== null)
          .map((r) => ({
            id: `${CHALLENGE}-${r.id}`,
            ctaLink: `/program/${CHALLENGE.toLowerCase()}/${r.id}`,
            ctaTitle: ctaTitles[r.data.challengeType ?? 'CAREER_START'],
          }));
      } catch (error) {
        console.error('프로그램 추천 목록 조회 실패:', error);
      }
    }

    // 기본값: 이력서, 자기소개서, 포트폴리오 챌린지 3종
    try {
      const fetchedData = await fetchProgramRecommend();
      const list: ProgramRecommendItem[] = [];
      if (fetchedData.challengeList.length > 0) {
        const targets = fetchedData.challengeList
          .slice(0, 3)
          .map((item) => ({
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
              .catch((error) => {
                console.error('마그넷 상세 조회 실패:', error);
                return null;
              }),
          ),
        );
        return magnets
          .filter(
            (m): m is NonNullable<typeof m> => m !== null,
          )
          .map((m) => m.magnetInfo);
      } catch (error) {
        console.error('마그넷 추천 목록 조회 실패:', error);
      }
    }

    // 기본값: 현재 게시글 제외 최신 4개
    try {
      const data = await fetchUserMagnetList({ page: 1, size: 5 });
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

          <section className="mb-9 mt-10 flex items-center justify-between md:mb-6">
            {/* 좋아요 */}
            <LibraryLikeBtn likeCount={magnetInfo.likes ?? 0} />
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
                description={parsed.metaDescription ?? magnetInfo.description ?? ''}
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
          {recommendedMagnetList.map((magnet) => {
            const isUpcoming =
              !!magnet.startDate &&
              dayjs().isBefore(dayjs(magnet.startDate));
            return (
              <ContentCard
                key={magnet.magnetId}
                variant="library-card"
                className="min-w-0"
                href={`/library/${magnet.magnetId}/${toUrlSlug(magnet.title)}`}
                thumbnail={
                  <>
                    {magnet.desktopThumbnail ? (
                      <Image
                        src={magnet.desktopThumbnail}
                        alt={magnet.title}
                        fill
                        className="object-cover"
                      />
                    ) : undefined}
                    {isUpcoming && (
                      <>
                        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
                        <div className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 self-center rounded-full bg-white/60 px-2 py-1">
                          <LockKeyhole size={12} color="#4C4F56" />
                          <span className="text-xxsmall12 font-medium text-neutral-30">
                            공개예정
                          </span>
                        </div>
                      </>
                    )}
                  </>
                }
                category={MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type}
                title={magnet.title}
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
        'block w-full rounded-xs border border-neutral-80 px-5 py-3 text-center font-medium text-neutral-20',
        className,
      )}
    >
      {children}
    </Link>
  );
}
