import { describe, expect, it } from 'vitest';

import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { SETTINGS_TABS, unlockedSettingsTabs } from '../tabs';

/**
 * 첫 세팅 화면은 필수 스텝을 하나씩 연다. 판정이 템플릿 내용에 걸려 있으므로 픽스처는
 * **비어 있는 상태에서 시작**해 하나씩 채워 가며 확인한다.
 */
const empty = (): LiveMentoringTemplate => ({
  categories: ['PERSONAL_STATEMENT'],
  hero: { bullets: [] },
  intro: {
    passedCount: 0,
    nickname: null,
    profileImage: null,
    affiliation: null,
    careerLines: [],
    oneLiner: null,
    description: null,
  },
  mentoringTypes: { title: null, subtitle: null, items: [] },
  strategy: { visible: false, title: null, subtitle: null, points: [] },
  video: {
    visible: false,
    title: null,
    subtitle: null,
    videoUrl: null,
    caption: null,
  },
  results: { visible: false, title: null, subtitle: null, cases: [] },
  reviews: { visible: false, selectedReviewIds: [] },
});

const ids = (tabs: readonly { id: string }[]) => tabs.map((tab) => tab.id);

describe('unlockedSettingsTabs', () => {
  it('개설 이력이 있으면 점진 노출을 하지 않는다', () => {
    expect(
      ids(
        unlockedSettingsTabs({
          hasOpened: true,
          template: empty(),
          reachedIndex: 0,
        }),
      ),
    ).toEqual(ids(SETTINGS_TABS));
  });

  it('상품이 없으면 오픈 설정만 연다', () => {
    expect(
      ids(
        unlockedSettingsTabs({
          hasOpened: false,
          template: null,
          reachedIndex: 3,
        }),
      ),
    ).toEqual(['open']);
  });

  it('오픈 설정을 저장하면 핵심 소개까지 열린다', () => {
    expect(
      ids(
        unlockedSettingsTabs({
          hasOpened: false,
          template: empty(),
          reachedIndex: 0,
        }),
      ),
    ).toEqual(['open', 'hero']);
  });

  it('핵심 소개를 채우면 멘토 정보까지 열린다', () => {
    const template = empty();
    template.hero.bullets = ['이력서·자기소개서 첨삭'];

    expect(
      ids(
        unlockedSettingsTabs({ hasOpened: false, template, reachedIndex: 1 }),
      ),
    ).toEqual(['open', 'hero', 'intro']);
  });

  /*
    「멘토 정보」는 프로필 도메인이 채우는 읽기 전용 탭이다. 닉네임이 없으면 완료
    판정이 영영 false 라, 완료 여부만 보면 여기서 막힌다. 「다음으로」로 도달한
    지점을 함께 보기 때문에 지나갈 수 있다.
  */
  it('멘토 정보가 미완성이어도 다음으로 눌러 도달하면 멘토링 유형이 열린다', () => {
    const template = empty();
    template.hero.bullets = ['이력서·자기소개서 첨삭'];

    expect(
      ids(
        unlockedSettingsTabs({ hasOpened: false, template, reachedIndex: 3 }),
      ),
    ).toEqual(['open', 'hero', 'intro', 'mentoringTypes']);
  });

  it('필수를 끝내기 전에는 선택 탭이 열리지 않는다', () => {
    const template = empty();
    template.hero.bullets = ['이력서·자기소개서 첨삭'];

    const visible = ids(
      unlockedSettingsTabs({ hasOpened: false, template, reachedIndex: 9 }),
    );
    expect(visible).not.toContain('strategy');
    expect(visible).not.toContain('video');
    expect(visible).not.toContain('results');
  });

  it('필수를 모두 채우면 선택 탭 셋이 한꺼번에 열린다', () => {
    const template = empty();
    template.hero.bullets = ['이력서·자기소개서 첨삭'];
    template.intro.nickname = '쥬디';
    template.mentoringTypes.title = '이런 도움을 받을 수 있어요';
    template.mentoringTypes.items = [
      {
        typeName: '자기소개서 피드백',
        title: '자기소개서를 다듬고 싶다면',
        description: '문항 의도에 맞게 점검해요.',
        tags: [],
      },
    ];

    expect(
      ids(
        unlockedSettingsTabs({ hasOpened: false, template, reachedIndex: 0 }),
      ),
    ).toEqual(ids(SETTINGS_TABS));
  });
});
