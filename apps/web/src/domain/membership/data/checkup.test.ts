import {
  CHECKUP_AREAS,
  CHECKUP_QUESTIONS,
  CHECKUP_RESULT_COPY,
  EMPTY_CHECKUP_ANSWERS,
  findCheckupArea,
  resolveCheckupResult,
  resolveWeakestArea,
} from './checkup';

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

/*
 * 문항 순서는 [Q1 직무, Q2 경험, Q3 경험, Q4 서류, Q5 지원] 이다.
 * 숫자는 선택지 순번(0~3)이고 클수록 준비가 된 상태다.
 */
describe('resolveWeakestArea', () => {
  it('답이 덜 찼으면 null 이다', () => {
    expect(resolveWeakestArea(EMPTY_CHECKUP_ANSWERS)).toBeNull();
    expect(resolveWeakestArea([0, 0, 0, 0, null])).toBeNull();
  });

  it('평균이 가장 낮은 영역을 고른다', () => {
    expect(resolveWeakestArea([0, 3, 3, 3, 3])).toBe('direction');
    expect(resolveWeakestArea([3, 0, 0, 3, 3])).toBe('experience');
    expect(resolveWeakestArea([3, 3, 3, 0, 3])).toBe('document');
    expect(resolveWeakestArea([3, 3, 3, 3, 0])).toBe('apply');
  });

  it('동점이면 01 에 가까운 영역이다', () => {
    // 직무(01)와 서류(03)가 같은 점수다
    expect(resolveWeakestArea([0, 3, 3, 0, 3])).toBe('direction');
    // 서류(03)와 지원(04)이 같은 점수다
    expect(resolveWeakestArea([3, 3, 3, 0, 0])).toBe('document');
  });

  /*
   * 02 영역만 문항이 둘이다. 합으로 비교하면 문항 수가 그대로 점수 차가 되어,
   * 같은 수준으로 답해도 02 가 다른 영역과 다르게 취급된다.
   */
  it('모든 문항을 같은 수준으로 답하면 02 영역이 불리하지 않다', () => {
    for (const level of [0, 1, 2, 3]) {
      const result = resolveCheckupResult([level, level, level, level, level]);
      const averages = result?.scores.map((score) => score.average);
      // 네 영역 평균이 모두 같다 = 문항 수가 점수에 섞여 들지 않았다
      expect(averages).toEqual([level + 1, level + 1, level + 1, level + 1]);
      // 전부 동점이므로 앞선 영역이 뽑힌다
      expect(result?.weakestAreaId).toBe('direction');
    }
  });

  it('합이 아니라 평균으로 비교한다', () => {
    // 직무 2점 / 경험 1+2=3점. 합이면 직무가, 평균(경험 1.5)이면 경험이 뽑힌다
    expect(resolveWeakestArea([1, 0, 1, 3, 3])).toBe('experience');
  });
});

describe('resolveCheckupResult', () => {
  it('답이 덜 찼으면 null 이다', () => {
    expect(resolveCheckupResult([0, 0, 0, 0, null])).toBeNull();
  });

  it('막대 4개를 영역 순서대로 돌려준다', () => {
    const result = resolveCheckupResult([0, 3, 3, 3, 3]);

    expect(result?.scores.map((score) => score.area.id)).toEqual(
      CHECKUP_AREAS.map((area) => area.id),
    );
  });

  it('가장 약한 영역 하나만 weakest 다', () => {
    const result = resolveCheckupResult([0, 3, 3, 3, 3]);
    const weakest = result?.scores.filter(
      (score) => score.status === 'weakest',
    );

    expect(weakest).toHaveLength(1);
    expect(weakest?.[0].area.id).toBe('direction');
  });

  it('평균 3 이상이면 진행 중, 그 아래면 이후 보완이다', () => {
    // 직무 1 / 경험 2 / 서류 3 / 지원 4 — 시안 3.png 와 같은 조합이다
    const result = resolveCheckupResult([0, 1, 1, 2, 3]);
    const status = Object.fromEntries(
      (result?.scores ?? []).map((score) => [score.area.id, score.status]),
    );

    expect(status).toEqual({
      direction: 'weakest',
      experience: 'later',
      document: 'ongoing',
      apply: 'ongoing',
    });
  });

  it('막대 길이는 평균에 비례하고 100% 를 넘지 않는다', () => {
    const lowest = resolveCheckupResult([0, 0, 0, 0, 0]);
    const highest = resolveCheckupResult([3, 3, 3, 3, 3]);

    expect(lowest?.scores.every((score) => score.ratio === 0.25)).toBe(true);
    expect(highest?.scores.every((score) => score.ratio === 1)).toBe(true);
  });
});

describe('CHECKUP_RESULT_COPY', () => {
  it('영역마다 제목 2~3줄과 본문 2문단이 있다', () => {
    for (const area of CHECKUP_AREAS) {
      const copy = CHECKUP_RESULT_COPY[area.id];

      expect(copy.titleLines.length).toBeGreaterThanOrEqual(2);
      expect(copy.titleLines.length).toBeLessThanOrEqual(3);
      expect(copy.body).toHaveLength(2);
      expect(copy.body.every((paragraph) => paragraph.length > 0)).toBe(true);
    }
  });

  it('제목마다 강조 조각이 하나 이상이다', () => {
    for (const area of CHECKUP_AREAS) {
      const parts = CHECKUP_RESULT_COPY[area.id].titleLines.flat();
      expect(parts.some((part) => part.accent)).toBe(true);
    }
  });
});
