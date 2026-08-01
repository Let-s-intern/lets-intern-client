import { describe, expect, it } from 'vitest';

import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { findBlankRequiredFields, toTemplatePayload } from '../templatePayload';

/** 서버 검증을 모두 통과하는 최소 템플릿. */
const makeTemplate = (): LiveMentoringTemplate => ({
  mentoring: {
    liveMentoringId: 1,
    title: '자기소개서 첨삭 멘토링',
    status: 'DRAFT',
    editable: true,
    category: 'PERSONAL_STATEMENT',
  },
  currentOpening: null,
  category: 'PERSONAL_STATEMENT',
  hero: { bullets: ['이력서 첨삭'] },
  intro: {
    passedCount: 300,
    profileImage: null,
    affiliation: '렛츠커리어 | CEO',
    careerLines: ['(현) 렛츠커리어 대표 멘토'],
    oneLiner: '안녕하세요',
  },
  mentoringTypes: {
    title: '이런 도움을 받을 수 있어요',
    subtitle: '고민에 맞는 유형을 골라보세요.',
    items: [
      {
        typeName: '자기소개서 피드백',
        title: '자기소개서를 다듬고 싶다면',
        description: '문항 의도에 맞게 점검해요.',
        tags: ['문항 분석'],
      },
    ],
  },
  strategy: {
    visible: true,
    title: '취업 성공 전략',
    subtitle: '멘토링을 통해 다 알려드립니다.',
    points: [{ image: null, title: '핵심 키워드', description: '설명' }],
  },
  video: {
    visible: true,
    title: '이렇게 도와드려요',
    subtitle: '영상으로 미리 확인하세요!',
    videoUrl: null,
    caption: '서류 완성도 UP!',
  },
  results: {
    visible: true,
    title: '함께 완성해요',
    subtitle: '결과 사례',
    cases: [
      {
        beforeImage: null,
        afterImage: null,
        beforeCaption: '추상적인 지원동기',
        afterCaption: '경험 연결',
      },
    ],
  },
  reviews: { visible: true, selectedReviewIds: [1] },
});

describe('toTemplatePayload — nullable 필드 정규화', () => {
  it('이미지·영상을 넣지 않으면 빈 문자열이 아니라 null 로 보낸다', () => {
    const template = makeTemplate();
    template.strategy.points[0].image = '';
    template.results.cases[0].beforeImage = '';
    template.results.cases[0].afterImage = '   ';
    template.video.videoUrl = '';

    const payload = toTemplatePayload(template);

    expect(payload.strategy.points[0].image).toBeNull();
    expect(payload.results.cases[0].beforeImage).toBeNull();
    expect(payload.results.cases[0].afterImage).toBeNull();
    expect(payload.video.videoUrl).toBeNull();
  });

  it('값이 있으면 앞뒤 공백만 털고 그대로 둔다', () => {
    const template = makeTemplate();
    template.strategy.points[0].image = ' https://cdn.test/a.png ';
    template.video.videoUrl = ' https://www.youtube.com/embed/abc ';

    const payload = toTemplatePayload(template);

    expect(payload.strategy.points[0].image).toBe('https://cdn.test/a.png');
    expect(payload.video.videoUrl).toBe('https://www.youtube.com/embed/abc');
  });

  it('원본 템플릿을 변형하지 않는다', () => {
    const template = makeTemplate();
    template.video.videoUrl = '';

    toTemplatePayload(template);

    expect(template.video.videoUrl).toBe('');
  });
});

describe('findBlankRequiredFields — @NotBlank 검사', () => {
  it('모두 채워져 있으면 빈 목록이다', () => {
    expect(findBlankRequiredFields(makeTemplate())).toEqual([]);
  });

  it('공백만 남은 필수 문자열을 섹션·항목 이름으로 알린다', () => {
    const template = makeTemplate();
    template.hero.bullets[0] = '   ';
    template.mentoringTypes.items[0].typeName = '';
    template.strategy.points[0].description = ' ';
    template.results.cases[0].afterCaption = '';

    expect(findBlankRequiredFields(template)).toEqual([
      '히어로 · 소개 불릿 1번',
      '멘토링 유형 · 유형 카드 1번 유형명',
      '취업 성공 전략 · Point 1번 설명',
      '결과 사례 · Before / After 1번 After 설명',
    ]);
  });

  it('노출 토글을 꺼도 검사에서 빼지 않는다 — 서버 검증은 visible 과 무관하다', () => {
    const template = makeTemplate();
    template.strategy.visible = false;
    template.strategy.title = '';

    expect(findBlankRequiredFields(template)).toEqual([
      '취업 성공 전략 · 섹션 제목',
    ]);
  });
});
