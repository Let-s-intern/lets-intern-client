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
   * **낮은 수준 → 높은 수준 순서다.** 이 순번이 그대로 영역 점수가 되므로,
   * 순서를 바꾸면 진단 결과가 뒤집힌다.
   */
  options: readonly string[];
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

export const CHECKUP_QUESTIONS = [
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
  },
] as const satisfies readonly CheckupQuestion[];

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
