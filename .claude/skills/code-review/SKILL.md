---
name: code-review
description: 코드 리뷰 스킬. PR 리뷰, 변경된 파일 리뷰, 특정 경로 리뷰 모두 지원. /code-review 또는 /review로 수동 실행. PR 없이도 git diff 기반으로 리뷰 가능.
---

# 코드 리뷰

PR 또는 로컬 변경사항을 리뷰한다. PR이 없어도 동작한다.

## 실행 방법

```
/code-review                          # 현재 브랜치 변경사항 리뷰
/code-review src/domain/mentor        # 특정 경로 리뷰
/code-review #123                     # PR 번호로 리뷰
/code-review https://github.com/...   # PR URL로 리뷰
```

## 리뷰 대상 결정

1. **PR 번호/URL이 주어진 경우** → `gh pr diff`로 변경사항 조회
2. **경로가 주어진 경우** → 해당 경로의 모든 파일을 리뷰
3. **아무것도 없는 경우** → `git diff main...HEAD`로 현재 브랜치 변경사항 리뷰
4. **staged 변경만 있는 경우** → `git diff --cached`로 리뷰

## 리뷰 체크리스트

### 1단계: 구조 리뷰 (`/folder-structure` 스킬 참조)

- [ ] 파일이 올바른 도메인에 배치되었는가?
- [ ] 레이어(ui/, hooks/, types/ 등)가 올바르게 사용되었는가?
- [ ] 도메인 간 직접 import가 없는가?
- [ ] 하나의 폴더에 하나의 기능만 담겨있는가?
- [ ] 300줄 이상인 파일이 있는가? → 분리 제안
- [ ] 프랙탈 재귀 분리가 필요한 복잡도인가? (레이어 내 7개+ 파일)

### 2단계: 코드 품질 리뷰 (`/code-quality` 스킬 참조)

- [ ] **가독성**: 한 번에 고려하는 맥락이 적은가? 위→아래로 읽히는가?
- [ ] **예측 가능성**: 이름만 보고 동작을 알 수 있는가?
- [ ] **응집도**: 함께 수정되는 코드가 같은 곳에 있는가?
- [ ] **결합도**: 수정 영향 범위가 좁은가?

자세한 판단 기준:
- @code-quality:references/readability.md
- @code-quality:references/predictability.md
- @code-quality:references/cohesion.md
- @code-quality:references/coupling.md
- @code-quality:references/tradeoffs.md

### 3단계: React 성능 리뷰 (`/vercel-react-best-practices` 스킬 참조)

- [ ] 불필요한 리렌더가 발생하는가?
- [ ] memo/useMemo/useCallback이 적절한가?
- [ ] 비동기 작업이 병렬 처리되는가?
- [ ] 동적 import가 필요한 큰 컴포넌트가 있는가?
- [ ] barrel import로 번들 크기가 커지는가?

### 4단계: 안전성 리뷰

- [ ] 타입 안전성: any 사용, 타입 단언 남용
- [ ] XSS: dangerouslySetInnerHTML, 사용자 입력 미검증
- [ ] 에러 핸들링: 빈 catch, 무시된 에러
- [ ] 메모리 릭: 정리되지 않는 이벤트 리스너, 타이머

## 리뷰 출력 형식

```markdown
## 코드 리뷰 결과

### 요약
- 변경 파일: N개
- 심각도별: 🔴 Critical N개 / 🟡 Warning N개 / 🔵 Info N개

### 🔴 Critical — 반드시 수정

**[파일경로:줄번호]** 제목
> 문제 설명
```수정 제안```

### 🟡 Warning — 수정 권장

...

### 🔵 Info — 참고

...

### 구조 개선 제안 (있는 경우)
- 파일 이동/분리 제안
- 레이어 재배치 제안
```

## 심각도 기준

| 심각도 | 기준 |
|--------|------|
| 🔴 Critical | 버그, 보안 취약점, 데이터 손실 가능성, 도메인 간 직접 참조 |
| 🟡 Warning | 성능 문제, 300줄 초과, 레이어 미분류, 네이밍 불일치 |
| 🔵 Info | 코드 스타일, 개선 제안, 더 나은 패턴 |
