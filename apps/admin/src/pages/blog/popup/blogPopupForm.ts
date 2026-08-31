import { BlogPopupTargetType } from '@/api/blog/blogPopupSchema';

export interface BlogPopupFormValue {
  title: string;
  imageUrl: string;
  link: string;
  targetType: BlogPopupTargetType;
  blogIds: number[];
  triggerRatio: number;
  /** 1 ~ 99. null 이면 "없음" 이다. */
  priority: number | null;
  isVisible: boolean;
  startDate: string;
  endDate: string;
}

/** 서버 `BlogPopup.DEFAULT_TRIGGER_RATIO` 와 같은 값이다. */
export const DEFAULT_TRIGGER_RATIO = 1.0;

export const MIN_PRIORITY = 1;
export const MAX_PRIORITY = 99;

/** 드롭다운의 "없음". 목록에서도 같은 말을 쓴다. */
export const PRIORITY_NONE_LABEL = '없음';

/** 1 ~ 99. 매 렌더 다시 만들지 않도록 모듈에서 한 번만 만든다. */
export const PRIORITY_OPTIONS: readonly number[] = Array.from(
  { length: MAX_PRIORITY - MIN_PRIORITY + 1 },
  (_, index) => MIN_PRIORITY + index,
);

export const formatPriority = (priority?: number | null) =>
  priority == null ? PRIORITY_NONE_LABEL : String(priority);

export const EMPTY_BLOG_POPUP_FORM: BlogPopupFormValue = {
  title: '',
  imageUrl: '',
  link: '',
  targetType: 'ALL',
  blogIds: [],
  triggerRatio: DEFAULT_TRIGGER_RATIO,
  priority: null,
  isVisible: false,
  startDate: '',
  endDate: '',
};

/**
 * 채워지지 않은 필수값을 문구로 돌려준다. 통과하면 null 이다.
 * 링크 중복은 검사하지 않는다. 중복이 허용된 요구사항이다 (PRD R6).
 */
export function validateBlogPopupForm(value: BlogPopupFormValue) {
  if (!value.title.trim()) return '제목을 입력해주세요';
  if (!value.imageUrl) return '팝업 이미지를 업로드해주세요';
  if (!value.link.trim()) return '링크를 입력해주세요';
  if (!value.startDate) return '시작 일자를 선택해주세요';
  if (!value.endDate) return '종료 일자를 선택해주세요';
  if (value.targetType === 'SELECTED' && value.blogIds.length === 0) {
    return '노출할 글을 한 개 이상 선택해주세요';
  }
  return null;
}

/** `targetType` 이 ALL 이면 서버에 글 목록을 보내지 않는다. */
export function toBlogIdsPayload(value: BlogPopupFormValue) {
  return value.targetType === 'SELECTED' ? value.blogIds : [];
}
