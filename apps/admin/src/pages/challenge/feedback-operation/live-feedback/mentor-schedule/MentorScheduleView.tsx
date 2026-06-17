import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { mentorFeedbackSlotsQueryOptions } from '@/api/feedback/feedback';
import { useUserAdminQuery } from '@/api/user/user';
import { getMentorColor } from '../constants/colors';
import WeeklyGrid from '../weekly-calendar/WeeklyGrid';
import WeekNavigator from '../weekly-calendar/WeekNavigator';
import {
  getMonday,
  getWeekRange,
  shiftWeek,
} from '../weekly-calendar/weekUtils';
import { buildSlotBlocks, type MentorSlots } from './buildSlotBlocks';

const MENTOR_PAGE_SIZE = 1000;

/**
 * 모든 멘토의 주간 슬롯을 시간대 그리드에 표시한다.
 *
 * 멘토 일괄 스케줄 API 가 없어(PRD §3 BE 갭) 멘토 목록 조회 후
 * 멘토마다 slot/{mentorId} 를 useQueries 로 병렬 호출해 합산한다(N+1 허용).
 */
export default function MentorScheduleView() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const { data: mentorData } = useUserAdminQuery({
    isMentor: true,
    pageable: { page: 1, size: MENTOR_PAGE_SIZE },
  });

  const mentors = useMemo(
    () =>
      (mentorData?.userAdminList ?? []).map((u) => ({
        id: u.userInfo.id,
        name: u.userInfo.name,
      })),
    [mentorData],
  );

  const range = useMemo(() => getWeekRange(weekStart), [weekStart]);

  // 멘토별 슬롯 병렬 조회.
  const slotQueries = useQueries({
    queries: mentors.map((mentor) =>
      mentorFeedbackSlotsQueryOptions(mentor.id, {
        startDate: range.startDate,
        endDate: range.endDate,
      }),
    ),
  });

  const blocks = useMemo(() => {
    const mentorSlots: MentorSlots[] = mentors.map((mentor, i) => ({
      mentorId: mentor.id,
      mentorName: mentor.name,
      slots: slotQueries[i]?.data ?? [],
    }));
    return buildSlotBlocks(mentorSlots, weekStart);
  }, [mentors, slotQueries, weekStart]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeekNavigator
          weekStart={weekStart}
          onPrev={() => setWeekStart((w) => shiftWeek(w, -1))}
          onNext={() => setWeekStart((w) => shiftWeek(w, 1))}
          onToday={() => setWeekStart(getMonday(new Date()))}
        />
        <MentorLegend mentorNames={mentors.map((m) => m.name)} />
      </div>
      <WeeklyGrid weekStart={weekStart} blocks={blocks} />
    </div>
  );
}

/** 멘토별 색상 범례 + OPEN/RESERVED 표기 안내. */
function MentorLegend({ mentorNames }: { mentorNames: string[] }) {
  // 색상은 이름 기반이라 동명이인은 같은 색 → 고유 이름만 한 번씩 표기.
  const uniqueNames = [...new Set(mentorNames)];
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {uniqueNames.map((name) => {
        const color = getMentorColor(name);
        return (
          <span
            key={name}
            className="text-xxsmall12 text-neutral-0 inline-flex items-center gap-1"
          >
            <span
              className={`inline-block h-3 w-3 rounded-sm border ${color.bg} ${color.border}`}
            />
            {name}
          </span>
        );
      })}
      <span className="text-xxsmall12 text-neutral-40 ml-2">
        (채움=예약, 점선=오픈)
      </span>
    </div>
  );
}
