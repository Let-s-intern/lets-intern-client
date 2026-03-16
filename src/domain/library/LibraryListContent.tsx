'use client';

import {
  useGetMyMagnetListQuery,
  useGetUserMagnetListQuery,
} from '@/api/magnet/magnet';
import { MagnetType, UserMagnetListItem } from '@/api/magnet/magnetSchema';
import ContentCard from '@/common/card/ContentCard';
import FilterDropdown from '@/common/dropdown/FilterDropdown';
import LoadingContainer from '@/common/loading/LoadingContainer';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import LibraryTabNav from './ui/LibraryTabNav';

const TABS = [
  { label: '자료집 콘텐츠', value: 'contents' },
  { label: 'MY 자료집', value: 'my' },
];

const MAGNET_TYPE_LABEL: Record<MagnetType, string> = {
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  MATERIAL: '직무 자료집',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '이벤트',
};

const CATEGORY_FILTER_LIST = Object.entries(MAGNET_TYPE_LABEL).map(
  ([value, caption]) => ({ caption, value }),
);

const PC_PAGE_SIZE = 16;
const MOBILE_PAGE_SIZE = 8;

function toUrlSlug(title: string) {
  return encodeURIComponent(title.replace(/\s+/g, '-'));
}

function Content() {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const [activeTab, setActiveTab] = useState('contents');
  const [page, setPage] = useState(1);

  const pageSize = isMobile ? MOBILE_PAGE_SIZE : PC_PAGE_SIZE;

  const typeList = useMemo(() => {
    const category = searchParams.get('category');
    if (!category) return undefined;
    return category.toUpperCase().split(',') as MagnetType[];
  }, [searchParams]);

  const isMyTab = activeTab === 'my';

  const contentsQuery = useGetUserMagnetListQuery({
    typeList,
    pageable: { page: page - 1, size: pageSize },
    enabled: !isMyTab,
  });

  const myQuery = useGetMyMagnetListQuery({
    typeList,
    pageable: { page: page - 1, size: pageSize },
    enabled: isMyTab,
  });

  const { data, isLoading } = isMyTab ? myQuery : contentsQuery;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* 탭 + 필터 */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <LibraryTabNav
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
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
        <div className="flex min-h-[200px] items-center justify-center text-neutral-40">
          <LoadingContainer />
        </div>
      ) : data && data.magnetList.length > 0 ? (
        <LibraryGrid magnetList={data.magnetList} />
      ) : (
        <div className="flex min-h-[200px] items-center justify-center text-neutral-40">
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
  return (
    <div className="grid grid-cols-1 gap-y-7 md:grid-cols-4 md:gap-x-5">
      {magnetList.map((magnet) => (
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
  );
}

export default function LibraryListContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
