import { describe, expect, it } from 'vitest';
import {
  cleanTitle,
  matchByKeywords,
  planAutoFill,
  suggestTags,
  tagsToAdd,
  type AutoTagRule,
} from './autoTag';

const rules: AutoTagRule[] = [
  { id: 1, title: '이력서', keywords: ['이력서'] },
  { id: 2, title: '자기소개서', keywords: ['자기소개서', '자소서'] },
  { id: 3, title: '포트폴리오', keywords: ['포트폴리오'] },
  { id: 4, title: '대기업', keywords: ['대기업', '공채'] },
  { id: 5, title: 'HR', keywords: ['HR', '인사'] },
  { id: 6, title: 'PM/PO', keywords: ['PM', 'PO', '기획'] },
  { id: 7, title: '경험정리', keywords: ['경험정리', '경험 정리'] },
  { id: 8, title: '면접', keywords: ['면접'] },
];

const titles = (input: Parameters<typeof suggestTags>[0]) =>
  suggestTags(input, rules).map((s) => s.tagTitle);

describe('cleanTitle', () => {
  it('기수·버전 표기를 뗀다', () => {
    expect(cleanTitle('[인턴 Ver.] 포트폴리오 챌린지 58기')).toBe(
      '포트폴리오 챌린지',
    );
    expect(cleanTitle('자소서 완성 챌린지 (대기업 버전) 3 기')).toBe(
      '자소서 완성 챌린지',
    );
  });
});

describe('suggestTags', () => {
  it('제목 키워드로 추천하고 이유를 단다', () => {
    const result = suggestTags({ title: '2주 안에 자소서 끝내기 12기' }, rules);
    expect(result).toEqual([
      { tagId: 2, tagTitle: '자기소개서', reasons: ["제목에 '자소서'"] },
    ]);
  });

  it('기수·버전 표기 안의 말은 잡지 않는다', () => {
    expect(titles({ title: '[대기업 Ver.] 면접 챌린지 5기' })).toEqual([
      '면접',
    ]);
  });

  it('띄어쓰기가 달라도 한글 키워드를 잡는다', () => {
    expect(titles({ title: '경험 정리 클래스' })).toEqual(['경험정리']);
    expect(titles({ title: '경험정리 클래스' })).toEqual(['경험정리']);
  });

  it('영문 키워드는 다른 영문자에 붙어 있으면 잡지 않는다', () => {
    expect(titles({ title: 'HR 직무 클래스' })).toEqual(['HR']);
    expect(titles({ title: 'HRD 담당자 특강' })).toEqual([]);
    expect(titles({ title: 'PM/PO 실무' })).toEqual(['PM/PO']);
    expect(titles({ title: 'PMP 자격증' })).toEqual([]);
  });

  it('챌린지 구분을 태그로 잇는다. 대기업 자소서는 두 태그', () => {
    const result = suggestTags(
      { title: '취업 챌린지', challengeType: 'PERSONAL_STATEMENT_LARGE_CORP' },
      rules,
    );
    expect(result.map((r) => [r.tagTitle, r.reasons])).toEqual([
      ['자기소개서', ['챌린지 구분: 대기업 자기소개서']],
      ['대기업', ['챌린지 구분: 대기업 자기소개서']],
    ]);
    expect(titles({ title: '챌린지', challengeType: 'CAREER_START' })).toEqual([
      '이력서',
    ]);
    expect(titles({ title: '챌린지', challengeType: 'ETC' })).toEqual([]);
  });

  it('제목과 구분이 같은 태그를 가리키면 이유를 모두 단다', () => {
    const [s] = suggestTags(
      { title: '이력서 챌린지 3기', challengeType: 'CAREER_START' },
      rules,
    );
    expect(s.reasons).toEqual(["제목에 '이력서'", '챌린지 구분: 이력서']);
  });

  it('블로그는 태그 이름으로 추천하고, 카테고리는 쓰지 않는다', () => {
    expect(
      titles({ title: '취준 이야기', blogTagNames: ['자소서', '취업팁'] }),
    ).toEqual(['자기소개서']);
    expect(titles({ title: '취준 이야기', blogTagNames: [] })).toEqual([]);
  });

  it('멘토링 분류를 태그로 잇는다', () => {
    expect(
      titles({
        title: '멘토링',
        mentoringCategories: ['RESUME', 'INTERVIEW', 'CAREER_COFFEE_CHAT'],
      }),
    ).toEqual(['이력서', '면접']);
  });

  it('더할 것만 고르고 있는 태그는 그대로 둔다', () => {
    const suggestions = suggestTags({ title: '이력서·자소서 클래스' }, rules);
    expect(tagsToAdd(suggestions, [1, 99]).map((s) => s.tagId)).toEqual([2]);
  });
});

describe('suggestTags 설명', () => {
  it('설명에만 있으면 설명 이유로 추천하고 설명으로만 잡혔다고 표시한다', () => {
    expect(
      suggestTags(
        { title: '취업 준비 클래스', description: '자소서 첨삭까지 한 번에' },
        rules,
      ),
    ).toEqual([
      {
        tagId: 2,
        tagTitle: '자기소개서',
        reasons: ["설명에 '자소서'"],
        descriptionOnly: true,
      },
    ]);
  });

  it('제목과 설명 둘 다 잡히면 이유가 둘이고 설명으로만은 아니다', () => {
    const [suggestion] = suggestTags(
      { title: '자소서 챌린지', description: '자소서 완성' },
      rules,
    );
    expect(suggestion.reasons).toEqual(["제목에 '자소서'", "설명에 '자소서'"]);
    expect(suggestion.descriptionOnly).toBeFalsy();
  });

  it('설명으로 잡힌 태그에 챌린지 구분 이유가 있으면 설명으로만은 아니다', () => {
    const [suggestion] = suggestTags(
      {
        title: '취업 챌린지',
        description: '이력서를 만들어요',
        challengeType: 'CAREER_START',
      },
      rules,
    );
    expect(suggestion.reasons).toEqual([
      "설명에 '이력서'",
      '챌린지 구분: 이력서',
    ]);
    expect(suggestion.descriptionOnly).toBeFalsy();
  });

  it('블로그 태그·멘토링 분류 이유가 있어도 설명으로만은 아니다', () => {
    expect(
      suggestTags(
        {
          title: '글',
          description: '면접 후기',
          blogTagNames: ['면접'],
        },
        rules,
      )[0].descriptionOnly,
    ).toBeFalsy();
    expect(
      suggestTags(
        {
          title: '멘토링',
          description: '면접 연습',
          mentoringCategories: ['INTERVIEW'],
        },
        rules,
      )[0].descriptionOnly,
    ).toBeFalsy();
  });

  it('설명에는 기수·버전 표기를 떼지 않는다', () => {
    expect(
      titles({ title: '클래스', description: '[대기업 Ver.] 안내' }),
    ).toEqual(['대기업']);
  });

  it('설명에도 영문 키워드 경계 규칙이 적용된다', () => {
    expect(titles({ title: '클래스', description: 'HRD 담당자용' })).toEqual(
      [],
    );
    expect(titles({ title: '클래스', description: 'HR 직무 소개' })).toEqual([
      'HR',
    ]);
  });

  it('설명이 비었거나 null 이면 제목만 본 결과와 같다', () => {
    const base = suggestTags({ title: '2주 안에 자소서 끝내기' }, rules);
    expect(
      suggestTags(
        { title: '2주 안에 자소서 끝내기', description: null },
        rules,
      ),
    ).toEqual(base);
    expect(
      suggestTags({ title: '2주 안에 자소서 끝내기', description: '' }, rules),
    ).toEqual(base);
  });
});

describe('planAutoFill', () => {
  const products = [
    { key: 'a', input: { title: '이력서 챌린지 3기' } },
    { key: 'b', input: { title: '자소서·이력서 클래스' } },
    { key: 'c', input: { title: '네트워킹 특강' } },
  ];
  it('더할 태그만 고르고, 이미 다 있거나 추천이 없는 상품은 뺀다', () => {
    const current: Record<string, number[]> = { a: [1], b: [1], c: [] };
    const plan = planAutoFill(products, rules, (p) => current[p.key]);
    expect(
      plan.map((r) => [r.product.key, r.adds.map((s) => s.tagId)]),
    ).toEqual([['b', [2]]]);
  });

  it('키워드 미리보기는 그 키워드로 제목이 잡히는 상품만 센다', () => {
    expect(matchByKeywords(products, ['자소서']).map((p) => p.key)).toEqual([
      'b',
    ]);
    expect(matchByKeywords(products, []).length).toBe(0);
  });
});
