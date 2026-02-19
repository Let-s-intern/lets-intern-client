// TODO: API 준비 후 src/api/magnet/ 폴더로 이동하고 실제 API 호출로 교체
import { IPageInfo } from '@/types/interface';
import { MagnetListItem, MagnetTypeKey } from './types';

const MOCK_MAGNETS: MagnetListItem[] = [
  {
    id: 5,
    type: 'RESOURCE',
    title: 'HR 직무 자료집',
    programType: null,
    challengeType: null,
    displayDate: '2026-01-15T00:00:00',
    endDate: '2026-06-30T23:59:59',
    isVisible: false,
    applicantCount: 9,
  },
  {
    id: 4,
    type: 'VOD',
    title: '취준생이 모르면 안되는 AI 역량 VOD',
    programType: null,
    challengeType: null,
    displayDate: '2026-01-10T00:00:00',
    endDate: '2026-07-31T23:59:59',
    isVisible: true,
    applicantCount: 99,
  },
  {
    id: 3,
    type: 'FREE_TEMPLATE',
    title: '자유양식 이력서 템플릿',
    programType: null,
    challengeType: null,
    displayDate: '2026-01-05T00:00:00',
    endDate: '2026-12-31T23:59:59',
    isVisible: true,
    applicantCount: 999,
  },
  {
    id: 2,
    type: 'LAUNCH_ALERT',
    title: '리틀리 프로그램',
    programType: null,
    challengeType: null,
    displayDate: null,
    endDate: null,
    isVisible: false,
    applicantCount: 0,
  },
  {
    id: 1,
    type: 'EVENT',
    title: '리틀리 프로그램',
    programType: null,
    challengeType: null,
    displayDate: null,
    endDate: null,
    isVisible: false,
    applicantCount: 0,
  },
];

export interface MagnetListResponse {
  magnetList: MagnetListItem[];
  pageInfo: IPageInfo;
}

export interface MagnetFilterParams {
  magnetId?: string;
  type?: string;
  titleKeyword?: string;
}

// TODO: API 준비 후 실제 server-side API fetch로 교체 (ISR/SSR 대응)
export async function fetchMagnetList(
  params: MagnetFilterParams,
): Promise<MagnetListResponse> {
  return filterMagnetData(MOCK_MAGNETS, params);
}

/** 클라이언트 사이드 필터링 (동기) — 서버에서 받은 데이터를 클라이언트에서 재필터링할 때 사용 */
export function filterMagnetData(
  items: MagnetListItem[],
  params: MagnetFilterParams,
): MagnetListResponse {
  let filtered = [...items];

  if (params.magnetId) {
    const ids = params.magnetId
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    filtered = filtered.filter((m) => ids.includes(String(m.id)));
  }

  if (params.type) {
    filtered = filtered.filter((m) => m.type === params.type);
  }

  if (params.titleKeyword) {
    const keywords = params.titleKeyword
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    filtered = filtered.filter((m) =>
      keywords.some((kw) => m.title.includes(kw)),
    );
  }

  return {
    magnetList: filtered,
    pageInfo: {
      pageNum: 0,
      pageSize: filtered.length,
      totalElements: filtered.length,
      totalPages: 1,
    },
  };
}

// TODO: API 준비 후 useCreateMagnetMutation React Query 훅으로 교체
export function createMagnet(body: {
  type: MagnetTypeKey;
  title: string;
}): MagnetListItem {
  const maxId = MOCK_MAGNETS.reduce((max, m) => Math.max(max, m.id), 0);
  const newMagnet: MagnetListItem = {
    id: maxId + 1,
    type: body.type,
    title: body.title,
    programType: null,
    challengeType: null,
    displayDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isVisible: false,
    applicantCount: 0,
  };
  MOCK_MAGNETS.unshift(newMagnet);
  return newMagnet;
}

// TODO: API 준비 후 useToggleMagnetVisibilityMutation React Query 훅으로 교체
export function toggleMagnetVisibility(
  id: number,
  isVisible: boolean,
): void {
  const magnet = MOCK_MAGNETS.find((m) => m.id === id);
  if (magnet) magnet.isVisible = isVisible;
}

// TODO: API 준비 후 useDeleteMagnetMutation React Query 훅으로 교체
export function deleteMagnet(id: number): void {
  const index = MOCK_MAGNETS.findIndex((m) => m.id === id);
  if (index !== -1) MOCK_MAGNETS.splice(index, 1);
}
