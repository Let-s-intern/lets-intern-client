import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useUserAdminQuery } from '@/api/user/user';
import { useAdminFeedbackListQuery } from '@/api/feedback/feedback';
import axios from '@/utils/axios';
import ReservationFilters from './ui/ReservationFilters';
import ViewToggle, { type ReservationView } from './ui/ViewToggle';
import {
  INITIAL_FILTER,
  buildListParams,
  type ReservationFilterState,
} from './utils/buildListParams';

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

  // 필터 드롭다운 옵션 소스. 예약 목록과 독립적이라 병렬로 패칭된다.
  const { data: challengeData } = useChallengeDropdownQuery();
  const { data: mentorData } = useUserAdminQuery({
    isMentor: true,
    pageable: { page: 1, size: DROPDOWN_PAGE_SIZE },
  });

  const listParams = useMemo(() => buildListParams(filter), [filter]);
  // 목록 데이터는 2.3 의 리스트 뷰에서 사용한다(여기선 파라미터 매핑·재조회만 연결).
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

      {/* 리스트/캘린더 뷰는 2.3·Push 3 에서 연결한다. */}
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        목록은 준비 중입니다.
      </div>
    </div>
  );
}
