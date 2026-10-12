import { useQuery } from '@tanstack/react-query';
import { calendarFixtures, myPassFixture } from '../mock/dashboardFixtures';
import { mockDelay } from '../mock/mockDelay';
import type { AllInOnePassApplication, PassCalendarEvent } from '../types';

/**
 * U-1 대시보드 조회 훅.
 *
 * 유저 조회 API가 아직 없어 현재는 mock(../mock)을 반환한다. 실제 스펙이 나오면 각
 * queryFn 본문만 axios 호출로 교체하고 ../mock 을 삭제하면 된다(어드민 api 계층과 동일).
 * queryKey 에 applicationId 를 넣어 패스별로 캐시를 분리한다.
 */

/** 내가 구매한 올인원패스 1건 — 남은기간·이용권 카드용 */
export const useGetMyPass = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'myPass', applicationId],
    queryFn: (): Promise<AllInOnePassApplication> => mockDelay(myPassFixture),
    refetchOnWindowFocus: false,
  });

/** 대시보드 일정 캘린더 항목 — 챌린지 막대 + 세미나/마일스톤 칩 */
export const useGetPassCalendar = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'calendar', applicationId],
    queryFn: (): Promise<PassCalendarEvent[]> => mockDelay(calendarFixtures),
    refetchOnWindowFocus: false,
  });
