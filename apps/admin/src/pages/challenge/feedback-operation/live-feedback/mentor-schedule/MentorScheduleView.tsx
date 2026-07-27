import { useMemo, useState } from 'react';
import {
  useAdminFeedbackListQuery,
  useAdminMentorSlotCountsQuery,
  useMentorFeedbackSlotsQuery,
} from '@/api/feedback/feedback';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { getMentorColor } from '../constants/colors';
import { buildReservationBlocks } from '../reservation/ui/ReservationCalendarView';
import ReservationDetailModal from '../reservation/ui/ReservationDetailModal';
import ReservationListView from '../reservation/ui/ReservationListView';
import ReservationRescheduleModal from '../reservation/ui/ReservationRescheduleModal';
import ViewToggle, { type ReservationView } from '../reservation/ui/ViewToggle';
import {
  sortReservations,
  type SortKey,
  type SortState,
} from '../reservation/utils/sortReservations';
import WeeklyGrid from '../weekly-calendar/WeeklyGrid';
import WeekNavigator from '../weekly-calendar/WeekNavigator';
import {
  getMonday,
  getWeekRange,
  shiftWeek,
} from '../weekly-calendar/weekUtils';
import { buildSlotBlocks } from './buildSlotBlocks';

/**
 * 멘토 스케줄 — 멘토를 태그로 나열하고, 선택한 1명의 스케줄을 캘린더/리스트로 본다.
 *
 * - 멘토 목록은 전용 API(/admin/user/mentor, 서버 isMentor 필터)를 쓴다.
 * - 캘린더: 오픈 슬롯(가용 시간) + 예약(전체 정보, 클릭 시 상세). 예약탭 캘린더와 같은 정보.
 * - 리스트: 선택 멘토의 예약을 표로. 상세·예약변경은 예약탭과 동일 흐름.
 * - 태그의 "예정 N" 은 앞으로 진행할(시작이 현재 이후) 예약 건수.
 */
export default function MentorScheduleView() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<ReservationView>('calendar');
  const [sort, setSort] = useState<SortState>({
    key: 'dateTime',
    direction: 'desc',
  });
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(
    null,
  );
  const [rescheduleTarget, setRescheduleTarget] =
    useState<FeedbackAdminVo | null>(null);

  const { data: mentorData } = useAdminUserMentorListQuery();
  const mentors = useMemo(
    () =>
      (mentorData?.mentorList ?? []).map((m) => ({ id: m.id, name: m.name })),
    [mentorData],
  );

  // 예약 목록(1콜, 예약탭과 캐시 공유). 태그 예정 건수 + 선택 멘토의 예약에 쓴다.
  const { data: reservations, isLoading: reservationsLoading } =
    useAdminFeedbackListQuery();

  // 앞으로 할(예정) 예약 건수 = 시작이 현재 이후인 예약.
  const upcomingCountByMentor = useMemo(() => {
    const nowMs = Date.now();
    const map = new Map<number, number>();
    (reservations ?? []).forEach((r) => {
      if (new Date(r.startDate).getTime() >= nowMs) {
        map.set(r.mentorId, (map.get(r.mentorId) ?? 0) + 1);
      }
    });
    return map;
  }, [reservations]);

  // 멘토별 오픈 슬롯 건수(현재 이후). BE 집계 API 1콜로 태그에 표시.
  const nowIso = useMemo(() => dayjs().format('YYYY-MM-DDTHH:mm:ss'), []);
  const { data: slotCounts } = useAdminMentorSlotCountsQuery(nowIso);
  const openCountByMentor = useMemo(() => {
    const map = new Map<number, number>();
    (slotCounts ?? []).forEach((s) => map.set(s.mentorId, s.openCount));
    return map;
  }, [slotCounts]);

  const filteredMentors = useMemo(() => {
    const kw = keyword.trim();
    const list = kw ? mentors.filter((m) => m.name.includes(kw)) : mentors;
    // 예정 예약 많은 순(동수면 이름순).
    return [...list].sort((a, b) => {
      const diff =
        (upcomingCountByMentor.get(b.id) ?? 0) -
        (upcomingCountByMentor.get(a.id) ?? 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }, [mentors, keyword, upcomingCountByMentor]);

  const selectedMentor = useMemo(
    () => mentors.find((m) => m.id === selectedMentorId) ?? null,
    [mentors, selectedMentorId],
  );

  // 선택 멘토의 예약(전체 기간). 리스트뷰·캘린더 예약 블록에 쓴다.
  const mentorReservations = useMemo(
    () => (reservations ?? []).filter((r) => r.mentorId === selectedMentorId),
    [reservations, selectedMentorId],
  );

  const sortedMentorReservations = useMemo(
    () => sortReservations(mentorReservations, sort),
    [mentorReservations, sort],
  );

  const range = useMemo(() => getWeekRange(weekStart), [weekStart]);

  // 오픈 슬롯(가용 시간)만 조회 → 캘린더에 "오픈" 블록으로 표시.
  const { data: openSlots } = useMentorFeedbackSlotsQuery(
    selectedMentorId ?? undefined,
    {
      startDate: range.startDate,
      endDate: range.endDate,
      statusList: ['OPEN'],
    },
  );

  // 캘린더 블록 = 오픈 슬롯 + 예약(전체 정보, 클릭 시 상세).
  const blocks = useMemo(() => {
    if (!selectedMentor) return [];
    const openBlocks = buildSlotBlocks(
      [
        {
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          slots: openSlots ?? [],
        },
      ],
      weekStart,
    );
    const reservedBlocks = buildReservationBlocks(
      mentorReservations,
      weekStart,
      setSelectedFeedbackId,
    );
    return [...openBlocks, ...reservedBlocks];
  }, [selectedMentor, openSlots, mentorReservations, weekStart]);

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );

  const mentorColor = selectedMentor
    ? getMentorColor(selectedMentor.name)
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* 멘토 태그 목록 — 클릭 시 해당 멘토 스케줄 조회 */}
      <div className="flex flex-col gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="멘토 이름 검색"
          className="border-neutral-80 text-xsmall14 w-full max-w-xs rounded-md border px-3 py-2"
        />
        <div className="border-neutral-90 flex max-h-52 flex-wrap gap-2 overflow-y-auto rounded-md border p-2.5">
          {filteredMentors.length === 0 ? (
            <span className="text-xsmall14 text-neutral-40">
              표시할 멘토가 없습니다.
            </span>
          ) : (
            filteredMentors.map((mentor) => {
              const selected = mentor.id === selectedMentorId;
              const color = getMentorColor(mentor.name);
              return (
                <button
                  key={mentor.id}
                  type="button"
                  onClick={() => setSelectedMentorId(mentor.id)}
                  className={twMerge(
                    'text-xsmall14 rounded-full border px-4 py-2 font-medium',
                    selected
                      ? twMerge(
                          color.bg,
                          color.border,
                          color.text,
                          'font-semibold',
                        )
                      : 'border-neutral-80 text-neutral-40 bg-white',
                  )}
                >
                  {mentor.name}
                  <span className="ml-1 opacity-60">
                    · 예정 {upcomingCountByMentor.get(mentor.id) ?? 0}
                    {slotCounts != null &&
                      ` · 오픈 ${openCountByMentor.get(mentor.id) ?? 0}`}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 선택된 멘토 영역 */}
      {selectedMentor ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ViewToggle value={view} onChange={setView} />
            <span className="text-xsmall14 text-neutral-0 font-semibold">
              {selectedMentor.name} 스케줄
            </span>
          </div>

          {view === 'calendar' ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <WeekNavigator
                  weekStart={weekStart}
                  onPrev={() => setWeekStart((w) => shiftWeek(w, -1))}
                  onNext={() => setWeekStart((w) => shiftWeek(w, 1))}
                  onToday={() => setWeekStart(getMonday(new Date()))}
                />
                <div className="flex items-center gap-3">
                  <span className="text-xxsmall12 text-neutral-40 flex items-center gap-1.5">
                    <span
                      className={twMerge(
                        'h-3 w-3 rounded-sm border',
                        mentorColor?.bg,
                        mentorColor?.border,
                      )}
                    />
                    예약
                  </span>
                  <span className="text-xxsmall12 text-neutral-40 flex items-center gap-1.5">
                    <span className="border-neutral-80 bg-neutral-95 h-3 w-3 rounded-sm border" />
                    오픈
                  </span>
                </div>
              </div>
              <WeeklyGrid weekStart={weekStart} blocks={blocks} />
            </div>
          ) : (
            <ReservationListView
              reservations={sortedMentorReservations}
              sort={sort}
              onToggleSort={toggleSort}
              onView={setSelectedFeedbackId}
              onReschedule={setRescheduleTarget}
              isLoading={reservationsLoading}
              emptyMessage="이 멘토의 예약 내역이 없습니다."
            />
          )}
        </div>
      ) : (
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          멘토를 선택하면 해당 멘토의 스케줄이 표시됩니다.
        </div>
      )}

      {/* 예약 상세 → 예약 변경 전환 (예약탭과 동일 흐름) */}
      <ReservationDetailModal
        feedbackId={selectedFeedbackId}
        onClose={() => setSelectedFeedbackId(null)}
        onReschedule={() => {
          const target = mentorReservations.find(
            (r) => r.feedbackId === selectedFeedbackId,
          );
          if (target) {
            setSelectedFeedbackId(null);
            setRescheduleTarget(target);
          }
        }}
      />
      {rescheduleTarget && (
        <ReservationRescheduleModal
          feedback={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
        />
      )}
    </div>
  );
}
