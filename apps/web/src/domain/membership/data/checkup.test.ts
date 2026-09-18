import { CHECKUP_AREAS, CHECKUP_QUESTIONS, findCheckupArea } from './checkup';

/*
 * 이 데이터는 REAL TALK 카드 · 진단 문항 · 진단 결과가 함께 쓰는 단일 출처다.
 * 그래서 "형태" 가 깨지는 것이 곧 세 화면이 어긋나는 것이다.
 *
 * 선택지 순번은 그대로 영역 점수가 되므로 개수(4개)와 중복 없음을 여기서 고정한다.
 */
describe('CHECKUP_AREAS', () => {
  it('네 영역이고 번호가 01~04 순서다', () => {
    expect(CHECKUP_AREAS).toHaveLength(4);
    expect(CHECKUP_AREAS.map((area) => area.no)).toEqual([
      '01',
      '02',
      '03',
      '04',
    ]);
  });

  it('모든 영역에 라벨과 한 줄 부연이 있다', () => {
    for (const area of CHECKUP_AREAS) {
      expect(area.label.length).toBeGreaterThan(0);
      expect(area.desc.length).toBeGreaterThan(0);
    }
  });

  it('영역 id 가 중복되지 않는다', () => {
    const ids = CHECKUP_AREAS.map((area) => area.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('CHECKUP_QUESTIONS', () => {
  it('다섯 문항이고 번호가 01~05 순서다', () => {
    expect(CHECKUP_QUESTIONS).toHaveLength(5);
    expect(CHECKUP_QUESTIONS.map((q) => q.no)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });

  it('모든 문항이 정의된 영역에 속한다', () => {
    for (const question of CHECKUP_QUESTIONS) {
      expect(() => findCheckupArea(question.areaId)).not.toThrow();
    }
  });

  it('네 영역이 모두 한 문항 이상 쓰인다', () => {
    const used = new Set(CHECKUP_QUESTIONS.map((q) => q.areaId));
    expect(used.size).toBe(CHECKUP_AREAS.length);
  });

  it('선택지가 문항마다 4개다', () => {
    for (const question of CHECKUP_QUESTIONS) {
      expect(question.options).toHaveLength(4);
    }
  });

  it('선택지 문구가 전체에서 중복되지 않는다', () => {
    const all = CHECKUP_QUESTIONS.flatMap((q) => [...q.options]);
    expect(new Set(all).size).toBe(all.length);
  });

  it('안내 박스는 Q3 에만 있고 예시가 5줄이다', () => {
    const withHint = CHECKUP_QUESTIONS.filter((q) => q.hint);
    expect(withHint.map((q) => q.no)).toEqual(['03']);
    expect(withHint[0].hint?.items).toHaveLength(5);
  });
});

describe('findCheckupArea', () => {
  it('모르는 영역이면 던진다', () => {
    // @ts-expect-error 없는 영역 id 로 부르면 조용히 undefined 가 되지 않아야 한다
    expect(() => findCheckupArea('unknown')).toThrow();
  });
});
