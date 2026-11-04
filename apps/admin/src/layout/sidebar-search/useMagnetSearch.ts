import { useQuery } from '@tanstack/react-query';

import { fetchAdminMagnet, fetchAdminMagnets } from '@/api/magnet/magnet';
import {
  isMagnetFormManageable,
  isMagnetPostEditable,
  MAGNET_TYPE,
  type MagnetTypeKey,
} from '@/domain/admin/magnet/types';
import dayjs from '@/lib/dayjs';

import { fixSearchTypos } from './matchEntries';
import type { SearchEntry } from './searchEntries';
import { MIN_REMOTE_QUERY, type UserSearchStatus } from './useUserSearch';

/** 마그넷 묶음은 많아야 이만큼. 갈 곳이 최대 3개라 프로그램(8)보다 적게 둔다 */
export const MAX_MAGNETS = 5;

export interface FoundMagnet {
  id: number;
  /** 「[자료집] 제목」 */
  title: string;
  /** 「26.11.01~26.11.30 · 노출」 처럼 짧게 */
  summary: string;
  destinations: SearchEntry[];
}

interface MagnetRow {
  magnetId: number;
  type: MagnetTypeKey;
  title: string;
  startDate: string | null;
  endDate: string | null;
  isVisible: boolean;
}

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

const entry = (label: string, path: string) => ({
  label,
  path,
  parents: [],
  keywords: [],
});

/**
 * 마그넷 하나로 갈 수 있는 곳. 마그넷 목록 행의 버튼과 같은 조건·주소다(pages/magnet/MagnetTable.tsx).
 * 경로는 router.tsx 의 실제 라우트와 맞춘다(테스트로 확인).
 */
export const magnetDestinations = (
  type: MagnetTypeKey,
  id: number,
): SearchEntry[] => [
  ...(isMagnetPostEditable(type)
    ? [entry('글 관리', `/magnet/${id}/post`)]
    : []),
  ...(isMagnetFormManageable(type)
    ? [entry('신청 폼 관리', `/magnet/${id}/form`)]
    : []),
  entry('신청자 정보', `/leads/managements/${id}`),
];

const summaryOf = (row: MagnetRow) => {
  const period =
    row.startDate && row.endDate
      ? `${dayjs(row.startDate).format('YY.MM.DD')}~${dayjs(row.endDate).format('YY.MM.DD')}`
      : '';
  return [period, row.isVisible ? '노출' : '비노출']
    .filter(Boolean)
    .join(' · ');
};

const toFound = (row: MagnetRow): FoundMagnet => ({
  id: row.magnetId,
  title: `[${MAGNET_TYPE[row.type]}] ${row.title}`,
  summary: summaryOf(row),
  destinations: magnetDestinations(row.type, row.magnetId),
});

/**
 * 메뉴 검색 패널의 마그넷 묶음. 프로그램 묶음과 같은 규칙 — 2글자 이상, 입력이 멈춘 뒤의 검색어로 묻고,
 * 검색어가 바뀌면 이전 요청은 취소된다. 서버 검색은 제목만 보므로, 숫자만 친 검색어는 그 id 를 단건 조회해
 * 맨 앞에 붙인다. 없는 id 는 실패가 아니라 결과 없음으로 다룬다.
 */
export const useMagnetSearch = (query: string, debouncedQuery: string) => {
  const isActive = normalize(query).length >= MIN_REMOTE_QUERY;
  const keyword = fixSearchTypos(debouncedQuery.trim());
  const isRemoteActive = normalize(keyword).length >= MIN_REMOTE_QUERY;
  const magnetId = /^\d+$/.test(keyword) ? Number(keyword) : null;

  const list = useQuery({
    queryKey: ['sidebarSearchMagnets', keyword],
    queryFn: ({ signal }) => fetchAdminMagnets(keyword, signal),
    enabled: isRemoteActive,
    staleTime: 30 * 1000,
  });

  const byId = useQuery({
    queryKey: ['sidebarSearchMagnet', magnetId],
    queryFn: ({ signal }) =>
      fetchAdminMagnet(magnetId as number, signal).catch(() => null),
    enabled: isRemoteActive && magnetId !== null,
    staleTime: 30 * 1000,
  });

  if (!isActive) {
    return { status: 'idle' as UserSearchStatus, magnets: [] };
  }
  const isRemoteCurrent = isRemoteActive && debouncedQuery === query;
  const isPending = list.isPending || (magnetId !== null && byId.isPending);
  const status: UserSearchStatus =
    !isRemoteCurrent || isPending ? 'loading' : list.isError ? 'error' : 'done';

  if (status !== 'done') return { status, magnets: [] };

  const found = byId.data ? [byId.data] : [];
  const rows = [
    ...found,
    ...(list.data ?? []).filter((row) => row.magnetId !== byId.data?.magnetId),
  ];
  return { status, magnets: rows.slice(0, MAX_MAGNETS).map(toFound) };
};
