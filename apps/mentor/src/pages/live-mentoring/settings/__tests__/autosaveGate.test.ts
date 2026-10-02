import { describe, expect, it } from 'vitest';

import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { describeAutosaveBlock } from '../autosaveGate';

/**
 * 실시간 저장은 타이핑 도중에 계속 나간다. 반쯤 채운 카드가 있는 순간에 보내면
 * 서버가 400 을 주므로, 보내기 전에 여기서 걸러 "무엇을 채우면 되는지"만 남긴다.
 */
const base = (): LiveMentoringTemplate => ({
  categories: ['PERSONAL_STATEMENT'],
  hero: { bullets: ['이력서·자기소개서 첨삭'] },
  intro: {
    passedCount: 0,
    nickname: '쥬디',
    profileImage: null,
    affiliation: null,
    careerLines: [],
    oneLiner: null,
    description: null,
  },
  mentoringTypes: {
    title: '이런 도움을 받을 수 있어요',
    subtitle: '고민에 맞는 유형을 골라보세요.',
    items: [
      {
        typeName: '자기소개서 피드백',
        title: '자기소개서를 다듬고 싶다면',
        description: '문항 의도에 맞게 점검해요.',
        tags: [],
      },
    ],
  },
  strategy: {
    visible: true,
    title: '취업 성공 전략',
    subtitle: '멘토링으로 알려드려요.',
    points: [{ image: null, title: '핵심 키워드', description: '설명' }],
  },
  video: {
    visible: true,
    title: '이렇게 도와드려요',
    subtitle: '영상으로 확인하세요.',
    videoUrl: 'https://www.youtube.com/embed/abc',
    caption: '서류 완성도 UP',
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
  reviews: { visible: true, selectedReviewIds: [] },
});

describe('describeAutosaveBlock', () => {
  it('다 채워졌으면 막지 않는다', () => {
    expect(describeAutosaveBlock(base())).toBeNull();
  });

  /*
   * 반쯤 채운 반복 항목은 보낼 때 빠진다(`saveTemplate`). 저장 자체를 막으면 카드
   * 하나가 다른 탭에서 쓴 글까지 볼모로 잡는다 (LC-3343).
   */
  it('반쯤 채운 유형 카드는 저장을 막지 않는다', () => {
    const template = base();
    template.mentoringTypes.items.push({
      typeName: '이력서 피드백',
      title: '',
      description: '',
      tags: [],
    });
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  it('갓 추가한 빈 Point 는 저장을 막지 않는다', () => {
    const template = base();
    template.strategy.points.push({ image: null, title: '', description: '' });
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  /*
   * 반쯤 채운 사례는 보낼 때 빠진다(`saveTemplate`). 저장 자체를 막으면 카드 하나가
   * 다른 탭에서 쓴 글까지 볼모로 잡는다 (LC-3343).
   */
  it('갓 추가한 빈 결과 사례는 저장을 막지 않는다', () => {
    const template = base();
    template.results.cases.push({
      beforeImage: null,
      afterImage: null,
      beforeCaption: '',
      afterCaption: '',
    });
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  /* 결과 사례의 섹션 설명은 편집 폼에 입력이 없다. 요구하면 채울 방법이 없다 (LC-3343). */
  it('결과 사례의 섹션 설명이 비어도 막지 않는다', () => {
    const template = base();
    template.results.subtitle = '';
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  /*
    숨긴 섹션은 막지 않는다. 서버 `@NotBlank` 가 `visible` 을 보지 않아 빈 칸이면
    400 이지만, 화면이 숨긴 섹션의 입력을 잠그므로 여기서 막으면 멘토가 채울 방법이
    없는 덫이 된다. 서버도 `visible` 이 꺼진 섹션은 검사하지 않는다 (LC-3289).
  */
  it('숨긴 섹션의 빈 칸은 막지 않는다', () => {
    const template = base();
    template.video.visible = false;
    template.video.caption = '   ';
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  it('켜진 섹션의 빈 칸은 그대로 막는다', () => {
    const template = base();
    template.video.visible = true;
    template.video.caption = '   ';
    expect(describeAutosaveBlock(template)).toBe(
      '「소개 영상」의 영상 안내 문구를 채우면 저장돼요',
    );
  });

  it('YouTube 로 바꿀 수 없는 영상 주소는 실패가 아니라 대기로 다룬다', () => {
    const template = base();
    template.video.videoUrl = 'https://vimeo.com/123';
    expect(describeAutosaveBlock(template)).toBe(
      '「소개 영상」의 영상 주소를 YouTube 주소로 고치면 저장돼요',
    );
  });

  /* LC-3311 — 끈 섹션의 주소는 보낼 때 비우므로 막지 않는다. 입력이 잠겨 고칠 수 없다. */
  it('숨긴 섹션의 YouTube 가 아닌 주소는 막지 않는다', () => {
    const template = base();
    template.video.visible = false;
    template.video.videoUrl = 'https://vimeo.com/123';
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  it('영상 주소는 비워 둘 수 있다', () => {
    const template = base();
    template.video.videoUrl = '';
    expect(describeAutosaveBlock(template)).toBeNull();
  });

  /* 빈 줄은 보낼 때 걸러내므로 막지 않는다 — 줄 하나는 지워져도 다시 만들기 쉽다. */
  it('핵심 소개의 빈 줄은 막지 않고, 길이 초과만 막는다', () => {
    const template = base();
    template.hero.bullets.push('');
    expect(describeAutosaveBlock(template)).toBeNull();

    template.hero.bullets[1] = 'ㄱ'.repeat(501);
    expect(describeAutosaveBlock(template)).toBe(
      '「핵심 소개」의 2번 소개 문구를 500자 이내로 줄이면 저장돼요',
    );
  });

  it('섹션 제목·설명이 비면 그 섹션 이름과 함께 알린다', () => {
    const template = base();
    template.strategy.subtitle = '';
    expect(describeAutosaveBlock(template)).toBe(
      '「취업 성공 전략」의 섹션 설명을 채우면 저장돼요',
    );
  });

  /*
    서버 `StrategyRequest.title` 과 `StrategyPointRequest.title` 은 `@Size(max = 255)` 다.
    게이트가 길이를 안 보면 보내서 400 을 받는데, 자동 저장은 실패해도 값이 그대로면
    다시 시도하지 않아 멘토가 더 치기 전까지 저장이 멈춘다.
  */
  it('취업 성공 전략의 섹션 제목이 255자를 넘으면 줄이라고 알린다', () => {
    const template = base();
    template.strategy.title = 'ㄱ'.repeat(256);
    expect(describeAutosaveBlock(template)).toBe(
      '「취업 성공 전략」의 섹션 제목을 255자 이내로 줄이면 저장돼요',
    );
  });

  it('Point 제목이 255자를 넘어도 잡는다', () => {
    const template = base();
    template.strategy.points[0].title = 'ㄱ'.repeat(256);
    expect(describeAutosaveBlock(template)).toBe(
      '「취업 성공 전략」의 1번 Point 제목을 255자 이내로 줄이면 저장돼요',
    );
  });

  /* 숨긴 섹션은 길이도 보지 않는다 — 보낼 때 기본 문구로 갈아끼우기 때문이다. */
  it('숨긴 섹션은 길이도 검사하지 않는다', () => {
    const template = base();
    template.strategy.visible = false;
    template.strategy.title = 'ㄱ'.repeat(256);
    expect(describeAutosaveBlock(template)).toBeNull();
  });
});
