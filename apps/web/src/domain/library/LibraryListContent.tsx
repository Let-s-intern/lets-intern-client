'use client';

import {
  myMagnetListQueryOptions,
  userMagnetListQueryOptions,
} from '@/api/magnet/magnet';
import { MagnetType, UserMagnetListItem } from '@/api/magnet/magnetSchema';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import ContentCard from '@/common/card/ContentCard';
import FilterDropdown from '@/common/dropdown/FilterDropdown';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import MuiPagination from '@/common/pagination/MuiPagination';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bell, LockKeyhole, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import LibraryTabNav from './ui/LibraryTabNav';
import LibraryMyVisitNotice from './ui/LibraryMyVisitNotice';

export type LibraryTab = 'contents' | 'my';

const TABS = [
  { label: '자료집 콘텐츠', href: '/library/list' },
  { label: 'MY 자료집', href: '/library/list/my' },
];

const MAGNET_TYPE_LABEL: Record<MagnetType, string> = {
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  MATERIAL: '직무 자료집',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '이벤트',
};

// 탭별 숨김 정책.
// - /library/list (자료집 콘텐츠 탭): LAUNCH_ALERT 는 어드민 isVisible 토글과 무관하게 항상 차단
//   (임호정 PM 5/14 요청: "노출여부와 상관없이 리스트에서 가려주세요").
//   EVENT 는 어드민 isVisible 토글로 제어 가능하도록 노출 허용.
// - /library/list/my (MY 자료집 탭): PRD FR-3 정책에 따라 EVENT/LAUNCH_ALERT 모두 차단.
const HIDDEN_TYPES_BY_TAB: Record<LibraryTab, MagnetType[]> = {
  contents: ['LAUNCH_ALERT'],
  my: ['LAUNCH_ALERT', 'EVENT'],
};

const PC_PAGE_SIZE = 16;
const MOBILE_PAGE_SIZE = 8;

function toUrlSlug(title: string) {
  return encodeURIComponent(title.replace(/\s+/g, '-'));
}

function Content({ tab }: { tab: LibraryTab }) {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const [page, setPage] = useState(1);

  const pageSize = isMobile ? MOBILE_PAGE_SIZE : PC_PAGE_SIZE;
  const hiddenTypes = HIDDEN_TYPES_BY_TAB[tab];

  const categoryFilterList = useMemo(
    () =>
      Object.entries(MAGNET_TYPE_LABEL)
        .filter(([value]) => !hiddenTypes.includes(value as MagnetType))
        .map(([value, caption]) => ({ caption, value })),
    [hiddenTypes],
  );

  const typeList = useMemo(() => {
    const category = searchParams.get('category');
    if (!category) {
      return Object.keys(MAGNET_TYPE_LABEL).filter(
        (type) => !hiddenTypes.includes(type as MagnetType),
      ) as MagnetType[];
    }
    return category
      .toUpperCase()
      .split(',')
      .filter(
        (type) => !hiddenTypes.includes(type as MagnetType),
      ) as MagnetType[];
  }, [searchParams, hiddenTypes]);

  const isMyTab = tab === 'my';
  const { isLoggedIn, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isMyTab || !isInitialized || isLoggedIn) return;
    const qs = searchParams.toString();
    const here = qs ? `${pathname}?${qs}` : pathname;
    const params = new URLSearchParams({ redirect: here });
    router.push(`/login?${params.toString()}`);
  }, [isMyTab, isInitialized, isLoggedIn, pathname, router, searchParams]);

  // MY 탭은 로그인 상태에서만 조회 가능. 그 외 상황(미초기화/비로그인)에서는
  // 위 redirect 이펙트가 로그인 페이지로 보내므로 그리드를 렌더하지 않는다.
  const canFetch = isMyTab ? isLoggedIn : true;

  const qs = searchParams.toString();
  const browseContentsHref = qs ? `/library/list?${qs}` : '/library/list';

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {isMyTab && <LibraryMyVisitNotice />}
      {/* 탭 + 필터 */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <LibraryTabNav tabs={TABS} />
        <FilterDropdown
          label="콘텐츠 카테고리"
          list={categoryFilterList}
          paramKey="category"
          multiSelect
          onChange={() => setPage(1)}
          dropdownClassName="max-w-fit right-0"
        />
      </div>

      {canFetch && (
        <AsyncBoundary
          pendingFallback={
            <div className="text-neutral-40 flex min-h-[200px] items-center justify-center">
              <LoadingContainer />
            </div>
          }
        >
          <MagnetListSection
            isMyTab={isMyTab}
            typeList={typeList}
            page={page}
            pageSize={pageSize}
            browseContentsHref={browseContentsHref}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </AsyncBoundary>
      )}
    </div>
  );
}

function MagnetListSection({
  isMyTab,
  typeList,
  page,
  pageSize,
  browseContentsHref,
  onPageChange,
}: {
  isMyTab: boolean;
  typeList: MagnetType[];
  page: number;
  pageSize: number;
  browseContentsHref: string;
  onPageChange: (page: number) => void;
}) {
  const { data } = useSuspenseQuery(
    isMyTab
      ? myMagnetListQueryOptions({
          typeList,
          pageable: { page, size: pageSize },
        })
      : userMagnetListQueryOptions({
          typeList,
          pageable: { page, size: pageSize },
        }),
  );

  return (
    <>
      {/* 카드 그리드 */}
      {data.magnetList.length > 0 ? (
        <LibraryGrid magnetList={data.magnetList} />
      ) : isMyTab ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <img
            src="/icons/no-library.svg"
            alt="신청한 자료집 없음"
            className="h-40 w-40"
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-small16 text-neutral-30 md:text-small20 font-semibold">
              아직 신청한 자료집이 없어요
            </p>
            <p className="text-xsmall16 text-neutral-40 text-center">
              이력서, 자소서, 직무 정보 등
              <br className="md:hidden" />
              다양한 무료 자료집을 확인하고
              <br />
              필요한 자료를 받아보세요.
            </p>
          </div>
          <Link
            href={browseContentsHref}
            className="rounded-xxs border-primary text-xsmall14 text-primary hover:bg-primary/5 mt-6 flex items-center gap-1.5 border px-4 py-2.5 font-medium transition-colors"
          >
            <Search size={16} />
            무료 자료집 둘러보기
          </Link>
        </div>
      ) : (
        <div className="text-neutral-40 flex min-h-[200px] items-center justify-center">
          등록된 콘텐츠가 없습니다.
        </div>
      )}

      {/* 페이지네이션 */}
      {data.pageInfo.totalPages > 1 && (
        <MuiPagination
          className="flex justify-center"
          page={page}
          pageInfo={data.pageInfo}
          onChange={(_, newPage) => onPageChange(newPage)}
        />
      )}
    </>
  );
}

function LibraryGrid({ magnetList }: { magnetList: UserMagnetListItem[] }) {
  const now = dayjs();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-y-14 md:grid-cols-4 md:gap-x-5">
      {magnetList.map((magnet) => {
        const isUpcoming =
          !!magnet.startDate && now.isBefore(dayjs(magnet.startDate));
        const slug = toUrlSlug(magnet.title);

        return (
          <ContentCard
            key={magnet.magnetId}
            variant="library-card"
            className="min-w-0"
            href={`/library/${magnet.magnetId}/${slug}`}
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
                      <span className="text-xxsmall12 text-neutral-30 font-medium">
                        공개예정
                      </span>
                    </div>
                  </>
                )}
              </>
            }
            category={MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type}
            title={magnet.title}
            date={
              isUpcoming && magnet.startDate
                ? `${dayjs(magnet.startDate).format(YYYY_MM_DD)} 공개 예정`
                : undefined
            }
            actionButton={
              isUpcoming ? (
                magnet.appliedLaunchAlert ? (
                  <div className="rounded-xs bg-neutral-70 text-xxsmall12 relative z-10 flex items-center gap-1 p-2.5 text-white">
                    <Bell size={15} />
                    알림 설정 완료
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoggedIn) {
                        const redirectUrl = `${window.location.pathname}${window.location.search}`;
                        router.push(
                          `/login?redirect=${encodeURIComponent(redirectUrl)}`,
                        );
                        return;
                      }
                      router.push(
                        `/library/${magnet.magnetId}/apply?type=launch-alert`,
                      );
                    }}
                    className="rounded-xs bg-point text-xxsmall12 text-neutral-0 relative z-10 flex items-center gap-1 p-2.5"
                  >
                    <Bell size={15} />
                    알림 설정
                  </button>
                )
              ) : undefined
            }
          />
        );
      })}
    </div>
  );
}

export default function LibraryListContent({ tab }: { tab: LibraryTab }) {
  return (
    <Suspense>
      <Content tab={tab} />
    </Suspense>
  );
}
