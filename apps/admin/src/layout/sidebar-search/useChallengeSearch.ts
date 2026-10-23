import { useQuery } from '@tanstack/react-query';

import { fetchAdminChallenges } from '@/api/program';
import dayjs from '@/lib/dayjs';
import type { ProgramAdminListItem } from '@/schema';
import { programStatusToText } from '@/utils/convert';

import type { SearchEntry } from './searchEntries';
import { MIN_REMOTE_QUERY, type UserSearchStatus } from './useUserSearch';

/** 챌린지 묶음은 많아야 이만큼 */
export const MAX_CHALLENGES = 5;

export interface FoundChallenge {
  id: number;
  title: string;
  /** 「26.01.05~26.02.01 · 모집 중」 처럼 짧게. 응답에 없으면 빈 문자열 */
  summary: string;
  destinations: SearchEntry[];
}

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

/** 챌린지 하나로 갈 수 있는 곳. 경로는 router.tsx 의 실제 라우트와 맞춘다(테스트로 확인) */
export const challengeDestinations = (id: number): SearchEntry[] => {
  const entry = (label: string, path: string, parents: string[] = []) => ({
    label,
    path,
    parents,
    keywords: [],
  });
  return [
    entry('프로그램 수정', `/challenge/${id}/edit`),
    entry('대시보드', `/challenge/operation/${id}/home`, ['챌린지 운영']),
    entry('출석·미션', `/challenge/operation/${id}/attendances`, [
      '챌린지 운영',
    ]),
    entry('참여자', `/challenge/operation/${id}/participants`, ['챌린지 운영']),
    entry('피드백', `/challenge/operation/${id}/feedback`, ['챌린지 운영']),
    entry('멘토 배정', `/challenge/mentor-assignment/${id}`),
    entry('신청자 목록', `/programs/${id}/users`),
  ];
};

const summaryOf = (info: ProgramAdminListItem['programInfo']) => {
  const period =
    info.startDate && info.endDate
      ? `${dayjs(info.startDate).format('YY.MM.DD')}~${dayjs(info.endDate).format('YY.MM.DD')}`
      : '';
  const status = programStatusToText[info.programStatusType] ?? '';
  return [period, status].filter(Boolean).join(' · ');
};

/**
 * 메뉴 검색 패널의 챌린지 묶음. 유저 묶음과 같은 규칙 — 2글자 이상, 입력이 멈춘 뒤의 검색어로 묻고,
 * 검색어가 바뀌면 이전 요청은 취소된다.
 */
export const useChallengeSearch = (query: string, debouncedQuery: string) => {
  const isActive = normalize(query).length >= MIN_REMOTE_QUERY;
  const keyword = debouncedQuery.trim();
  const isRemoteActive = normalize(keyword).length >= MIN_REMOTE_QUERY;

  const remote = useQuery({
    queryKey: ['sidebarSearchChallenges', keyword],
    queryFn: ({ signal }) =>
      fetchAdminChallenges(keyword, MAX_CHALLENGES, signal),
    enabled: isRemoteActive,
    staleTime: 30 * 1000,
  });

  if (!isActive) {
    return { status: 'idle' as UserSearchStatus, challenges: [] };
  }
  const isRemoteCurrent = isRemoteActive && debouncedQuery === query;
  const status: UserSearchStatus =
    !isRemoteCurrent || remote.isPending
      ? 'loading'
      : remote.isError
        ? 'error'
        : 'done';
  const challenges: FoundChallenge[] =
    status === 'done'
      ? (remote.data ?? []).slice(0, MAX_CHALLENGES).map(({ programInfo }) => ({
          id: programInfo.id,
          title: programInfo.title ?? '(제목 없음)',
          summary: summaryOf(programInfo),
          destinations: challengeDestinations(programInfo.id),
        }))
      : [];
  return { status, challenges };
};
