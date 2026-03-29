# 프랙탈 재귀 분리 기준과 예시

## 원칙

도메인 내부가 복잡해지면 **하위 도메인을 만들고 동일한 레이어 패턴을 반복**한다. 어느 레벨에서 잘라도 같은 구조가 보인다.

```
domain/challenge/           ← 1레벨 도메인
  ui/
  hooks/
  types/
  feedback/                 ← 2레벨 하위 도메인 (동일 패턴)
    ui/
    hooks/
    types/
    report/                 ← 3레벨 하위 도메인 (필요하면 계속)
      ui/
      hooks/
      types/
```

## 분리 시점 — 언제 하위 도메인을 만드는가

아래 기준 중 **2개 이상** 해당하면 하위 도메인으로 분리한다:

| 기준 | 설명 |
|------|------|
| **파일 수** | 한 레이어(예: `ui/`)에 파일이 7개 이상 |
| **독립적 개념** | 상위 도메인과 구분되는 비즈니스 개념이 존재 |
| **독립적 변경** | 하위 기능만 수정해도 상위 도메인의 다른 부분에 영향 없음 |
| **독립적 라우트** | 별도의 하위 라우트가 존재 (예: `/challenge/feedback`) |

## 분리 과정

### Before: 평면 구조 (복잡도 증가)

```
domain/challenge/
  ui/
    ChallengeCard.tsx
    ChallengeList.tsx
    ChallengeMission.tsx
    ChallengeMissionForm.tsx
    ChallengeMissionList.tsx
    ChallengeFeedbackCard.tsx
    ChallengeFeedbackList.tsx
    ChallengeFeedbackDetail.tsx
    ChallengeFeedbackReport.tsx     ← 파일이 많아지고 있음
  hooks/
    useChallengeList.ts
    useChallengeMission.ts
    useChallengeFeedback.ts
    useChallengeFeedbackReport.ts
```

### After: 프랙탈 분리

```
domain/challenge/
  ui/
    ChallengeCard.tsx
    ChallengeList.tsx
  hooks/
    useChallengeList.ts
  mission/                          ← 하위 도메인
    ui/
      MissionForm.tsx
      MissionList.tsx
    hooks/
      useMission.ts
  feedback/                         ← 하위 도메인
    ui/
      FeedbackCard.tsx
      FeedbackList.tsx
      FeedbackDetail.tsx
    hooks/
      useFeedback.ts
    report/                         ← 2단계 하위 도메인
      ui/
        FeedbackReport.tsx
      hooks/
        useFeedbackReport.ts
```

## 주의사항

- **과도한 분리 금지**: 파일이 2~3개뿐이면 하위 도메인으로 분리하지 않는다
- **최대 깊이**: 3레벨을 넘기지 않는다. 넘기면 도메인 설계를 재검토한다
- **네이밍**: 하위 도메인으로 분리되면 상위 도메인 접두사를 제거한다
  - `ChallengeFeedbackCard.tsx` → `feedback/ui/FeedbackCard.tsx`
- **상위 도메인 레이어**: 하위 도메인들이 공유하는 코드는 상위 도메인의 레이어에 둔다

## 하위 도메인 간 관계

```
domain/challenge/
  types/index.ts              ← challenge 공통 타입 (하위 도메인들이 공유)
  mission/
    types/index.ts            ← mission 전용 타입
  feedback/
    types/index.ts            ← feedback 전용 타입
```

- 하위 도메인은 **상위 도메인의 공유 레이어**를 import할 수 있다
- 하위 도메인 간 **직접 import는 금지**한다 (도메인 간 참조 금지 원칙 동일 적용)
