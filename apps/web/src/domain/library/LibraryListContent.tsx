'use client';

import {
  useGetMyMagnetListQuery,
  useGetUserMagnetListQuery,
} from '@/api/magnet/magnet';
import { MagnetType, UserMagnetListItem } from '@/api/magnet/magnetSchema';
import ContentCard from '@/common/card/ContentCard';
import FilterDropdown from '@/common/dropdown/FilterDropdown';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { Bell, LockKeyhole, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import LibraryTabNav from './ui/LibraryTabNav';

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
  EVENT: '기타',
};

const HIDDEN_TYPES_IN_LIST: MagnetType[] = ['LAUNCH_ALERT'];

const CATEGORY_FILTER_LIST = Object.entries(MAGNET_TYPE_LABEL)
  .filter(([value]) => !HIDDEN_TYPES_IN_LIST.includes(value as MagnetType))
  .map(([value, caption]) => ({ caption, value }));

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

  const typeList = useMemo(() => {
    const category = searchParams.get('category');
    if (!category) {
      return Object.keys(MAGNET_TYPE_LABEL).filter(
        (type) => !HIDDEN_TYPES_IN_LIST.includes(type as MagnetType),
      ) as MagnetType[];
    }
    return category
      .toUpperCase()
      .split(',')
      .filter(
        (type) => !HIDDEN_TYPES_IN_LIST.includes(type as MagnetType),
      ) as MagnetType[];
  }, [searchParams]);

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

  const contentsQuery = useGetUserMagnetListQuery({
    typeList,
    pageable: { page, size: pageSize },
    enabled: !isMyTab,
  });

  const myQuery = useGetMyMagnetListQuery({
    typeList,
    pageable: { page, size: pageSize },
    enabled: isMyTab && isLoggedIn,
  });

  const { data, isLoading } = isMyTab ? myQuery : contentsQuery;

  const qs = searchParams.toString();
  const browseContentsHref = qs ? `/library/list?${qs}` : '/library/list';

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* 탭 + 필터 */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <LibraryTabNav tabs={TABS} />
        <FilterDropdown
          label="콘텐츠 카테고리"
          list={CATEGORY_FILTER_LIST}
          paramKey="category"
          multiSelect
          onChange={() => setPage(1)}
          dropdownClassName="max-w-fit right-0"
        />
      </div>

      {/* 카드 그리드 */}
      {isLoading ? (
        <div className="text-neutral-40 flex min-h-[200px] items-center justify-center">
          <LoadingContainer />
        </div>
      ) : data && data.magnetList.length > 0 ? (
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
      {data && data.pageInfo.totalPages > 1 && (
        <MuiPagination
          className="flex justify-center"
          page={page}
          pageInfo={data.pageInfo}
          onChange={(_, newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
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
