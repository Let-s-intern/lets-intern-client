import { CHALLENGE_ITEMS } from './challengeModalItems';
import { CHECKUP_AREAS } from './checkup';
import { findPrepStepByArea, PREP_STEP_CARDS } from './prepSteps';

describe('PREP_STEP_CARDS', () => {
  it('카드 7장이 시안 순서대로다', () => {
    expect(PREP_STEP_CARDS.map((step) => step.label)).toEqual([
      'STEP 01',
      'STEP 02',
      'CHECKPOINT',
      'STEP 03',
      'STEP 04',
      'STEP 05',
      'GOAL',
    ]);
  });

  it('카드마다 할 일이 2줄이다', () => {
    for (const step of PREP_STEP_CARDS) {
      expect(step.todos).toHaveLength(2);
      expect(step.todos.every((todo) => todo.length > 0)).toBe(true);
    }
  });

  it('CHECKPOINT 와 GOAL 만 kind 가 다르다', () => {
    const kinds = Object.fromEntries(
      PREP_STEP_CARDS.map((step) => [step.id, step.kind]),
    );

    expect(kinds.checkpoint).toBe('checkpoint');
    expect(kinds.goal).toBe('goal');
    expect(PREP_STEP_CARDS.filter((step) => step.kind === 'step')).toHaveLength(
      5,
    );
  });

  /*
   * 진단 결과는 영역 하나를 가리키고, 배지는 카드 한 장에만 붙어야 한다.
   * 두 카드가 같은 영역을 들면 "여기부터 시작" 이 두 곳에 생긴다.
   */
  it('네 영역이 각각 카드 한 장씩에 대응한다', () => {
    const mapped = PREP_STEP_CARDS.map((step) => step.areaId).filter(Boolean);

    expect(new Set(mapped).size).toBe(mapped.length);
    for (const area of CHECKUP_AREAS) {
      expect(findPrepStepByArea(area.id)).toBeDefined();
    }
  });

  it('GOAL 과 CHECKPOINT 에는 대응 영역이 없다', () => {
    const byId = Object.fromEntries(
      PREP_STEP_CARDS.map((step) => [step.id, step]),
    );

    expect(byId.goal.areaId).toBeUndefined();
    expect(byId.checkpoint.areaId).toBeUndefined();
  });

  it('GOAL 만 펼침이 없다', () => {
    const withoutExpand = PREP_STEP_CARDS.filter((step) => !step.expand);
    expect(withoutExpand.map((step) => step.id)).toEqual(['goal']);
  });

  it('CHECKPOINT 의 토글 문구와 배지가 시안과 같다', () => {
    const checkpoint = PREP_STEP_CARDS.find((step) => step.id === 'checkpoint');

    expect(checkpoint?.expand?.toggleLabel).toBe(
      '전문가 점검으로 취뽀를 앞당기고 싶다면?',
    );
    expect(checkpoint?.expand?.badge).toBe('ONLY PASS');
    // 나머지 카드는 같은 문구 한 종류다
    for (const step of PREP_STEP_CARDS) {
      if (!step.expand || step.id === 'checkpoint') continue;
      expect(step.expand.toggleLabel).toBe('혼자하기 어렵다면?');
    }
  });

  it('STEP 03 은 이력서·자소서·포폴 탭 3개다', () => {
    const step3 = PREP_STEP_CARDS.find((step) => step.id === 'step-03');

    expect(step3?.expand?.programs.map((p) => p.tabLabel)).toEqual([
      '이력서',
      '자소서',
      '포폴',
    ]);
  });

  /*
   * PRD 7절 E — 펼침 안의 링크는 새로 짓지 않는다. 챌린지는 기존 카드 데이터의
   * 링크를, 아직 상세가 없는 LIVE 클리닉·멘토링은 같은 랜딩의 섹션 앵커를 쓴다.
   */
  it('챌린지 링크가 기존 데이터의 URL 과 같다', () => {
    const known = new Set(CHALLENGE_ITEMS.map((item) => item.url));
    const inPage = new Set(['#live-clinic', '#pass-intro']);

    for (const step of PREP_STEP_CARDS) {
      for (const program of step.expand?.programs ?? []) {
        expect(known.has(program.url) || inPage.has(program.url)).toBe(true);
      }
    }
  });

  it('챌린지 썸네일도 기존 카드 데이터에서 가져온다', () => {
    const step1 = PREP_STEP_CARDS.find((step) => step.id === 'step-01');
    const marketing = CHALLENGE_ITEMS.find(
      (item) => item.challengeType === 'MARKETING',
    );

    expect(step1?.expand?.programs[0].src).toBe(marketing?.src);
    expect(step1?.expand?.programs[0].url).toBe(marketing?.url);
  });
});

describe('findPrepStepByArea', () => {
  it('영역이 없으면 undefined 다', () => {
    expect(findPrepStepByArea(null)).toBeUndefined();
  });

  it('영역마다 대응 카드를 돌려준다', () => {
    expect(findPrepStepByArea('direction')?.id).toBe('step-01');
    expect(findPrepStepByArea('experience')?.id).toBe('step-02');
    expect(findPrepStepByArea('document')?.id).toBe('step-03');
    expect(findPrepStepByArea('apply')?.id).toBe('step-05');
  });
});
