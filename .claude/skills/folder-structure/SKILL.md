---
name: folder-structure
description: 렛츠커리어 프론트엔드 폴더 구조 규칙. 새 파일이나 컴포넌트를 만들 때, 파일 위치를 결정할 때, import 구조를 설계할 때 자동 활성화. DDD + 프랙탈 아키텍처 기반으로 도메인 우선 → 내부 레이어 분리 → 복잡도 증가 시 하위 도메인 재귀 분리.
---

# 폴더 구조 — DDD + Fractal Architecture

## 핵심 원칙

1. **도메인 우선 (Domain-First)**: 최상위 구조는 기술이 아닌 비즈니스 도메인으로 나눈다
2. **내부 레이어 분리 (Layered Inside)**: 각 도메인 내부를 역할별 레이어로 구성한다
3. **프랙탈 재귀 (Fractal Recursion)**: 도메인이 복잡해지면 하위 도메인을 만들고 동일한 패턴을 반복한다
4. **단일 책임 (Single Responsibility)**: 하나의 폴더에는 하나의 기능만 담는다
5. **독립 삭제 가능 (Independent Deletion)**: 도메인 폴더를 통째로 지워도 다른 곳이 깨지지 않아야 한다

자세한 전략과 예시는 아래 참조 문서에서 확인한다.

- @references/domain-first.md — 도메인 우선 구조화 전략
- @references/fractal-recursion.md — 프랙탈 재귀 분리 기준과 예시
- @references/layer-conventions.md — 레이어 역할 및 네이밍 규칙

## 디렉토리 구조

```
src/
  app/        ← 라우팅만 (페이지 라우트 정의)
  domain/     ← 비즈니스 로직 (도메인별 컴포넌트, 훅, 유틸)
  common/     ← 범용 UI (3개 이상 도메인에서 사용하는 컴포넌트)
  api/        ← API 호출
  hooks/      ← 공유 훅 (3개 이상 도메인에서 사용)
  store/      ← Zustand 상태 관리
  utils/      ← 공유 유틸 (3개 이상 도메인에서 사용)
  types/      ← 공유 타입
```

## 도메인 내부 레이어 구조

각 도메인 폴더는 아래 레이어로 구성한다. 필요한 레이어만 생성한다.

```
domain/{도메인}/
  ui/         ← 이 도메인 전용 UI 컴포넌트
  hooks/      ← 이 도메인 전용 커스텀 훅
  types/      ← 이 도메인 전용 타입 정의
  utils/      ← 이 도메인 전용 유틸리티
  constants/  ← 이 도메인 전용 상수
  schema/     ← 이 도메인 전용 Zod 스키마
```

## 프랙탈 재귀 — 하위 도메인 분리

도메인 내부가 복잡해지면 하위 도메인을 만들고 동일한 레이어 패턴을 반복한다.

```
domain/challenge/
  ui/                        ← challenge 공통 UI
  hooks/                     ← challenge 공통 훅
  types/                     ← challenge 공통 타입
  feedback/                  ← 하위 도메인 (복잡도 증가로 분리)
    ui/                      ← feedback 전용 UI
    hooks/                   ← feedback 전용 훅
    types/                   ← feedback 전용 타입
  mission/                   ← 하위 도메인
    ui/
    hooks/
    types/
```

## 파일 배치 기준

| 사용 범위                | 배치 위치                     |
| ------------------------ | ----------------------------- |
| 1개 도메인에서만 사용    | `domain/{도메인}/` 안에       |
| 2~3개 도메인에서 사용    | 핵심 도메인 폴더에            |
| 3개 이상 도메인에서 사용 | `common/`, `hooks/`, `utils/` |

## 빠른 판단 기준

새 파일을 만들 때 아래 순서로 결정한다:

1. **어느 도메인에 속하는가?** → `domain/{도메인}/`에 배치
2. **어떤 역할인가?** → 해당 레이어(`ui/`, `hooks/`, `types/` 등)에 배치
3. **기존 도메인이 복잡한가?** → 하위 도메인을 만들고 동일 패턴 반복
4. **여러 도메인에서 쓰는가?** → 3개 이상이면 `common/` 등 공유 영역으로 승격

## 금지 사항

- `domain/A/` → `domain/B/` 직접 import (도메인 간 직접 참조 금지)
- 새 컴포넌트를 `src/components/`에 넣기 (레거시 경로)
- 순환 참조
- 기존 파일 함부로 이동 (영향 범위 확인 필수)
- 레이어 없이 도메인 폴더 루트에 파일 나열 (레이어로 분류할 것)
