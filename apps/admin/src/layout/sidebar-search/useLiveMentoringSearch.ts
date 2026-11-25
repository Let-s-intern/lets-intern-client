import { useQuery } from '@tanstack/react-query';

import { fetchAdminLiveMentorings } from '@/api/live-mentoring/liveMentoring';
import type {
  AdminLiveMentoring,
  LiveMentoringStatus,
} from '@/api/live-mentoring/liveMentoringSchema';

import { fixSearchTypos } from './matchEntries';
import type { SearchEntry } from './searchEntries';
import { MIN_REMOTE_QUERY, type UserSearchStatus } from './useUserSearch';

/** 1:1 멘토링 묶음은 많아야 이만큼. 서버에도 같은 크기로 요청한다 */
export const MAX_LIVE_MENTORINGS = 5;

export interface FoundLiveMentoring {
  id: number;
  /** 「[1:1 멘토링] 상품 제목」 */
  title: string;
  /** 「멘토 닉네임 · 개설 중」 처럼 짧게 */
  summary: string;
  destinations: SearchEntry[];
}

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

const entry = (label: string, path: string) => ({
  label,
  path,
  parents: [],
  keywords: [],
});

/**
 * 1:1 멘토링 상품 하나로 갈 수 있는 곳. 참여자·후기·상세페이지 탭은 멘토 단위라 mentorId 를 함께 넘긴다
 * (pages/pages/live-mentoring/AdminLiveMentoringPage.tsx 가 ?tab= 과 ?mentorId= 를 읽는다).
 * 경로는 router.tsx 의 실제 라우트와 맞춘다(테스트로 확인).
 */
export const liveMentoringDestinations = (mentorId: number): SearchEntry[] => [
  entry('상품 관리', '/live-mentoring?tab=products'),
  entry('참여자', `/live-mentoring?tab=participants&mentorId=${mentorId}`),
  entry('후기', `/live-mentoring?tab=reviews&mentorId=${mentorId}`),
  entry('상세페이지', `/live-mentoring?tab=detailPage&mentorId=${mentorId}`),
];

const STATUS_TEXT: Record<LiveMentoringStatus, string> = {
  DRAFT: '작성 중',
  APPROVED: '승인',
  INACTIVE: '비활성',
};

const summaryOf = (row: AdminLiveMentoring) =>
  [row.mentorNickname, row.currentOpening ? '개설 중' : STATUS_TEXT[row.status]]
    .filter(Boolean)
    .join(' · ');

const toFound = (row: AdminLiveMentoring): FoundLiveMentoring => ({
  id: row.liveMentoringId,
  title: `[1:1 멘토링] ${row.title ?? '제목 없음'}`,
  summary: summaryOf(row),
  destinations: liveMentoringDestinations(row.mentorId),
});

/**
 * 메뉴 검색 패널의 1:1 멘토링 묶음. 마그넷 묶음과 같은 규칙 — 2글자 이상, 입력이 멈춘 뒤의 검색어로 묻고,
 * 검색어가 바뀌면 이전 요청은 취소된다. 서버가 상품 제목·멘토 이름·닉네임을 찾는다.
 */
export const useLiveMentoringSearch = (
  query: string,
  debouncedQuery: string,
) => {
  const isActive = normalize(query).length >= MIN_REMOTE_QUERY;
  const keyword = fixSearchTypos(debouncedQuery.trim());
  const isRemoteActive = normalize(keyword).length >= MIN_REMOTE_QUERY;

  const list = useQuery({
    queryKey: ['sidebarSearchLiveMentorings', keyword],
    queryFn: ({ signal }) => fetchAdminLiveMentorings(keyword, signal),
    enabled: isRemoteActive,
    staleTime: 30 * 1000,
  });

  if (!isActive) {
    return { status: 'idle' as UserSearchStatus, liveMentorings: [] };
  }
  const isRemoteCurrent = isRemoteActive && debouncedQuery === query;
  const status: UserSearchStatus =
    !isRemoteCurrent || list.isPending
      ? 'loading'
      : list.isError
        ? 'error'
        : 'done';

  if (status !== 'done') return { status, liveMentorings: [] };
  return {
    status,
    liveMentorings: (list.data ?? [])
      .slice(0, MAX_LIVE_MENTORINGS)
      .map(toFound),
  };
};
