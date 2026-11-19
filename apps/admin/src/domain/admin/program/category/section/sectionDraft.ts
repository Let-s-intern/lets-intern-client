import {
  cardStyleOf,
  displayTypeOfStyle,
  type CardStyle,
} from '../constants/cardStyle';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryMatchMode,
  type ProgramCategorySection,
  type ProgramCategorySectionInput,
} from '../programCategoryApi';

/** 화면에서 고치는 섹션. key 는 저장 전 목록 key 용 */
export interface SectionDraft extends ProgramCategorySectionInput {
  key: string;
}

let seq = 0;
const nextKey = () => `new-${++seq}`;

export const fromSection = (s: ProgramCategorySection): SectionDraft => ({
  key: `s-${s.id}`,
  title: s.title,
  description: s.description ?? '',
  // 예전 값(AUTO·MENTOR·BLOG)도 그대로 둔다. 카드 모양을 바꿀 때만 바뀐다
  displayType: s.displayType ?? 'AUTO',
  matchMode: s.matchMode === 'ALL' ? 'ALL' : 'ANY',
  tagIds: s.tagIds,
  targetTypes: s.targetTypes,
  pinnedTargetType: s.pinnedTargetType ?? null,
  pinnedTargetId: s.pinnedTargetId ?? null,
  isVisible: s.isVisible,
  targetList: (s.targetList ?? []).map(({ targetType, targetId }) => ({
    targetType,
    targetId,
  })),
});

/** 새 섹션. 조건은 이 페이지 분류 하나, 유형은 비움(모든 유형) */
export const newSection = (tagId: number): SectionDraft => ({
  key: nextKey(),
  title: '새 섹션',
  description: '',
  displayType: 'CARDS',
  matchMode: 'ALL',
  tagIds: [tagId],
  targetTypes: [],
  pinnedTargetType: null,
  pinnedTargetId: null,
  isVisible: true,
  targetList: [],
});

export const withCardStyle = (
  d: SectionDraft,
  style: CardStyle,
): SectionDraft =>
  cardStyleOf(d.displayType) === style
    ? d
    : {
        ...d,
        displayType: displayTypeOfStyle(style),
        // 큰 카드가 아니면 고정 상품은 의미가 없다
        ...(style === 'FEATURED'
          ? {}
          : { pinnedTargetType: null, pinnedTargetId: null }),
      };

/** 요청 모양. 큰 카드가 아니면 고정 상품을 비운다 */
export const toSectionInput = ({
  key: _key,
  ...d
}: SectionDraft): ProgramCategorySectionInput => ({
  ...d,
  title: d.title.trim(),
  pinnedTargetType: d.displayType === 'FEATURED' ? d.pinnedTargetType : null,
  pinnedTargetId: d.displayType === 'FEATURED' ? d.pinnedTargetId : null,
});

export const sectionError = (d: SectionDraft) => {
  if (!d.title.trim()) return '섹션 제목을 넣어 주세요';
  if (d.tagIds.length === 0 && d.targetList.length === 0)
    return '태그 조건이나 직접 고른 상품을 하나 이상 넣어 주세요';
  return undefined;
};

export const MATCH_LABEL: Record<ProgramCategoryMatchMode, string> = {
  ALL: '모두 해당',
  ANY: '하나라도 해당',
};

/**
 * 조건을 한 줄로. 예: "포트폴리오 · 챌린지", "자기소개서 또는 포트폴리오 · VOD", "이력서 그리고 HR · 모든 유형"
 */
export const describeCondition = (
  d: Pick<SectionDraft, 'tagIds' | 'matchMode' | 'targetTypes'>,
  tagTitleOf: (id: number) => string,
) => {
  if (d.tagIds.length === 0) return '태그 조건 없음';
  const joiner = d.matchMode === 'ALL' ? ' 그리고 ' : ' 또는 ';
  const tags = d.tagIds.map(tagTitleOf).join(joiner);
  const types =
    d.targetTypes.length > 0
      ? d.targetTypes.map((t) => programCategoryTargetTypeLabel[t]).join('·')
      : '모든 유형';
  return `${tags} · ${types}`;
};

export const moveItem = <T>(list: T[], index: number, direction: -1 | 1) => {
  const next = [...list];
  [next[index], next[index + direction]] = [
    next[index + direction],
    next[index],
  ];
  return next;
};
