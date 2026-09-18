// 무료 진단 5문항 — 시안 1.png(REAL TALK) · 2.png(FREE CHECK-UP).
//
// **4영역은 여기가 유일한 출처다.** 같은 라벨을 REAL TALK 의 카드 4장, 진단 문항의 영역
// 표시, 진단 결과 화면이 함께 쓴다. 세 곳에 따로 적으면 한 곳만 고쳐져 방문자가 진단
// 결과에서 처음 보는 이름을 만난다. 라벨을 바꿀 일이 있으면 이 파일만 고친다.
//
// 시안의 문항 카드는 영역 표시가 `01 직무 · 지원 방향` 형태다 — `${no} ${label}` 이다.
//
// 시안 안에서 03 영역 이름이 두 번 다르게 적혀 있다. REAL TALK 카드(1.png)는
// `서류 · 포트폴리오 전환`, Q4 카드(2.png)는 `서류 · 포트폴리오 현황` 이다. 단일 출처가
// 목적이므로 4영역을 정의한 쪽인 1.png 의 `전환` 을 따른다.

export type CheckupAreaId = 'direction' | 'experience' | 'document' | 'apply';

export interface CheckupArea {
  id: CheckupAreaId;
  /** 화면에 그대로 찍히는 두 자리 번호 */
  no: string;
  label: string;
  /** REAL TALK 카드의 한 줄 부연 */
  desc: string;
}

/** Q3 에만 붙는 연보라 안내 박스 */
export interface CheckupHint {
  title: string;
  items: readonly string[];
}

export interface CheckupQuestion {
  /** 화면에 그대로 찍히는 두 자리 번호 (QUESTION 0N / 05) */
  no: string;
  areaId: CheckupAreaId;
  question: string;
  hint?: CheckupHint;
  /**
   * **낮은 수준 → 높은 수준 순서다.** 선택지 순서가 곧 배점 순서라,
   * 순서를 바꾸면 `scores` 도 함께 바꿔야 한다.
   */
  options: readonly string[];
  /**
   * 선택지와 같은 순서의 배점(0~100).
   *
   * **배점은 여기가 유일한 출처다.** 축 점수·CASE 판정·막대 숫자가 모두 이 값을
   * 읽는다. 운영이 조정하는 값이라 두 곳에 적으면 한쪽만 바뀐다 — 특정 CASE 로 더
   * 보내고 싶으면 해당 구간을 내린다.
   */
  scores: readonly [number, number, number, number];
}

export const CHECKUP_AREAS = [
  {
    id: 'direction',
    no: '01',
    label: '직무 · 지원 방향',
    desc: '나는 어디에 지원해야 하지?',
  },
  {
    id: 'experience',
    no: '02',
    label: '경험 진단 · 해석',
    desc: '내 경험, 이걸 써도 될까?',
  },
  {
    id: 'document',
    no: '03',
    label: '서류 · 포트폴리오 전환',
    desc: '이 경험을 어떻게 보여줘야 하지?',
  },
  {
    id: 'apply',
    no: '04',
    label: '지원 · 전형 대응',
    desc: '지원부터 합격까지 어떻게 개선하지?',
  },
] as const satisfies readonly CheckupArea[];

/*
 * 타입을 `readonly CheckupQuestion[]` 로 못박는다.
 *
 * `as const satisfies` 만 두면 각 원소가 자기 리터럴 타입으로 좁혀져, `hint` 가 없는
 * 문항에서는 `question.hint` 라는 속성 자체가 사라진다. 배열을 순회하는 쪽은
 * "어떤 문항에 hint 가 있는지" 를 모르는 것이 정상이므로 선택 속성으로 보여야 한다.
 */
export const CHECKUP_QUESTIONS: readonly CheckupQuestion[] = [
  {
    no: '01',
    areaId: 'direction',
    question: '현재 지원하고 싶은 마케팅 직무와 지원 범위가 얼마나 명확한가요?',
    options: [
      '마케팅에 관심은 있지만 세부 직무별 차이도 아직 잘 모르겠어요.',
      '관심 있는 직무가 2~3개 있지만 무엇을 우선할지 모르겠어요.',
      '지원하고 싶은 직무는 정했지만, 내 경험으로 인턴 · 신입 · 경력 중 어디까지 지원할 수 있는지 모르겠어요.',
      '목표 직무가 명확하고, 내 경험과 JD를 비교해 지원할 공고를 판단할 수 있어요.',
    ],
    scores: [15, 40, 65, 95],
  },
  {
    no: '02',
    areaId: 'experience',
    question:
      '지금까지 했던 경험 중 지원 직무에 활용할 경험을 스스로 고를 수 있나요?',
    options: [
      '어떤 경험을 써야 할지 전혀 모르겠어요.',
      '경험은 있지만 취업에 활용할 만한 경험인지 모르겠어요.',
      '활용할 경험 2~3개는 고를 수 있지만 직무 역량과 연결하는 게 어려워요.',
      '지원하는 직무와 JD에 따라 활용할 경험을 골라낼 수 있어요.',
    ],
    scores: [15, 40, 70, 95],
  },
  {
    no: '03',
    areaId: 'experience',
    question:
      '성과가 없거나 미미했던 경험에서도 나의 판단과 인사이트를 찾아낼 수 있나요?',
    hint: {
      title: '💡 이런 경험도 포함해서 생각해보세요!',
      items: [
        '개인 SNS를 운영했지만 팔로워가 적었던 경험',
        '여러 가설을 검증했지만 뚜렷한 성과가 없었던 프로젝트',
        '수상하지 못했던 공모전',
        '수치가 높지 않았던 SNS 운영 경험',
        '성과를 숫자로 표현하기 어려운 인턴 경험',
      ],
    },
    options: [
      '성과가 없으면 취업에 활용하기 어려운 경험이라고 생각해요.',
      '무엇을 했는지는 설명할 수 있지만 어떤 의미가 있는지 뽑기 어려워요.',
      '내가 어떤 판단을 했고 어떻게 실행했는지는 설명할 수 있어요.',
      '결과가 아쉬워도 문제 → 판단/가설 → 실행 → 결과 → 회고 · 인사이트 → 다음 액션까지 설명할 수 있어요.',
    ],
    scores: [12, 38, 68, 95],
  },
  {
    no: '04',
    areaId: 'document',
    question:
      '내 경험을 지원 직무에 맞는 이력서 · 자소서 · 포트폴리오로 보여줄 수 있나요?',
    options: [
      '아직 제대로 완성한 서류가 없어요.',
      '기본 서류는 있지만 경험을 어떻게 보여줘야 할지 어려워요.',
      '이력서 · 자소서 · 포트폴리오는 있지만 대부분의 기업에 비슷하게 제출해요.',
      'JD의 요구 역량에 따라 경험의 순서 · 성과 · 강조점을 바꿔 제출할 수 있어요.',
    ],
    scores: [12, 40, 65, 95],
  },
  {
    no: '05',
    areaId: 'apply',
    question: '현재 실제 지원과 전형 준비는 어디까지 왔나요?',
    options: [
      '아직 실제 지원을 거의 하지 않고 있어요.',
      '지원 중이지만 서류 합격으로 잘 이어지지 않고, 무엇을 바꿔야 할지 모르겠어요.',
      '서류 합격 경험은 있지만 면접에서 내 경험을 설명하는 것이 어려워요.',
      '지원 결과를 기록하고 서류 · 면접 결과를 바탕으로 다음 지원을 계속 개선하고 있어요.',
    ],
    scores: [15, 42, 68, 95],
  },
] as const;

export const CHECKUP = {
  eyebrow: 'FREE CHECK-UP',
  title: '1분이면, 지금 막힌 지점이 보여요',
  subLines: [
    '내 마케팅 취준 상태에 대해 직무·경험·서류·지원 상태를 확인하고,',
    '지금 가장 먼저 보완할 영역 하나를 알려드려요.',
  ],
  /** REAL TALK 의 "무료 진단 바로 하기" 가 가리키는 앵커 */
  anchorId: 'checkup',
} as const;

export function findCheckupArea(id: CheckupAreaId): CheckupArea {
  const area = CHECKUP_AREAS.find((it) => it.id === id);
  if (!area) throw new Error(`알 수 없는 진단 영역: ${id}`);
  return area;
}

// ---------------------------------------------------------------------------
// 진단 결과 — 시안 3.png
// ---------------------------------------------------------------------------

/** 아직 고르지 않은 문항은 null 이다. 길이는 항상 문항 수와 같다. */
export type CheckupAnswers = readonly (number | null)[];

export const EMPTY_CHECKUP_ANSWERS: CheckupAnswers = CHECKUP_QUESTIONS.map(
  () => null,
);

export type CheckupAreaStatus = 'weakest' | 'ready' | 'ongoing' | 'later';

/** 막대 아래 한 줄 (PRD 4.5) */
export const CHECKUP_STATUS_LABEL: Record<CheckupAreaStatus, string> = {
  weakest: '가장 먼저 보완이 필요해요',
  ready: '준비가 잘 되어 있어요',
  ongoing: '진행 중이에요',
  later: '이후 보완이 필요해요',
};

/** 점수가 이 값 이상이면 "진행 중이에요" 다 */
const ONGOING_SCORE = 55;

/**
 * 진단 결과 6종 (PRD 4.3).
 *
 * D1·D2 는 최저 축이 같은 04 지만 Q5 답으로 갈린다 — 아직 지원을 못 하는 사람과
 * 서류는 붙는데 면접에서 막히는 사람에게 같은 문구를 내보낼 수 없다.
 */
export type CheckupCaseId = 'A' | 'B' | 'C' | 'D1' | 'D2' | 'E';

/** 네 축이 모두 이 점수 이상이면 보완할 축이 없다 = CASE E */
export const CHECKUP_READY_SCORE = 80;

/**
 * 동점 보정 폭. 최저 축과 이 폭 안에 있는 축은 같은 수준으로 본다.
 *
 * 배점표는 문항마다 ① 값이 조금씩 달라서(12 ~ 15) 아무것도 못 한 사람도 축 사이에
 * 3점 차가 생긴다. 그 차이로 시작점을 고르면 안 된다 (PRD 4.3).
 */
export const CHECKUP_TIE_MARGIN = 8;

/** 축 번호 → CASE. 04 축(번호 3)만 Q5 답으로 D1·D2 로 갈린다 */
const CASE_BY_AREA_INDEX = ['A', 'B', 'C'] as const;

const APPLY_AREA_INDEX = CHECKUP_AREAS.findIndex((area) => area.id === 'apply');

/** D1·D2 를 가르는 문항 (04 축의 문항 하나) */
const APPLY_QUESTION_INDEX = CHECKUP_QUESTIONS.findIndex(
  (question) => question.areaId === 'apply',
);

/** Q5 에서 이 순번(③) 이상을 고르면 D2 다 */
const D2_MIN_OPTION_INDEX = 2;

export interface CheckupAreaScore {
  area: CheckupArea;
  /**
   * 축 점수 0~100. 막대 옆 숫자로 그대로 노출된다.
   *
   * 문항이 하나인 축은 그 문항의 배점이고, 문항이 둘인 02 축만 평균이라
   * 반올림이 생긴다 (PRD 4.2).
   */
  score: number;
  status: CheckupAreaStatus;
}

export interface CheckupResult {
  /** 결과 문구와 준비 단계 배지가 이 값으로 정해진다 */
  caseId: CheckupCaseId;
  /** CASE 를 결정한 축. 강조할 축이 없는 CASE E 는 null */
  weakestAreaId: CheckupAreaId | null;
  /** CHECKUP_AREAS 와 같은 순서 */
  scores: readonly CheckupAreaScore[];
}

/**
 * 축 점수 4개. `CHECKUP_AREAS` 와 같은 순서(01 → 04)이고, 답이 하나라도 비어 있으면 null.
 *
 * 배점은 문항 데이터에서만 읽는다 (PRD 4.1). 축에 문항이 둘이면 평균을 반올림하므로
 * 반올림이 생기는 축은 02 하나다 (PRD 4.2).
 */
export function resolveAreaScores(answers: CheckupAnswers): number[] | null {
  if (answers.length !== CHECKUP_QUESTIONS.length) return null;

  const sums = new Map<CheckupAreaId, { total: number; count: number }>();

  for (const [index, question] of CHECKUP_QUESTIONS.entries()) {
    const answer = answers[index];
    if (answer === null || answer === undefined) return null;

    const prev = sums.get(question.areaId) ?? { total: 0, count: 0 };
    sums.set(question.areaId, {
      total: prev.total + question.scores[answer],
      count: prev.count + 1,
    });
  }

  return CHECKUP_AREAS.map((area) => {
    const sum = sums.get(area.id);
    if (!sum) throw new Error(`문항이 없는 진단 영역: ${area.id}`);
    return Math.round(sum.total / sum.count);
  });
}

/**
 * CASE 를 결정하는 축의 번호(0~3). 네 축이 모두 준비된 CASE E 면 null.
 *
 * **최저 축이 아니라 "최저 + `CHECKUP_TIE_MARGIN` 이내에 드는 첫 축" 이다.** 그냥
 * 최저를 뽑으면 모든 문항에 ①을 고른 사람이 `15 / 14 / 12 / 15` 가 되어 서류 축(12)이
 * 뽑히고, 아직 아무것도 정하지 못한 사람에게 "서류부터 쓰세요" 가 나간다 (PRD 4.3).
 * 01 → 04 순서로 찾으므로 보정 범위 안에서는 앞 단계가 이긴다.
 */
export function resolveCaseAreaIndex(
  areaScores: readonly number[],
): number | null {
  const lowest = Math.min(...areaScores);
  if (lowest >= CHECKUP_READY_SCORE) return null;

  return areaScores.findIndex((score) => score <= lowest + CHECKUP_TIE_MARGIN);
}

/**
 * 진단 CASE 하나. 답이 덜 찼으면 null.
 *
 * 최저 축이 04(지원 · 전형 대응)일 때만 둘로 갈린다 — 아직 지원을 못 하는 쪽(D1)과
 * 서류는 붙는데 면접에서 막히는 쪽(D2)은 필요한 준비가 다르다 (PRD 4.3).
 */
export function resolveCheckupCase(
  answers: CheckupAnswers,
): CheckupCaseId | null {
  const areaScores = resolveAreaScores(answers);
  if (!areaScores) return null;

  const caseAreaIndex = resolveCaseAreaIndex(areaScores);
  if (caseAreaIndex === null) return 'E';
  if (caseAreaIndex !== APPLY_AREA_INDEX)
    return CASE_BY_AREA_INDEX[caseAreaIndex];

  const applyAnswer = answers[APPLY_QUESTION_INDEX] ?? 0;
  return applyAnswer >= D2_MIN_OPTION_INDEX ? 'D2' : 'D1';
}

/**
 * 축 하나의 상태. 점수 구간은 PRD 4.5 표다.
 *
 * **강조는 CASE 를 정한 축 하나뿐이다.** 점수가 낮은 축이 여럿이어도 나머지는 기본
 * 색 + "이후 보완이 필요해요" 로 둔다 — 전부 칠하면 "무엇부터" 라는 신호가 사라진다.
 * CASE E 는 정해진 축이 없고 네 축이 모두 80 이상이라 자연히 전부 `ready` 가 된다.
 */
export function resolveAreaStatus(
  score: number,
  isCaseArea: boolean,
): CheckupAreaStatus {
  if (isCaseArea) return 'weakest';
  if (score >= CHECKUP_READY_SCORE) return 'ready';
  if (score >= ONGOING_SCORE) return 'ongoing';
  return 'later';
}

/** 막대 4개와 라벨까지 포함한 결과. 답이 덜 찼으면 null */
export function resolveCheckupResult(
  answers: CheckupAnswers,
): CheckupResult | null {
  const areaScores = resolveAreaScores(answers);
  const caseId = resolveCheckupCase(answers);
  if (!areaScores || !caseId) return null;

  const caseAreaIndex = resolveCaseAreaIndex(areaScores);

  const scores = CHECKUP_AREAS.map((area, index) => ({
    area,
    score: areaScores[index],
    status: resolveAreaStatus(areaScores[index], index === caseAreaIndex),
  }));

  return {
    caseId,
    weakestAreaId:
      caseAreaIndex === null ? null : CHECKUP_AREAS[caseAreaIndex].id,
    scores,
  };
}

/** 결과 제목 한 줄을 이루는 조각. `accent` 인 조각만 포인트 컬러로 칠한다 */
export interface CheckupResultTitlePart {
  text: string;
  accent?: boolean;
}

export interface CheckupAreaResultCopy {
  /** 2~3줄. 줄바꿈 위치도 시안 그대로다 */
  titleLines: readonly (readonly CheckupResultTitlePart[])[];
  /** 본문 2문단 */
  body: readonly [string, string];
}

/*
 * 영역별 결과 문구.
 *
 * **`direction`(01) 한 벌만 시안 3.png 에서 옮긴 확정 문구다.** 나머지 셋은 같은 형식
 * (제목 2~3줄 + 본문 2문단)으로 쓴 **운영 확인 전 초안**이다. 운영 문구를 받으면 해당
 * 항목만 교체하면 되고, 형식이 같으므로 화면은 건드리지 않는다.
 */
export const CHECKUP_RESULT_COPY: Record<CheckupAreaId, CheckupAreaResultCopy> =
  {
    // 시안 3.png 확정 문구
    direction: {
      titleLines: [
        [{ text: '지금은 포트폴리오보다' }],
        [{ text: "'어디에 지원할지'", accent: true }, { text: '부터' }],
        [{ text: '정해야 해요.' }],
      ],
      body: [
        '마케팅 세부 직무를 이해하고 실제 채용공고를 살펴보며 내가 지원할 직무와 지원 범위를 먼저 좁혀보세요.',
        '직무가 정해지지 않은 상태에서 만든 서류는 어떤 공고에도 딱 맞지 않습니다. 방향을 먼저 잡으면 지금 가진 경험 중 무엇을 꺼내 써야 할지도 함께 보입니다.',
      ],
    },
    // 운영 확인 전 초안
    experience: {
      titleLines: [
        [{ text: '지금은 새 경험보다' }],
        [{ text: "'가진 경험의 해석'", accent: true }, { text: '부터' }],
        [{ text: '시작해야 해요.' }],
      ],
      body: [
        '지금까지 한 활동을 빠짐없이 적어 두고, 지원 직무와 연결되는 판단과 인사이트를 먼저 뽑아보세요.',
        '성과가 크지 않았던 경험도 문제와 판단, 실행과 회고로 풀어내면 직무 역량이 됩니다. 쓸 경험이 없는 것이 아니라 아직 해석하지 않은 것입니다.',
      ],
    },
    // 운영 확인 전 초안
    document: {
      titleLines: [
        [{ text: '경험은 있으니,' }],
        [{ text: "'채용공고에 맞춘 서류'", accent: true }, { text: '로' }],
        [{ text: '옮겨야 해요.' }],
      ],
      body: [
        '이력서 · 자소서 · 포트폴리오 초안을 먼저 끝까지 완성하고, 지원할 공고의 요구 역량에 맞춰 경험의 순서와 강조점을 바꿔보세요.',
        '같은 서류를 모든 기업에 내면 어디에도 맞지 않습니다. 초안이 있어야 무엇을 덜어내고 무엇을 더할지 판단할 수 있습니다.',
      ],
    },
    // 운영 확인 전 초안
    apply: {
      titleLines: [
        [{ text: '서류는 준비됐으니,' }],
        [{ text: "'지원과 전형 대응'", accent: true }, { text: '을' }],
        [{ text: '다듬어야 해요.' }],
      ],
      body: [
        '실제 지원을 이어가며 결과를 기록하고, 서류와 면접 중 어디에서 막히는지 확인해 다음 지원을 고쳐보세요.',
        '지원은 한 번에 끝나는 일이 아니라 결과를 보고 고쳐 나가는 과정입니다. 경험 기반 예상 질문과 답변 세트를 준비해 두면 면접에서 흔들리지 않습니다.',
      ],
    },
  };

/** 시안 3.png 의 고정 문구 */
export const CHECKUP_RESULT = {
  /** 마지막 문항을 답하면 이 자리로 스크롤한다 */
  anchorId: 'checkup-result',
  /** 답하기 전에도 보이는 안내 */
  guideLines: [
    '위 5문항 무료진단에 답하면',
    '진단 결과와 나에게 필요한 준비가 아래에 표시됩니다.',
  ],
  eyebrow: 'CAREER CHECK RESULT',
  title: '마케팅 취준 진단 결과',
  restart: '다시 진단하기',
  badge: '★ 지금 당신에게 가장 먼저 필요한 준비',
  cta: '준비 단계 확인하기',
} as const;
