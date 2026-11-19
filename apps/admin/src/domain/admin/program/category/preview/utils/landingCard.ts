import dayjs from '@/lib/dayjs';
import type { PublicCategoryTarget } from '../../hooks/usePublicCategoryTargets';
import type { ProgramCategoryDisplayType } from '../../programCategoryApi';

/**
 * 웹 카테고리 랜딩(apps/web/src/domain/category-landing/landingCard.ts)을 옮겨 왔다.
 * 앱끼리 import 하지 않으므로 그쪽이 바뀌면 여기도 맞춘다
 */

export const TARGET_TYPE_LABEL: Record<string, string> = {
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

/** "25.02.15 ~ 25.02.28". 기간이 없으면 null */
export const getPeriodText = (target: PublicCategoryTarget) => {
  const start = formatDate(target.startDate);
  const end = formatDate(target.endDate);
  if (!start) return null;
  return end ? `${start} ~ ${end}` : start;
};

/** 모집 마감 3일 이내면 "마감 임박" */
export const isClosingSoon = (target: PublicCategoryTarget, now = dayjs()) => {
  if (!target.deadline) return false;
  const hours = dayjs(target.deadline).diff(now, 'hour');
  return hours >= 0 && hours <= 72;
};

/** "[인턴 Ver.] 포트폴리오 챌린지 58기" → "포트폴리오 챌린지" */
export const getChallengeDisplayTitle = (title: string) =>
  title
    .replace(/^(\s*\[[^\]]*\]\s*)+/, '')
    .replace(/\s*\d+기(\s.*)?$/, '')
    .trim() || title;

export const formatPrice = (price?: number | null) =>
  price == null ? null : `${price.toLocaleString('ko-KR')}원`;

export const getDeadlineText = (target: PublicCategoryTarget) =>
  target.deadline ? dayjs(target.deadline).format('M/D') : null;

export type SectionKind = 'challenge' | 'mentoring' | 'blog' | 'program';

const KIND_OF_DISPLAY: Partial<
  Record<ProgramCategoryDisplayType, SectionKind>
> = {
  FEATURED: 'challenge',
  MENTOR: 'mentoring',
  BLOG: 'blog',
};

/**
 * 표시 방식을 정했으면 그대로, 자동·카드 목록이면 상품이 전부 한 유형일 때만 그 유형 모양.
 * 카드 목록은 대표 카드로 바꾸지 않는다 (웹 #2765)
 */
export const getSectionKind = (
  targets: { targetType?: string }[],
  displayType?: ProgramCategoryDisplayType | null,
): SectionKind => {
  const fixed = displayType ? KIND_OF_DISPLAY[displayType] : undefined;
  if (fixed) return fixed;
  const types = new Set(targets.map((t) => t.targetType));
  if (types.size === 1) {
    if (types.has('CHALLENGE') && displayType !== 'CARDS') return 'challenge';
    if (types.has('LIVE_MENTORING')) return 'mentoring';
    if (types.has('BLOG')) return 'blog';
  }
  return 'program';
};

/** 섹션 위 작은 라벨(탭 이름도 같다). 큰 카드는 대표 상품 유형만, 셋 이상 섞이면 "추천 프로그램" */
export const getSectionEyebrow = (
  targets: { targetType?: string }[],
  kind?: SectionKind,
) => {
  const label = (type?: string) => TARGET_TYPE_LABEL[type ?? ''] ?? type ?? '';
  if (kind === 'challenge' && targets[0]) return label(targets[0].targetType);
  const types = [...new Set(targets.map((t) => t.targetType))];
  if (types.length === 2 && types.includes('LIVE') && types.includes('VOD'))
    return 'LIVE · VOD 클래스';
  if (types.length > 2) return '추천 프로그램';
  return types.map(label).join(' · ');
};
