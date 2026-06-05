import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useUserAdminQuery } from '@/api/user/user';
import { useAdminFeedbackListQuery } from '@/api/feedback/feedback';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
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
// 예약 변경 모달도 초기 진입에 불필요하므로 지연 로드한다.
const ReservationChangeModal = lazy(
  () => import('./modal/ReservationChangeModal'),
);
import {
  INITIAL_FILTER,
  buildListParams,
  type ReservationFilterState,
} from './utils/buildListParams';
import { buildMentorNameIndex, resolveMentorId } from './utils/resolveMentorId';
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
  // 예약 변경 모달 대상. 한 번에 하나만 연다(상세 모달과 독립).
  const [changingReservation, setChangingReservation] =
    useState<FeedbackAdminVo | null>(null);

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

  // 멘토 = isMentor === true 인 일반 유저.
  // BE 가 `?isMentor=true` 쿼리 파라미터를 무시하고 전체 유저를 반환하므로
  // (be-request-admin-feedback-mentorid.md 참고) 클라이언트에서 한 번 더 거른다.
  // 안 거르면 일반 유저 이름까지 인덱스에 들어가 멘토가 동명이인으로 오판된다.
  const mentors = useMemo(
    () =>
      (mentorData?.userAdminList ?? [])
        .filter((u) => u.userInfo.isMentor === true)
        .map((u) => ({ id: u.userInfo.id, name: u.userInfo.name })),
    [mentorData],
  );

  const mentorOptions = useMemo(
    () =>
      mentors.map(({ id, name }) => ({
        value: String(id),
        label: name,
      })),
    [mentors],
  );

  // 멘토 이름 → id 인덱스. BE 목록 응답에 mentorId 가 없을 때 예약 변경 버튼의
  // 폴백 매핑에 쓴다. 동명이인은 인덱스에서 ambiguous 로 표시되어 폴백되지 않는다.
  // 한계: 멘토가 DROPDOWN_PAGE_SIZE(1000)명을 넘으면 페이지 밖 멘토는 인덱스에 없어
  // 폴백 불가 → 해당 행은 버튼 비활성으로 자연 처리된다(오매칭 위험 없음).
  const mentorNameIndex = useMemo(
    () => buildMentorNameIndex(mentors),
    [mentors],
  );

  const resolveRowMentorId = useCallback(
    (row: FeedbackAdminVo) => resolveMentorId(row, mentorNameIndex),
    [mentorNameIndex],
  );

  const visibleReservations = useMemo(() => {
    const byName = filterByMenteeName(reservations ?? [], filter.menteeName);
    return sortReservations(byName, sort);
  }, [reservations, filter.menteeName, sort]);

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

      <div className="flex justify-end">
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'list' ? (
        <ReservationListView
          reservations={visibleReservations}
          sort={sort}
          onToggleSort={toggleSort}
          onView={setSelectedFeedbackId}
          onChange={setChangingReservation}
          resolveMentorId={resolveRowMentorId}
          isLoading={isLoading}
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

      <Suspense fallback={null}>
        <ReservationChangeModal
          reservation={changingReservation}
          onClose={() => setChangingReservation(null)}
        />
      </Suspense>
    </div>
  );
}
