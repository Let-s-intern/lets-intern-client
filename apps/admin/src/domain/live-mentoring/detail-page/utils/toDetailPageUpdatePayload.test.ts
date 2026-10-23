import { describe, expect, it } from 'vitest';

import type { AdminLiveMentoringDetailPageUpdate } from '@/api/live-mentoring/liveMentoringDetailPageSchema';

import {
  findDetailPageBlock,
  toDetailPageForm,
  toDetailPageUpdatePayload,
  toYoutubeEmbedUrl,
} from './toDetailPageUpdatePayload';

const EMBED = 'https://www.youtube.com/embed/rlmvx1Ayg0s';

const base = (): AdminLiveMentoringDetailPageUpdate => ({
  hero: { bullets: ['첫 불릿'] },
  mentoringTypes: {
    title: '유형 제목',
    subtitle: '유형 부제',
    items: [
      {
        typeName: '자소서',
        title: '카드',
        description: '설명',
        tags: ['태그'],
      },
    ],
  },
  strategy: {
    visible: true,
    title: '전략',
    subtitle: '전략 부제',
    points: [{ image: null, title: '포인트', description: '설명' }],
  },
  video: {
    visible: true,
    title: '영상',
    subtitle: '영상 부제',
    videoUrl: EMBED,
    caption: '캡션',
  },
  results: {
    visible: true,
    title: '결과',
    subtitle: '결과',
    cases: [
      {
        beforeImage: null,
        afterImage: null,
        beforeCaption: '전',
        afterCaption: '후',
      },
    ],
  },
  reviews: { visible: true, selectedReviewIds: [3] },
  freeContent: {
    visible: true,
    content: '{"root":{}}',
    position: 'AFTER_STRATEGY',
  },
});

describe('toYoutubeEmbedUrl', () => {
  it('공유·watch·shorts 주소를 embed 로 바꾼다', () => {
    expect(toYoutubeEmbedUrl('https://youtu.be/rlmvx1Ayg0s?si=abc')).toBe(
      EMBED,
    );
    expect(
      toYoutubeEmbedUrl('https://www.youtube.com/watch?v=rlmvx1Ayg0s&t=10s'),
    ).toBe(EMBED);
    expect(toYoutubeEmbedUrl('https://m.youtube.com/shorts/rlmvx1Ayg0s')).toBe(
      EMBED,
    );
  });

  it('YouTube 가 아니면 null', () => {
    expect(toYoutubeEmbedUrl('https://vimeo.com/123')).toBeNull();
    expect(toYoutubeEmbedUrl('영상')).toBeNull();
  });
});

describe('toDetailPageUpdatePayload', () => {
  it('빈 히어로 불릿을 빼고 앞뒤 공백을 다듬는다', () => {
    const form = base();
    form.hero.bullets = [' 하나 ', '', '   ', '둘'];
    expect(toDetailPageUpdatePayload(form).hero.bullets).toEqual([
      '하나',
      '둘',
    ]);
  });

  it('반쯤 채운 유형 카드·Point·결과 사례를 뺀다', () => {
    const form = base();
    form.mentoringTypes.items.push({
      typeName: '이력서',
      title: '',
      description: '설명',
      tags: [],
    });
    form.strategy.points.push({
      image: null,
      title: '제목만',
      description: '',
    });
    form.results.cases.push({
      beforeImage: null,
      afterImage: null,
      beforeCaption: '전만',
      afterCaption: ' ',
    });

    const payload = toDetailPageUpdatePayload(form);
    expect(payload.mentoringTypes.items).toHaveLength(1);
    expect(payload.strategy.points).toHaveLength(1);
    expect(payload.results.cases).toHaveLength(1);
  });

  it('일반 YouTube 주소를 embed 로 바꾼다', () => {
    const form = base();
    form.video.videoUrl = 'https://youtu.be/rlmvx1Ayg0s?si=abc';
    expect(toDetailPageUpdatePayload(form).video.videoUrl).toBe(EMBED);
  });

  it('빈 영상 주소는 null 로 보낸다', () => {
    const form = base();
    form.video.videoUrl = '  ';
    expect(toDetailPageUpdatePayload(form).video.videoUrl).toBeNull();
  });

  it('꺼 둔 섹션의 빈 제목은 지어낸 문구로 채우지 않는다', () => {
    const form = base();
    form.strategy.visible = false;
    form.strategy.title = '';
    expect(toDetailPageUpdatePayload(form).strategy.title).toBe('');
  });

  it('자유 입력란은 항상 함께 보낸다', () => {
    expect(toDetailPageUpdatePayload(base()).freeContent).toEqual({
      visible: true,
      content: '{"root":{}}',
      position: 'AFTER_STRATEGY',
    });
  });

  it('후기 선택 목록은 그대로 돌려보낸다', () => {
    expect(toDetailPageUpdatePayload(base()).reviews).toEqual({
      visible: true,
      selectedReviewIds: [3],
    });
  });
});

describe('findDetailPageBlock', () => {
  it('다 채웠으면 null', () => {
    expect(findDetailPageBlock(base())).toBeNull();
  });

  it('멘토링 유형 제목이 비면 막는다', () => {
    const form = base();
    form.mentoringTypes.title = ' ';
    expect(findDetailPageBlock(form)).toContain('멘토링 유형');
  });

  it('켜 둔 섹션의 빈 칸은 막고, 꺼 둔 섹션은 통과시킨다', () => {
    const form = base();
    form.video.caption = '';
    expect(findDetailPageBlock(form)).toContain('소개 영상');
    form.video.visible = false;
    expect(findDetailPageBlock(form)).toBeNull();
  });

  it('켜 둔 영상의 주소가 YouTube 가 아니면 막는다', () => {
    const form = base();
    form.video.videoUrl = 'https://vimeo.com/123';
    expect(findDetailPageBlock(form)).toContain('YouTube');
  });
});

describe('toDetailPageForm', () => {
  it('자유 입력란이 없는 응답은 꺼진 빈 입력란·기본 위치로 채운다', () => {
    const { freeContent: _, ...withoutFreeContent } = base();
    expect(toDetailPageForm(withoutFreeContent).freeContent).toEqual({
      visible: false,
      content: null,
      position: 'AFTER_MENTORING_TYPES',
    });
  });

  it('위치가 null 이면 기본 위치로, 나머지는 응답 값을 쓴다', () => {
    const form = toDetailPageForm({
      ...base(),
      freeContent: { visible: true, content: 'X', position: null },
    });
    expect(form.freeContent).toEqual({
      visible: true,
      content: 'X',
      position: 'AFTER_MENTORING_TYPES',
    });
  });

  it('읽기 전용 값은 폼에 넣지 않는다', () => {
    const form = toDetailPageForm({ ...base(), intro: { nickname: '멘토' } });
    expect(form).not.toHaveProperty('intro');
  });
});
