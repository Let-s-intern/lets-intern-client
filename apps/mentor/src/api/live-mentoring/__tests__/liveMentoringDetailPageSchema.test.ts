import { describe, expect, it } from 'vitest';

import { liveMentoringTemplateSchema } from '../liveMentoringSchema';

/**
 * 상세 페이지 조회 응답(`GetLiveMentoringDetailPageResponseDto`) 계약 고정.
 *
 * 서버 응답은 프론트 템플릿 스키마보다 넓다 — `mentoring`·`currentOpening`·`faq`·
 * `process`·`reviewItems` 처럼 편집과 무관한 값이 함께 온다. 스키마가 필요한 폭만
 * 가져가고 나머지를 버리는지, 그리고 시안이 요구하는 필드(영상·결과 사례의
 * 제목·설명)가 실제로 파싱되는지 여기서 고정한다.
 */

/** 서버가 실제로 내려주는 형태. 편집과 무관한 키를 일부러 함께 담았다. */
const DETAIL_PAGE_RESPONSE = {
  mentoring: {
    liveMentoringId: 1,
    title: '자소서 실전 첨삭 멘토링',
    status: 'DRAFT',
    editable: true,
    categories: ['PERSONAL_STATEMENT'],
  },
  currentOpening: null,
  categories: ['PERSONAL_STATEMENT'],
  intro: {
    passedCount: null,
    nickname: '쥬디',
    profileImage: null,
    corpImage: null,
    oneLiner: '안녕하세요',
    description: '렛츠커리어 | CEO',
    careers: [],
    affiliation: '렛츠커리어 | CEO',
    careerLines: ['(현) 렛츠커리어 대표 멘토'],
  },
  hero: { bullets: ['이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'] },
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
    title: '쥬디 멘토는 이렇게 도와드려요',
    subtitle: '1:1 LIVE 멘토링, 영상으로 미리 확인하세요!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    caption: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
  },
  results: {
    visible: true,
    title: '혼자 해결하기 어려웠던 부분을 함께 완성해요',
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
  reviews: { visible: true, selectedReviewIds: [1, 2] },
  faq: [{ q: '질문', a: '답변' }],
  process: [{ step: 1, title: '신청', desc: '설명' }],
  reviewItems: [],
};

describe('상세 페이지 조회 응답 — 소개 영상 섹션', () => {
  it('서버가 내려주는 video.title·video.subtitle 이 파싱된다', () => {
    const parsed = liveMentoringTemplateSchema.parse(DETAIL_PAGE_RESPONSE);

    expect(parsed.video.title).toBe('쥬디 멘토는 이렇게 도와드려요');
    expect(parsed.video.subtitle).toBe(
      '1:1 LIVE 멘토링, 영상으로 미리 확인하세요!',
    );
    expect(parsed.video.videoUrl).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );
    expect(parsed.video.caption).toBe(
      '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    );
  });

  it('영상 제목·설명이 비어 있어도(서버 기본값 전) 파싱은 통과한다', () => {
    const parsed = liveMentoringTemplateSchema.parse({
      ...DETAIL_PAGE_RESPONSE,
      video: {
        visible: false,
        title: '',
        subtitle: '',
        videoUrl: null,
        caption: '',
      },
    });

    expect(parsed.video.title).toBe('');
    expect(parsed.video.visible).toBe(false);
  });
});

describe('상세 페이지 조회 응답 — 결과 사례 섹션', () => {
  it('서버가 내려주는 results.title·results.subtitle 이 파싱된다', () => {
    const parsed = liveMentoringTemplateSchema.parse(DETAIL_PAGE_RESPONSE);

    expect(parsed.results.title).toBe(
      '혼자 해결하기 어려웠던 부분을 함께 완성해요',
    );
    expect(parsed.results.subtitle).toBe('결과 사례');
    expect(parsed.results.cases).toHaveLength(1);
  });

  it('편집과 무관한 응답 필드(mentoring·faq·process·reviewItems)는 버린다', () => {
    const parsed = liveMentoringTemplateSchema.parse(DETAIL_PAGE_RESPONSE);

    expect(parsed).not.toHaveProperty('faq');
    expect(parsed).not.toHaveProperty('process');
    expect(parsed).not.toHaveProperty('reviewItems');
    expect(parsed).not.toHaveProperty('currentOpening');
  });
});
