import { useQuery } from '@tanstack/react-query';

import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import { fetchAdminUsers } from '@/api/user/user';

import type { SearchEntry } from './searchEntries';

/** 유저 묶음은 많아야 이만큼 */
export const MAX_USERS = 5;
/** 이보다 짧은 검색어로는 유저를 찾지 않는다 */
export const MIN_REMOTE_QUERY = 2;

export interface FoundUser {
  id: number;
  /** 멘토 목록에서 닉네임으로 찾았으면 「닉네임 (이름)」, 아니면 이름 */
  title: string;
  isMentor: boolean;
  maskedEmail: string;
  /** 이 유저로 갈 수 있는 곳. 키보드로 하나씩 고른다 */
  destinations: SearchEntry[];
}

export type UserSearchStatus = 'idle' | 'loading' | 'error' | 'done';

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

/** 앞 1글자 + *** + @도메인. 전화번호는 아예 보이지 않는다 */
export const maskEmail = (email: string) => {
  const at = email.indexOf('@');
  if (at <= 0) return email ? `${email[0]}***` : '';
  return `${email[0]}***${email.slice(at)}`;
};

/** 이메일이면 email, 숫자·하이픈만이면 phoneNum, 그 밖은 name 으로 찾는다 */
export const toUserSearchParams = (query: string) => {
  const term = query.trim();
  if (term.includes('@')) return { email: term };
  if (/^[\d-]+$/.test(term)) return { phoneNum: term };
  return { name: term };
};

const destinationsOf = (userId: number, isMentor: boolean): SearchEntry[] => [
  ...(isMentor
    ? [
        {
          label: '멘토 상세',
          path: `/mentors/${userId}`,
          parents: ['멘토 관리'],
          keywords: [],
        },
      ]
    : []),
  {
    label: '유저 상세',
    path: `/users/${userId}`,
    parents: ['사용자 관리', '커리어 DB'],
    keywords: [],
  },
  {
    label: '유저 정보 수정',
    path: `/users/${userId}/edit`,
    parents: ['사용자 관리', '커리어 DB'],
    keywords: [],
  },
];

/**
 * 메뉴 검색 패널의 유저 묶음.
 * - 멘토는 패널을 처음 열 때 받아 둔 전체 멘토 목록에서 닉네임·이름으로 바로 거른다(디바운스 없음)
 * - 그 밖의 유저는 멈춘 뒤의 검색어(debouncedQuery)로 서버에 묻는다. 검색어가 바뀌면 이전 요청은 취소된다
 * 둘을 합칠 때 같은 유저는 하나만 두고, 멘토 닉네임 일치를 앞에 둔다.
 */
export const useUserSearch = (query: string, debouncedQuery: string) => {
  const isActive = normalize(query).length >= MIN_REMOTE_QUERY;
  const isRemoteActive = normalize(debouncedQuery).length >= MIN_REMOTE_QUERY;
  const params = toUserSearchParams(debouncedQuery);

  const { data: mentorList } = useAdminUserMentorListQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const remote = useQuery({
    queryKey: ['sidebarSearchUsers', params],
    queryFn: ({ signal }) =>
      fetchAdminUsers({ ...params, page: 0, size: MAX_USERS }, signal),
    enabled: isRemoteActive,
    staleTime: 30 * 1000,
  });

  if (!isActive) return { status: 'idle' as const, users: [] };

  const term = normalize(query);
  const mentorMatches: FoundUser[] = (mentorList?.mentorList ?? [])
    .filter((mentor) =>
      [mentor.nickname ?? '', mentor.name].some((value) =>
        normalize(value).includes(term),
      ),
    )
    .map((mentor) => ({
      id: mentor.id,
      title: mentor.nickname
        ? `${mentor.nickname} (${mentor.name})`
        : mentor.name,
      isMentor: true,
      maskedEmail: maskEmail(mentor.email ?? ''),
      destinations: destinationsOf(mentor.id, true),
    }));

  // 입력이 멈추기 전에는 서버 결과가 아직 이전 검색어의 것이므로 쓰지 않는다
  const isRemoteCurrent = isRemoteActive && debouncedQuery === query;
  const remoteUsers: FoundUser[] = isRemoteCurrent
    ? (remote.data ?? []).map(({ userInfo }) => ({
        id: userInfo.id,
        title: userInfo.name,
        isMentor: Boolean(userInfo.isMentor),
        maskedEmail: maskEmail(userInfo.email),
        destinations: destinationsOf(userInfo.id, Boolean(userInfo.isMentor)),
      }))
    : [];

  const seen = new Set<number>();
  const users = [...mentorMatches, ...remoteUsers]
    .filter((user) => {
      if (seen.has(user.id)) return false;
      seen.add(user.id);
      return true;
    })
    .slice(0, MAX_USERS);

  const status: UserSearchStatus =
    !isRemoteCurrent || remote.isPending
      ? 'loading'
      : remote.isError
        ? 'error'
        : 'done';

  return { status, users };
};
