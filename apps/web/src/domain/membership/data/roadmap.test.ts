import { ROADMAP } from './roadmap';

/*
 * 시안 4 는 STEP 01~05 다섯 단계다. 단계가 빠지거나 라벨 번호가 어긋나면 방문자가
 * 준비 순서를 잘못 읽는다 — 이 섹션의 존재 이유가 "순서" 라서 그렇다.
 */
describe('ROADMAP', () => {
  it('다섯 단계다', () => {
    expect(ROADMAP.steps).toHaveLength(5);
  });

  it('STEP 01 부터 순서대로 번호가 붙는다', () => {
    expect(ROADMAP.steps.map((step) => step.label)).toEqual([
      'STEP 01',
      'STEP 02',
      'STEP 03',
      'STEP 04',
      'STEP 05',
    ]);
  });

  it('모든 단계에 제목과 설명이 있다', () => {
    for (const step of ROADMAP.steps) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.body.length).toBeGreaterThan(0);
    }
  });
});
