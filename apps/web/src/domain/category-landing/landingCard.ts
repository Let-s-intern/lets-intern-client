import type {
  ProgramCategoryTarget,
  SectionDisplayType,
} from '@/api/program-category/programCategory';
import dayjs from '@/lib/dayjs';

export const TARGET_TYPE_LABEL: Record<
  ProgramCategoryTarget['targetType'],
  string
> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  VOD: 'VOD 클래스',
  GUIDEBOOK: '가이드북',
  LIVE_MENTORING: '1:1 LIVE 멘토링',
  MEMBERSHIP: '올인원 패스',
  BLOG: '블로그',
  MAGNET: '무료 자료집',
};

const formatDate = (value?: string | null) =>
  value ? dayjs(value).format('YY.MM.DD') : null;

/** 카드 아래 "진행기간 25.02.15 ~ 25.02.28". 기간이 없으면 null */
export const getPeriodText = (target: ProgramCategoryTarget) => {
  const start = formatDate(target.startDate);
  const end = formatDate(target.endDate);
  if (!start) return null;
  return end ? `${start} ~ ${end}` : start;
};

/** 모집 마감 3일 이내면 "마감 임박" */
export const isClosingSoon = (target: ProgramCategoryTarget) => {
  if (!target.deadline) return false;
  const hours = dayjs(target.deadline).diff(dayjs(), 'hour');
  return hours >= 0 && hours <= 72;
};

/**
 * 챌린지 카드 제목. 기수와 버전 구분 없이 하나로 보이므로
 * 앞의 `[버전]` 과 뒤의 `N기 …` 를 뗀다 (예: "[인턴 Ver.] 포트폴리오 챌린지 58기" → "포트폴리오 챌린지")
 */
export const getChallengeDisplayTitle = (title: string) =>
  title
    .replace(/^(\s*\[[^\]]*\]\s*)+/, '')
    .replace(/\s*\d+기(\s.*)?$/, '')
    .trim() || title;

/** 49000 → "49,000원" */
export const formatPrice = (price?: number | null) =>
  price == null ? null : `${price.toLocaleString('ko-KR')}원`;

/** "11/17 마감 임박" 의 날짜 */
export const getDeadlineText = (target: ProgramCategoryTarget) =>
  target.deadline ? dayjs(target.deadline).format('M/D') : null;

/** 섹션의 대표 모양. 섹션 상품이 전부 한 유형일 때만 그 유형 전용 카드를 쓴다 */
export type SectionKind = 'challenge' | 'mentoring' | 'blog' | 'program';

const KIND_OF_DISPLAY: Partial<Record<SectionDisplayType, SectionKind>> = {
  FEATURED: 'challenge',
  MENTOR: 'mentoring',
  BLOG: 'blog',
};

/** 어드민에서 표시 방식을 정했으면 그대로, 자동·카드 목록이면 상품 유형으로 (카드 목록은 대표 카드 제외) */
export const getSectionKind = (
  targets: ProgramCategoryTarget[],
  displayType?: SectionDisplayType | null,
): SectionKind => {
  const fixed = displayType ? KIND_OF_DISPLAY[displayType] : undefined;
  if (fixed) return fixed;
  const types = new Set(targets.map((t) => t.targetType));
  if (types.size === 1) {
    // 카드 목록은 대표 카드로 바꾸지 않는다. 멘토링·블로그만 있으면 전용 카드는 쓴다
    if (types.has('CHALLENGE') && displayType !== 'CARDS') return 'challenge';
    if (types.has('LIVE_MENTORING')) return 'mentoring';
    if (types.has('BLOG')) return 'blog';
  }
  return 'program';
};

/**
 * 섹션 위 작은 라벨(탭 이름도 같다). 섹션에 담긴 유형을 이어 쓴다 (예: "LIVE · VOD 클래스").
 * 큰 카드 섹션은 대표 상품 유형만, 유형이 셋 이상 섞이면 "추천 프로그램"
 */
export const getSectionEyebrow = (
  targets: ProgramCategoryTarget[],
  kind?: SectionKind,
) => {
  if (kind === 'challenge' && targets[0])
    return TARGET_TYPE_LABEL[targets[0].targetType];
  const types = [...new Set(targets.map((t) => t.targetType))];
  if (types.length === 2 && types.includes('LIVE') && types.includes('VOD'))
    return 'LIVE · VOD 클래스';
  if (types.length > 2) return '추천 프로그램';
  return types.map((type) => TARGET_TYPE_LABEL[type]).join(' · ');
};
