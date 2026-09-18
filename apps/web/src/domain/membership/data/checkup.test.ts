import {
  CHECKUP_AREAS,
  CHECKUP_QUESTIONS,
  CHECKUP_RESULT_COPY,
  CHECKUP_STATUS_LABEL,
  EMPTY_CHECKUP_ANSWERS,
  findCheckupArea,
  resolveAreaScores,
  resolveAreaStatus,
  resolveCaseAreaIndex,
  resolveCheckupCase,
  resolveCheckupResult,
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

  /*
   * 배점은 운영이 조정하는 값이라 표를 여기 한 번 더 적어 둔다. 중복이 아니라
   * "숫자를 바꾸면 테스트도 함께 바꾼다" 는 확인 절차다.
   *
   * PRD 4.1 본문은 "②와 ③ 사이를 가장 넓게 둔다" 고 적었지만 표는 그렇지 않다 —
   * Q1 은 ③→④(30)가 ②→③(25)보다 넓고, Q5 는 ②→③(26)이 가장 좁다. 실제 설계값은
   * 표이므로 표를 따랐고, 간격 순위는 단언하지 않는다.
   */
  it('문항마다 배점이 PRD 4.1 표와 같다', () => {
    expect(CHECKUP_QUESTIONS.map((question) => question.scores)).toEqual([
      [15, 40, 65, 95],
      [15, 40, 70, 95],
      [12, 38, 68, 95],
      [12, 40, 65, 95],
      [15, 42, 68, 95],
    ]);
  });

  it('배점이 선택지와 같은 수이고 오름차순이며 0~100 안이다', () => {
    for (const question of CHECKUP_QUESTIONS) {
      expect(question.scores).toHaveLength(question.options.length);

      question.scores.forEach((score, index) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        if (index > 0) {
          expect(score).toBeGreaterThan(question.scores[index - 1]);
        }
      });
    }
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
describe('resolveAreaScores', () => {
  it('답이 덜 찼으면 null 이다', () => {
    expect(resolveAreaScores(EMPTY_CHECKUP_ANSWERS)).toBeNull();
    expect(resolveAreaScores([0, 0, 0, 0, null])).toBeNull();
  });

  it('01 · 03 · 04 축은 문항 배점 그대로다', () => {
    expect(resolveAreaScores([0, 3, 3, 3, 3])).toEqual([15, 95, 95, 95]);
    expect(resolveAreaScores([3, 3, 3, 0, 0])).toEqual([95, 95, 12, 15]);
    expect(resolveAreaScores([1, 3, 3, 2, 1])).toEqual([40, 95, 65, 42]);
  });

  /* 반올림이 생기는 축은 문항이 둘인 02 하나다 (PRD 4.2). */
  it('02 축은 두 문항 평균을 반올림한다', () => {
    // Q2 ② 40 · Q3 ③ 68 → 54
    expect(resolveAreaScores([0, 1, 2, 0, 0])?.[1]).toBe(54);
    // Q2 ① 15 · Q3 ① 12 → 13.5 는 14 로 올린다
    expect(resolveAreaScores([0, 0, 0, 0, 0])?.[1]).toBe(14);
  });

  /* PRD 4.3 이 동점 보정의 근거로 든 숫자다. */
  it('전부 ① 이면 15 / 14 / 12 / 15 다', () => {
    expect(resolveAreaScores([0, 0, 0, 0, 0])).toEqual([15, 14, 12, 15]);
  });

  it('어떤 답 조합에서도 0~100 을 벗어나지 않는다', () => {
    for (const level of [0, 1, 2, 3]) {
      const areaScores = resolveAreaScores([level, level, level, level, level]);

      expect(areaScores).toHaveLength(CHECKUP_AREAS.length);
      for (const score of areaScores ?? []) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });
});

/*
 * 축 점수를 직접 넣어 경계를 본다. 배점표로는 정확히 80·79 인 축을 만들 수 없어
 * (문항 배점이 12~95 라 축 점수가 띄엄띄엄하다) 답 조합으로는 확인할 수 없는 경계다.
 */
describe('resolveCaseAreaIndex', () => {
  it('네 축이 모두 80 이상이면 null(= CASE E) 이다', () => {
    expect(resolveCaseAreaIndex([80, 80, 80, 80])).toBeNull();
    expect(resolveCaseAreaIndex([95, 82, 88, 100])).toBeNull();
  });

  /* 79 하나로 E 가 깨진다. 단, 다른 축이 79 + 8 안이면 보정으로 앞선 축이 뽑힌다. */
  it('한 축이라도 79 면 E 가 아니다', () => {
    expect(resolveCaseAreaIndex([79, 95, 95, 95])).toBe(0);
    expect(resolveCaseAreaIndex([95, 95, 95, 79])).toBe(3);
    expect(resolveCaseAreaIndex([80, 80, 80, 79])).toBe(0);
  });

  it('최저 + 8 이내면 앞선 축이 이긴다', () => {
    // 12 가 최저지만 15 는 12 + 8 안이라 01 축이다
    expect(resolveCaseAreaIndex([15, 14, 12, 15])).toBe(0);
    // 9 차이는 보정 밖이라 최저 축이 그대로 뽑힌다
    expect(resolveCaseAreaIndex([21, 14, 12, 15])).toBe(1);
  });
});

describe('resolveCheckupCase', () => {
  it('답이 덜 찼으면 null 이다', () => {
    expect(resolveCheckupCase(EMPTY_CHECKUP_ANSWERS)).toBeNull();
    expect(resolveCheckupCase([0, 0, 0, 0, null])).toBeNull();
  });

  /*
   * 동점 보정이 없으면 15 / 14 / 12 / 15 라 서류 축(12)이 뽑혀, 아직 직무도 정하지
   * 못한 사람에게 "서류부터 쓰세요" 가 나간다 (PRD 4.3).
   */
  it('전부 ① 이면 서류가 아니라 A 다', () => {
    expect(resolveCheckupCase([0, 0, 0, 0, 0])).toBe('A');
  });

  it('전부 ④ 면 E 다', () => {
    expect(resolveCheckupCase([3, 3, 3, 3, 3])).toBe('E');
  });

  it('최저 축이 01 · 02 · 03 이면 A · B · C 다', () => {
    expect(resolveCheckupCase([0, 3, 3, 3, 3])).toBe('A');
    expect(resolveCheckupCase([3, 0, 0, 3, 3])).toBe('B');
    expect(resolveCheckupCase([3, 3, 3, 0, 3])).toBe('C');
  });

  /* 최저 축이 04 일 때만 Q5 답이 D1·D2 를 가른다. ③ 부터 D2 다. */
  it('최저 축이 04 면 Q5 ①② 는 D1, ③④ 는 D2 다', () => {
    expect(resolveCheckupCase([3, 3, 3, 3, 0])).toBe('D1');
    expect(resolveCheckupCase([3, 3, 3, 3, 1])).toBe('D1');
    expect(resolveCheckupCase([3, 3, 3, 3, 2])).toBe('D2');
  });

  /* 04 축이 68(③)이어도 다른 축이 모두 95 면 최저 축은 04 다 */
  it('한 축만 80 아래면 E 가 아니라 그 축의 CASE 다', () => {
    // 95 / 95 / 95 / 68
    expect(resolveCheckupCase([3, 3, 3, 3, 2])).toBe('D2');
    // 95 / 69 / 95 / 95 — 02 축만 80 아래다
    expect(resolveCheckupCase([3, 2, 2, 3, 3])).toBe('B');
    // 95 / 82 / 95 / 95 — 네 축 모두 80 이상이면 E 로 돌아온다
    expect(resolveCheckupCase([3, 3, 2, 3, 3])).toBe('E');
  });
});

describe('resolveAreaStatus', () => {
  it('80 이상은 ready, 79 는 ongoing 이다', () => {
    expect(resolveAreaStatus(80, false)).toBe('ready');
    expect(resolveAreaStatus(79, false)).toBe('ongoing');
  });

  it('55 는 ongoing, 54 는 later 다', () => {
    expect(resolveAreaStatus(55, false)).toBe('ongoing');
    expect(resolveAreaStatus(54, false)).toBe('later');
  });

  /* CASE 를 정한 축은 점수와 무관하게 강조다 — 100 점이어도 그 축이 시작점이다. */
  it('CASE 를 정한 축은 점수와 상관없이 weakest 다', () => {
    expect(resolveAreaStatus(12, true)).toBe('weakest');
    expect(resolveAreaStatus(95, true)).toBe('weakest');
  });

  it('상태 4종에 모두 캡션이 있다', () => {
    for (const status of ['weakest', 'ready', 'ongoing', 'later'] as const) {
      expect(CHECKUP_STATUS_LABEL[status].length).toBeGreaterThan(0);
    }
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

  it('CASE 와 그 CASE 를 정한 축을 함께 싣는다', () => {
    const result = resolveCheckupResult([0, 3, 3, 3, 3]);

    expect(result?.caseId).toBe('A');
    expect(result?.weakestAreaId).toBe('direction');
  });

  it('CASE 를 정한 축 하나만 weakest 다', () => {
    const result = resolveCheckupResult([0, 3, 3, 3, 3]);
    const weakest = result?.scores.filter(
      (score) => score.status === 'weakest',
    );

    expect(weakest).toHaveLength(1);
    expect(weakest?.[0].area.id).toBe('direction');
  });

  it('축마다 점수 구간에 맞는 상태를 단다', () => {
    // 15 / 39 / 65 / 95 — 시안 3.png 와 같은 순서의 조합이다
    const result = resolveCheckupResult([0, 1, 1, 2, 3]);
    const status = Object.fromEntries(
      (result?.scores ?? []).map((score) => [score.area.id, score.status]),
    );

    expect(status).toEqual({
      direction: 'weakest',
      experience: 'later',
      document: 'ongoing',
      apply: 'ready',
    });
  });

  /* CASE E 는 강조 축이 없다. 네 축 모두 "준비가 잘 되어 있어요" 다 (PRD 4.5). */
  it('CASE E 는 weakest 축 없이 네 축 모두 ready 다', () => {
    // 95 / 82 / 95 / 95
    const result = resolveCheckupResult([3, 3, 2, 3, 3]);

    expect(result?.caseId).toBe('E');
    expect(result?.weakestAreaId).toBeNull();
    expect(result?.scores.map((score) => score.status)).toEqual([
      'ready',
      'ready',
      'ready',
      'ready',
    ]);
  });

  it('축 점수를 축 순서대로 그대로 싣는다', () => {
    const answers = [0, 1, 2, 3, 1];
    const result = resolveCheckupResult(answers);

    expect(result?.scores.map((score) => score.score)).toEqual(
      resolveAreaScores(answers),
    );
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
