import { lazy, Suspense, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useUserAdminQuery } from '@/api/user/user';
import { useAdminFeedbackListQuery } from '@/api/feedback/feedback';
import axios from '@/utils/axios';
import ReservationFilters from './ui/ReservationFilters';
import ReservationListView from './ui/ReservationListView';
import ViewToggle, { type ReservationView } from './ui/ViewToggle';

// 캘린더 뷰·상세 모달은 초기 진입(리스트)에 불필요하므로 지연 로드한다.
const ReservationCalendarView = lazy(
  () => import('./ui/ReservationCalendarView'),
);
const ReservationDetailModal = lazy(
  () => import('./ui/ReservationDetailModal'),
);

/** 목록 카테고리 — 드롭다운으로 예약 목록(예정)/예약 변경 내역을 전환한다. */
type ReservationCategory = 'reserved' | 'changed';

const CATEGORY_OPTIONS: { value: ReservationCategory; label: string }[] = [
  { value: 'reserved', label: '예약 목록' },
  { value: 'changed', label: '예약 변경 내역' },
];

const CATEGORY_EMPTY: Record<ReservationCategory, string> = {
  reserved: '예정된 예약이 없습니다.',
  changed: '예약 변경 내역이 없습니다.',
};
import {
  INITIAL_FILTER,
  buildListParams,
  type ReservationFilterState,
} from './utils/buildListParams';
import {
  filterByMenteeName,
  sortReservations,
  type SortKey,
  type SortState,
} from './utils/sortReservations';

const DROPDOWN_PAGE_SIZE = 1000;

/** 프로그램명(챌린지) 드롭다운 소스. OngoingChallenges 와 동일하게 /program/admin?type=CHALLENGE 사용. */
const challengeDropdownSchema = z.object({
  programList: z.array(
    z.object({
      programInfo: z.object({
        id: z.number(),
        title: z.string().nullable().optional(),
      }),
    }),
  ),
});

const useChallengeDropdownQuery = () =>
  useQuery({
    queryKey: ['reservationChallengeDropdown'],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { type: 'CHALLENGE', page: 1, size: DROPDOWN_PAGE_SIZE },
      });
      return challengeDropdownSchema.parse(res.data.data);
    },
  });

export default function ReservationManagement() {
  const [filter, setFilter] = useState<ReservationFilterState>(INITIAL_FILTER);
  const [view, setView] = useState<ReservationView>('list');
  const [sort, setSort] = useState<SortState>({
    key: 'dateTime',
    direction: 'asc',
  });
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(
    null,
  );
  // 드롭다운: 예약 목록(RESERVED) / 예약 변경 내역(COMPLETED·CANCELED) 전환.
  const [category, setCategory] = useState<ReservationCategory>('reserved');

  // 필터 드롭다운 옵션 소스. 예약 목록과 독립적이라 병렬로 패칭된다.
  const { data: challengeData } = useChallengeDropdownQuery();
  const { data: mentorData } = useUserAdminQuery({
    isMentor: true,
    pageable: { page: 1, size: DROPDOWN_PAGE_SIZE },
  });

  const listParams = useMemo(() => buildListParams(filter), [filter]);
  const { data: reservations, isLoading } =
    useAdminFeedbackListQuery(listParams);

  const challengeOptions = useMemo(
    () =>
      (challengeData?.programList ?? []).map(({ programInfo }) => ({
        value: String(programInfo.id),
        label: programInfo.title ?? `(제목 없음 #${programInfo.id})`,
      })),
    [challengeData],
  );

  const mentorOptions = useMemo(
    () =>
      (mentorData?.userAdminList ?? []).map((u) => ({
        value: String(u.userInfo.id),
        label: u.userInfo.name,
      })),
    [mentorData],
  );

  const visibleReservations = useMemo(() => {
    const byName = filterByMenteeName(reservations ?? [], filter.menteeName);
    const byCategory = byName.filter((r) =>
      category === 'reserved'
        ? r.status === 'RESERVED'
        : r.status !== 'RESERVED',
    );
    return sortReservations(byCategory, sort);
  }, [reservations, filter.menteeName, category, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ReservationFilters
        filter={filter}
        onChange={setFilter}
        challengeOptions={challengeOptions}
        mentorOptions={mentorOptions}
      />

      <div className="flex items-center justify-between">
        <select
          aria-label="예약 목록 구분"
          value={category}
          onChange={(e) => setCategory(e.target.value as ReservationCategory)}
          className="border-neutral-80 text-xsmall14 text-neutral-0 rounded-md border bg-white px-3 py-2"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'list' ? (
        <ReservationListView
          reservations={visibleReservations}
          sort={sort}
          onToggleSort={toggleSort}
          onView={setSelectedFeedbackId}
          isLoading={isLoading}
          emptyMessage={CATEGORY_EMPTY[category]}
        />
      ) : (
        <Suspense fallback={null}>
          <ReservationCalendarView reservations={visibleReservations} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ReservationDetailModal
          feedbackId={selectedFeedbackId}
          onClose={() => setSelectedFeedbackId(null)}
        />
      </Suspense>
    </div>
  );
}
