/**
 * 자동 태그 추천. 상품 제목·유형별 정보·태그 키워드로 붙일 만한 태그와 이유를 낸다.
 * 어드민 화면(상품 수정, 점검 일괄 채우기, 키워드 미리보기)에서 쓰는 순수 함수다. 저장은 하지 않는다
 */

export interface AutoTagInput {
  title: string;
  /** 한 줄 설명 */
  description?: string | null;
  /** 챌린지 구분 (마그넷도 챌린지 구분을 가진다) */
  challengeType?: string | null;
  /** 블로그 태그 이름들 (예: 자소서). 블로그 카테고리는 태그와 바로 이어지지 않아 쓰지 않는다 */
  blogTagNames?: string[];
  /** 1:1 LIVE 멘토링 분류 */
  mentoringCategories?: string[];
}

export interface AutoTagRule {
  id: number;
  title: string;
  keywords: string[];
}

export interface TagSuggestion {
  tagId: number;
  tagTitle: string;
  reasons: string[];
}

/** 챌린지 구분 → 태그 이름 */
export const CHALLENGE_TYPE_TAGS: Record<string, string[]> = {
  EXPERIENCE_SUMMARY: ['경험정리'],
  CAREER_START: ['이력서'],
  PERSONAL_STATEMENT: ['자기소개서'],
  PORTFOLIO: ['포트폴리오'],
  PERSONAL_STATEMENT_LARGE_CORP: ['대기업', '자기소개서'],
  APTITUDE: ['인적성'],
  MEETING_PREPARATION: ['면접'],
  HR: ['HR'],
  MARKETING: ['마케팅'],
  PM: ['PM/PO'],
};

export const CHALLENGE_TYPE_LABEL: Record<string, string> = {
  EXPERIENCE_SUMMARY: '경험정리',
  CAREER_START: '이력서',
  PERSONAL_STATEMENT: '자기소개서',
  PORTFOLIO: '포트폴리오',
  PERSONAL_STATEMENT_LARGE_CORP: '대기업 자기소개서',
  APTITUDE: '인적성',
  MEETING_PREPARATION: '면접',
  HR: 'HR',
  MARKETING: '마케팅',
  PM: 'PM',
};

/** 1:1 LIVE 멘토링 분류 → 태그 이름 */
export const MENTORING_CATEGORY_TAGS: Record<string, string[]> = {
  RESUME: ['이력서'],
  PERSONAL_STATEMENT: ['자기소개서'],
  PORTFOLIO: ['포트폴리오'],
  INTERVIEW: ['면접'],
  EXPERIENCE: ['경험정리'],
};

/**
 * 기수·버전 표기를 뗀 제목. "[인턴 Ver.] 포트폴리오 챌린지 58기" → "포트폴리오 챌린지".
 * "Ver." 안의 말이 키워드로 잡히지 않게 한다
 */
export const cleanTitle = (title: string) =>
  title
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*(기|ver\.?|버전)[^)]*\)/gi, ' ')
    .replace(/\d+\s*기/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** 영문 키워드(HR, PM, NCS …)는 다른 영문자에 붙어 있으면 잡지 않는다. 한글은 포함이면 잡는다 */
const containsKeyword = (text: string, keyword: string) => {
  const k = keyword.trim();
  if (!k) return false;
  if (/^[A-Za-z0-9/]+$/.test(k)) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    return new RegExp(`(^|[^A-Za-z])${escaped}($|[^A-Za-z])`, 'i').test(text);
  }
  return text.replace(/\s+/g, '').includes(k.replace(/\s+/g, ''));
};

/** 붙일 만한 태그와 이유. 이유가 여러 개면 모두 담는다. 태그 순서는 rules 순서 */
export const suggestTags = (
  input: AutoTagInput,
  rules: AutoTagRule[],
): TagSuggestion[] => {
  const title = cleanTitle(input.title ?? '');
  const reasonsByTag = new Map<number, string[]>();
  const add = (tagId: number, reason: string) => {
    const list = reasonsByTag.get(tagId) ?? [];
    if (!list.includes(reason)) list.push(reason);
    reasonsByTag.set(tagId, list);
  };
  const byTitle = (name: string) => rules.filter((r) => r.title === name);

  rules.forEach((rule) => {
    rule.keywords.forEach((k) => {
      if (containsKeyword(title, k)) add(rule.id, `제목에 '${k.trim()}'`);
      (input.blogTagNames ?? []).forEach((tagName) => {
        if (containsKeyword(tagName, k))
          add(rule.id, `블로그 태그 '${tagName}'`);
      });
    });
  });

  if (input.challengeType)
    (CHALLENGE_TYPE_TAGS[input.challengeType] ?? []).forEach((name) =>
      byTitle(name).forEach((r) =>
        add(
          r.id,
          `챌린지 구분: ${CHALLENGE_TYPE_LABEL[input.challengeType as string] ?? input.challengeType}`,
        ),
      ),
    );

  (input.mentoringCategories ?? []).forEach((category) =>
    (MENTORING_CATEGORY_TAGS[category] ?? []).forEach((name) =>
      byTitle(name).forEach((r) => add(r.id, `멘토링 분류: ${name}`)),
    ),
  );

  return rules
    .filter((r) => reasonsByTag.has(r.id))
    .map((r) => ({
      tagId: r.id,
      tagTitle: r.title,
      reasons: reasonsByTag.get(r.id)!,
    }));
};

/** 이미 붙은 태그는 빼고 더할 것만. 있는 태그는 절대 빼지 않는다 */
export const tagsToAdd = (suggestions: TagSuggestion[], current: number[]) =>
  suggestions.filter((s) => !current.includes(s.tagId));

export interface AutoFillRow<P> {
  product: P;
  adds: TagSuggestion[];
}

/**
 * 일괄 채우기 계획: 상품마다 추천 중 아직 없는 태그만. 더할 게 없는 상품은 뺀다.
 * currentOf 는 그 상품에 지금 붙은 태그 id
 */
export const planAutoFill = <P extends { input: AutoTagInput }>(
  products: P[],
  rules: AutoTagRule[],
  currentOf: (product: P) => number[],
): AutoFillRow<P>[] =>
  products
    .map((product) => ({
      product,
      adds: tagsToAdd(suggestTags(product.input, rules), currentOf(product)),
    }))
    .filter((row) => row.adds.length > 0);

/** 키워드 미리보기: 이 키워드만으로 제목에서 잡히는 상품 */
export const matchByKeywords = <P extends { input: AutoTagInput }>(
  products: P[],
  keywords: string[],
) =>
  products.filter(
    (p) =>
      suggestTags(
        { title: p.input.title, blogTagNames: p.input.blogTagNames },
        [{ id: -1, title: '', keywords }],
      ).length > 0,
  );
