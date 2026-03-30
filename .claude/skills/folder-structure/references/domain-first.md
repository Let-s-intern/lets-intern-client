# 도메인 우선 구조화 전략

## 원칙

폴더 구조의 최상위 분류 기준은 **기술 역할이 아닌 비즈니스 도메인**이다.

```
# 나쁜 예 — 기술 역할 기준 (Screaming Architecture 위반)
src/
  components/
    ChallengeCard.tsx
    ProgramCard.tsx
    MentorProfile.tsx
  hooks/
    useChallengeList.ts
    useProgramDetail.ts
  utils/
    challengeFormatter.ts
    programPrice.ts

# 좋은 예 — 도메인 기준
src/
  domain/
    challenge/
      ui/ChallengeCard.tsx
      hooks/useChallengeList.ts
      utils/challengeFormatter.ts
    program/
      ui/ProgramCard.tsx
      hooks/useProgramDetail.ts
      utils/programPrice.ts
    mentor/
      ui/MentorProfile.tsx
```

## 왜 도메인 우선인가

1. **Screaming Architecture**: 폴더 구조만 봐도 이 프로젝트가 무엇을 하는지 알 수 있다
2. **변경 응집도**: 비즈니스 요구사항 변경 시 관련 파일이 한 폴더에 모여 있어 수정 범위가 명확하다
3. **독립 배포/삭제**: 도메인 폴더 단위로 기능을 추가하거나 제거할 수 있다
4. **팀 소유권**: 도메인 단위로 팀/담당자를 지정할 수 있다

## 도메인 식별 기준

| 기준 | 예시 |
|------|------|
| 독립적인 비즈니스 개념인가? | challenge, program, mentor, payment |
| 독립적인 페이지/라우트가 있는가? | `/challenge`, `/program`, `/mentor` |
| 독립적인 API 엔드포인트 그룹이 있는가? | `/api/challenges/*`, `/api/programs/*` |
| 담당자/팀을 따로 지정할 수 있는가? | 챌린지팀, 멘토링팀 |

## 도메인 vs 공유 코드 판단

```
이 코드가 특정 비즈니스 개념에 속하는가?
  ├─ YES → domain/{도메인}/ 안에 배치
  └─ NO → 기술적 유틸리티인가?
       ├─ YES → common/, hooks/, utils/ 등 공유 영역
       └─ NO → 다시 생각해보기 (대부분 어딘가에 속한다)
```

## 도메인 간 통신

도메인 간 직접 import는 금지한다. 공유가 필요한 코드는 공유 영역으로 승격한다.

```
# 금지 — 도메인 간 직접 참조
import { ProgramCard } from '@/domain/program/ui/ProgramCard'
// challenge 도메인에서 program 도메인 직접 import

# 허용 — 공유 영역 통해 참조
import { PriceTag } from '@/common/PriceTag'
// 여러 도메인에서 쓰이므로 공유 영역으로 승격된 컴포넌트
```
