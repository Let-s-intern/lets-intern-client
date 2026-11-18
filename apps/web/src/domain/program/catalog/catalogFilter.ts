import type {
  ProgramCategoryTarget,
  ProgramCategoryTargetType,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import dayjs from '@/lib/dayjs';

export const CATEGORY_QUERY_KEY = 'categoryId';
export const TYPE_QUERY_KEY = 'type';
export const STATUS_QUERY_KEY = 'status';

/** 모집 상태 탭. 값은 예전 목록 주소(`?status=PROCEEDING`)와 같다 */
export const CATALOG_STATUSES = [
  { key: null, label: '전체' },
  { key: 'PROCEEDING', label: '모집 중' },
  { key: 'PREV', label: '모집 예정' },
  { key: 'POST', label: '모집 종료' },
] as const;
export type CatalogStatus = 'PROCEEDING' | 'PREV' | 'POST';

/**
 * 상품 유형 칩. "전체" 없이 하나씩 고르고 기본은 챌린지.
 * 가이드북(챌린지 안의 선택지)·무료 자료집은 목록에서 뺀다 (prd-프로그램-목록-필터-개편 4장)
 */
export const CATALOG_TYPES: {
  key: ProgramCategoryTargetType;
  label: string;
}[] = [
  { key: 'CHALLENGE', label: '챌린지' },
  { key: 'LIVE', label: 'LIVE 클래스' },
  { key: 'VOD', label: 'VOD 클래스' },
  { key: 'LIVE_MENTORING', label: '1:1 LIVE 멘토링' },
  { key: 'MEMBERSHIP', label: '올인원 패스' },
];

export const DEFAULT_CATALOG_TYPE: ProgramCategoryTargetType = 'CHALLENGE';

/** 목록에 보이지 않는 유형. 블로그는 상품이 아니다 */
const HIDDEN_TYPES: ProgramCategoryTargetType[] = [
  'GUIDEBOOK',
  'BLOG',
  'MAGNET',
];

/** 예전 `?jobCategory=` 링크 → 노출 분류 키(slug) */
const LEGACY_JOB_SLUG: Record<string, string> = {
  MARKETING: 'marketing',
  HR: 'hr',
  LARGE_COMPANY: 'large-corp',
};

export interface CatalogQuery {
  categoryIds: number[];
  type: ProgramCategoryTargetType;
  status?: CatalogStatus | null;
}

/**
 * 주소의 필터를 읽는다. 없는 카테고리 id 는 버린다.
 * 예전 링크도 받는다: `?jobCategory=MARKETING` 은 마케팅 카테고리로,
 * `?type=GUIDEBOOK` 과 `?classification=` 은 무시한다
 */
export const parseCatalogQuery = (
  params: URLSearchParams,
  groups: PublicProgramCategoryGroup[],
): CatalogQuery => {
  const categories = groups.flatMap((g) => g.categoryList);
  const known = new Set(categories.map((c) => c.id));

  const ids = params
    .getAll(CATEGORY_QUERY_KEY)
    .map(Number)
    .filter((id) => known.has(id));
  params.getAll('jobCategory').forEach((job) => {
    const slug = LEGACY_JOB_SLUG[job];
    const category = slug && categories.find((c) => c.slug === slug);
    if (category) ids.push(category.id);
  });

  const typeKeys = CATALOG_TYPES.map((t) => t.key);
  const type =
    params
      .getAll(TYPE_QUERY_KEY)
      .find((t): t is ProgramCategoryTargetType =>
        typeKeys.includes(t as ProgramCategoryTargetType),
      ) ?? DEFAULT_CATALOG_TYPE;

  const statusParam = params.get(STATUS_QUERY_KEY);
  const status =
    CATALOG_STATUSES.find((s) => s.key && s.key === statusParam)?.key ?? null;

  return { categoryIds: [...new Set(ids)], type, status };
};

export const toCatalogSearch = ({
  categoryIds,
  type,
  status,
}: CatalogQuery) => {
  const params = new URLSearchParams();
  categoryIds.forEach((id) => params.append(CATEGORY_QUERY_KEY, String(id)));
  // 기본(챌린지)은 주소에 안 남긴다
  if (type !== DEFAULT_CATALOG_TYPE) params.set(TYPE_QUERY_KEY, type);
  if (status) params.set(STATUS_QUERY_KEY, status);
  return params.toString();
};

export type RecruitStatus = 'OPEN' | 'UPCOMING' | 'CLOSED' | 'ALWAYS';

/** 모집 기간으로 상태를 정한다. 모집 기간이 없으면(VOD·자료집·멘토링) 상시 */
export const getRecruitStatus = (
  target: ProgramCategoryTarget,
  now = dayjs(),
): RecruitStatus => {
  if (!target.deadline) return 'ALWAYS';
  if (now.isAfter(target.deadline)) return 'CLOSED';
  if (target.beginning && now.isBefore(target.beginning)) return 'UPCOMING';
  return 'OPEN';
};

const STATUS_ORDER: Record<RecruitStatus, number> = {
  OPEN: 0,
  UPCOMING: 1,
  ALWAYS: 2,
  CLOSED: 3,
};

/**
 * 숨길 유형을 빼고, 고른 유형만 남기고, 모집 중 → 모집 예정 → 상시 → 마감 순으로
 */
/** 모집 중에는 상시 신청 상품(VOD·자료집·멘토링)도 넣는다 */
const STATUS_MATCH: Record<CatalogStatus, RecruitStatus[]> = {
  PROCEEDING: ['OPEN', 'ALWAYS'],
  PREV: ['UPCOMING'],
  POST: ['CLOSED'],
};

export const filterCatalogTargets = (
  targets: ProgramCategoryTarget[],
  type: ProgramCategoryTargetType,
  now = dayjs(),
  status: CatalogStatus | null = null,
) =>
  targets
    .filter((t) => !HIDDEN_TYPES.includes(t.targetType))
    .filter((t) => t.targetType === type)
    .filter(
      (t) => !status || STATUS_MATCH[status].includes(getRecruitStatus(t, now)),
    )
    .map((t, index) => ({
      t,
      index,
      order: STATUS_ORDER[getRecruitStatus(t, now)],
    }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ t }) => t);

/**
 * 챌린지 카드 제목. 같은 챌린지는 버전·기수와 관계없이 한 장이므로
 * 앞의 `[버전]` 과 뒤의 `N기 …` 를 뗀다. 패턴이 없으면 그대로
 */
export const getCatalogTitle = (target: ProgramCategoryTarget) => {
  if (target.targetType !== 'CHALLENGE') return target.title;
  return (
    target.title
      .replace(/^(\s*\[[^\]]*\]\s*)+/, '')
      .replace(/\s*\d+기(\s.*)?$/, '')
      .trim() || target.title
  );
};
