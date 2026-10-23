import { useQuery } from '@tanstack/react-query';

import { fetchAdminPrograms } from '@/api/program';
import dayjs from '@/lib/dayjs';
import {
  CHALLENGE_OPERATION_TABS,
  challengeOperationTabPath,
} from '@/pages/challenge/ui/challengeOperationTabs';
import type { ProgramAdminListItem } from '@/schema';
import { programStatusToText } from '@/utils/convert';

import type { SearchEntry } from './searchEntries';
import { MIN_REMOTE_QUERY, type UserSearchStatus } from './useUserSearch';

/** 프로그램 묶음은 많아야 이만큼 */
export const MAX_PROGRAMS = 8;

/** 검색 패널에 보이는 유형과 머리 줄 라벨. 어드민에 갈 화면이 없는 유형(서류 진단 등)은 뺀다 */
const PROGRAM_TYPE_LABEL = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE',
  VOD: 'VOD',
  GUIDEBOOK: '가이드북',
} as const;

type SearchableProgramType = keyof typeof PROGRAM_TYPE_LABEL;

const isSearchableType = (type: string): type is SearchableProgramType =>
  type in PROGRAM_TYPE_LABEL;

export interface FoundProgram {
  /** id 는 유형마다 따로 매겨져 겹칠 수 있다. 목록 key 는 type 과 함께 쓴다 */
  type: SearchableProgramType;
  id: number;
  /** 「[LIVE] 제목」 */
  title: string;
  /** 「26.01.05~26.02.01 · 모집 중」 처럼 짧게. 응답에 없으면 빈 문자열 */
  summary: string;
  destinations: SearchEntry[];
}

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

const entry = (label: string, path: string, parents: string[] = []) => ({
  label,
  path,
  parents,
  keywords: [],
});

/**
 * 프로그램 하나로 갈 수 있는 곳. 경로는 router.tsx 의 실제 라우트와 맞춘다(테스트로 확인).
 * 수정·신청자 목록은 프로그램 목록 화면의 「수정」「참여자」 버튼과 같은 주소다.
 */
export const programDestinations = (
  type: SearchableProgramType,
  id: number,
): SearchEntry[] => {
  const users = entry(
    '신청자 목록',
    `/programs/${id}/users?programType=${type}`,
  );
  switch (type) {
    case 'CHALLENGE':
      return [
        entry('프로그램 수정', `/challenge/${id}/edit`),
        ...CHALLENGE_OPERATION_TABS.map((tab) =>
          entry(tab.text, challengeOperationTabPath(id, tab.id), [
            '챌린지 운영',
          ]),
        ),
        entry('멘토 배정', `/challenge/mentor-assignment/${id}`),
        users,
      ];
    case 'LIVE':
      return [entry('프로그램 수정', `/live/${id}/edit`), users];
    case 'VOD':
      return [entry('프로그램 수정', `/vod/${id}/edit`), users];
    case 'GUIDEBOOK':
      return [entry('프로그램 수정', `/guidebook/${id}/edit`), users];
  }
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
 * 메뉴 검색 패널의 프로그램 묶음(챌린지·LIVE·VOD·가이드북). 유저 묶음과 같은 규칙 — 2글자 이상,
 * 입력이 멈춘 뒤의 검색어로 묻고, 검색어가 바뀌면 이전 요청은 취소된다.
 */
export const useProgramSearch = (query: string, debouncedQuery: string) => {
  const isActive = normalize(query).length >= MIN_REMOTE_QUERY;
  const keyword = debouncedQuery.trim();
  const isRemoteActive = normalize(keyword).length >= MIN_REMOTE_QUERY;

  const remote = useQuery({
    queryKey: ['sidebarSearchPrograms', keyword],
    queryFn: ({ signal }) => fetchAdminPrograms(keyword, MAX_PROGRAMS, signal),
    enabled: isRemoteActive,
    staleTime: 30 * 1000,
  });

  if (!isActive) {
    return { status: 'idle' as UserSearchStatus, programs: [] };
  }
  const isRemoteCurrent = isRemoteActive && debouncedQuery === query;
  const status: UserSearchStatus =
    !isRemoteCurrent || remote.isPending
      ? 'loading'
      : remote.isError
        ? 'error'
        : 'done';
  const programs: FoundProgram[] =
    status === 'done'
      ? (remote.data ?? []).flatMap(({ programInfo }) => {
          const type = programInfo.programType;
          if (!isSearchableType(type)) return [];
          return [
            {
              type,
              id: programInfo.id,
              title: `[${PROGRAM_TYPE_LABEL[type]}] ${programInfo.title ?? '(제목 없음)'}`,
              summary: summaryOf(programInfo),
              destinations: programDestinations(type, programInfo.id),
            },
          ];
        })
      : [];
  return { status, programs };
};
