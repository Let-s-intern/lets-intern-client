---
name: swagger-api-finder
description: >-
  렛츠커리어 API 엔드포인트와 요청/응답 계약(스펙)을 Swagger(OpenAPI)에서 빠르고 토큰 적게 찾는 스킬.
  배포 서버의 api-docs(약 357KB·257 엔드포인트·449 스키마)는 통째로 읽으면 9만 토큰을 잡아먹으니 절대 그러지 마라.
  대신 번들된 `scripts/swagger.py` 가 디스크 캐시에서 필요한 조각만 추출하므로 한 번 조회에 1~2K 토큰이면 된다.
  "이 기능 API가 뭐야", "엔드포인트 찾아줘", "요청/응답 형태", "어떤 API들이 있어", "API 목록", "이 path 스펙",
  "Swagger에서 확인", "API 계약 확인" 같은 요청이면 이 스킬을 써라. 단순히 API path/method/요청·응답 형태만
  궁금하면 서버 Java 소스를 뒤지기보다 이 스킬이 더 싸고 빠르다. 단, Swagger UI 를 로컬에서 실행하거나,
  클라이언트 코드(컴포넌트·훅·zod 스키마)를 작성·수정하거나, 서버 비즈니스 로직·DB 저장 구조를 파악하는 작업에는
  쓰지 마라 — 각각 환경 설정·구현 작업·server-code-reference 의 몫이다.
---

# Swagger API 탐색기

렛츠커리어 배포 서버의 OpenAPI 스펙에서 **엔드포인트와 요청/응답 계약을 빠르게** 찾는다.

## 왜 이 방식인가

전체 스펙은 약 357KB(≈9만 토큰)다. 통째로 컨텍스트에 올리면 한 번에 컨텍스트를 거의 다 쓴다.
그래서 **모델은 스펙 원본을 읽지 않는다.** 번들된 `scripts/swagger.py` 가 스펙을 디스크에 캐시하고,
거기서 필요한 엔드포인트 한 개와 그게 참조하는 스키마만 잘라 stdout 으로 준다. 그 조각만 컨텍스트에
들어오므로 조회당 약 1~2K 토큰이면 끝난다(전체 대비 약 70배 절감, 실측 기준).

**원칙: 절대 `cat`/`curl` 로 api-docs 전체를 읽지 마라.** 항상 아래 스크립트로 조회한다.

## 사용법

스크립트는 클라이언트 레포 루트에서 실행한다.

```bash
P=.claude/skills/swagger-api-finder/scripts/swagger.py

python3 $P search <키워드> [키워드 ...]   # 1단계: 엔드포인트 찾기 (키워드 AND 검색)
python3 $P show <METHOD> <PATH>            # 2단계: 그 엔드포인트 + 참조 스키마만 추출
python3 $P list [--tag TAG]               # 전체/태그별 엔드포인트 인덱스
python3 $P schema <SchemaName>            # 특정 스키마 + 중첩 스키마만
python3 $P tags                           # 태그(컨트롤러) 목록
```

옵션: `--refresh`(캐시 무시·재다운로드), `--url <URL>`(스펙 URL 지정).
캐시는 6시간 후 자동 갱신되고 `cache/` 에 저장되며 git 에는 올라가지 않는다.

## 표준 흐름 (검색 → 추출)

대부분의 질문은 이 2단계로 끝난다. **경로를 모르면 먼저 `search`/`list` 로 좁힌 뒤 `show`** 한다.
처음부터 `show` 에 추측 경로를 넣지 마라 — 빗나가면 왕복만 늘어난다.

**예시: "프로그램 신청 API 응답 형태가 뭐야?"**

```bash
# 1) 후보 찾기
python3 $P search 신청 program
#   → POST   /api/v1/application/{programId}  [application-v-1-controller]  — 신청서 생성

# 2) 정확한 계약 추출 (요청 바디·응답·참조 스키마까지)
python3 $P show POST /api/v1/application/{programId}
```

경로에 `{programId}` 같은 path 파라미터가 있으면 **스펙에 적힌 그대로** 넣는다(중괄호 포함).
경로가 빗나가면 스크립트가 비슷한 경로를 추천하니 그걸 보고 다시 `show` 한다.

## 출력 읽는 법

- `search`/`list`/`tags`: `METHOD PATH [태그] — 요약` 한 줄 형식. 사람이 훑기 좋다.
- `show`/`schema`: JSON. `operation`(요청/응답 구조)과 `schemas`(참조된 컴포넌트만, 449개 중 필요한 몇 개)로 나뉜다.
  응답 형태는 `operation.responses.<code>.content` 의 `$ref` 가 가리키는 스키마를 `schemas` 에서 보면 된다.

사용자에게 보고할 때는 엔드포인트를 `METHOD /path` 로 인용하고, 필드는 스키마명과 함께 짚어준다.

## 다른 스킬과의 역할 분담

- **이 스킬(swagger-api-finder)**: API 목록·경로·요청/응답 계약을 *빠르고 싸게*. 프론트에서 어떤 엔드포인트를
  어떤 형태로 호출하는지 확인할 때 1순위.
- **server-code-reference**: 비즈니스 로직, 트랜잭션 흐름, DB 저장 구조(Entity), 커스텀 쿼리(QueryDSL)처럼
  *Swagger 에 안 드러나는 실제 동작*이 필요할 때. Swagger 와 실제 동작이 어긋나 보이면 여기로 교차 검증.
