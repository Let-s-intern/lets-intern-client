---
name: dev-docs-updater
description: >-
  `.claude/docs/` 에 있는 렛츠커리어 개발문서를 갱신·유지보수할 때 쓰는 스킬. 코드 구조가 바뀌었거나(새 도메인·
  패키지·공용 컴포넌트·훅·API·라우팅·배포·라이브러리 추가/변경/삭제), 문서가 실제 코드와 어긋났을 때 자동 활성화한다.
  "개발문서 업데이트", "문서 최신화", "문서 갱신", "이거 문서에 반영", "문서화해줘", "독스 업데이트" 같은 요청이면
  이 스킬을 따른다. 핵심 규칙: 개발문서를 고치면 반드시 인덱스(`.claude/docs/letscareer/README.md`)와 루트
  `CLAUDE.md`(그리고 import 되는 `AGENTS.md`) 의 디렉토리 트리·참조 매핑 표를 같이 갱신해 세 계층이 항상 일치하게
  만들어라. 문서 본문만 고치고 CLAUDE.md 를 빼먹으면 네비게이션이 깨지고 다음 사람이 길을 잃는다.
---

# 개발문서 업데이트

`.claude/docs/` 의 개발문서를 코드 현실과 일치하도록 갱신한다. 이 스킬의 존재 이유는 단순히 문서 한 장을
고치는 게 아니라, **문서 → 인덱스 → CLAUDE.md** 세 계층을 한 번에 맞춰 "길찾기"가 깨지지 않게 하는 것이다.

## 동기화해야 하는 3계층 (가장 중요)

문서는 세 곳에서 서로를 가리킨다. 하나만 고치면 나머지가 거짓말을 하게 된다. 항상 셋을 함께 본다.

1. **실제 문서** — `.claude/docs/letscareer/**` 의 내용 자체.
2. **문서 인덱스** — `.claude/docs/letscareer/README.md` 안의 *디렉토리 트리* 와 *빠른 진입점 표*.
3. **루트 길잡이** — `CLAUDE.md` 의 `.claude/ 길잡이` *트리* 와 *작업 → 참조 파일 매핑* 표,
   그리고 `CLAUDE.md` 가 `@AGENTS.md` 로 가져오는 `AGENTS.md` 의 *Current Domains* 목록·폴더 구조 설명.

→ **파일을 추가/이름변경/삭제하거나, 도메인·패키지 개수가 바뀌면 2번과 3번을 반드시 같이 고친다.**
   문서 *본문만* 미세 수정했고 구조가 그대로면 1번만 고쳐도 된다 (판단 기준은 "남이 파일을 찾는 경로가 바뀌었나?").

## 시작 전에: 문서 지도부터 읽어라

문서 레이아웃을 추측하지 마라. 두 파일이 현재 구조의 단일 진실원이다. **먼저 읽는다.**

- `.claude/docs/letscareer/README.md` — 전체 문서 트리 + 진입점 표 + 도메인 placeholder 표기 약속.
- `CLAUDE.md` — `.claude/ 길잡이` 트리와 작업→참조 매핑 (이게 2번 인덱스와 거울처럼 맞아야 한다).

그 다음 갱신이 필요한 부분만 골라 읽는다 (전체를 다 읽지 말 것 — 토큰 낭비).

## 워크플로우

1. **무엇이 바뀌었나 파악.** 보통 방금 끝낸 코드 변경에 맞춰 호출된다.
   `git diff`/`git log` 또는 사용자 설명으로 변경 범위를 좁힌다. 불명확하면 묻는다.
2. **영향 받는 문서 식별** — 아래 "변경 유형 → 문서 매핑" 표 사용.
3. **문서 본문 갱신** — 해당 `.md` 를 surgical 하게 수정. 사실만, 간결하게, placeholder 규칙 준수(아래).
4. **인덱스 갱신** — 파일·구조가 바뀌었으면 `docs/letscareer/README.md` 의 트리와 진입점 표를 맞춘다.
5. **CLAUDE.md(+AGENTS.md) 갱신** — `.claude/ 길잡이` 트리·매핑 표, 필요 시 AGENTS.md 도메인 목록을 맞춘다.
6. **검증** — `scripts/check-docs-sync.sh` 로 디스크↔인덱스↔CLAUDE.md 드리프트를 확인하고 남은 불일치를 고친다.

## 변경 유형 → 문서 매핑

| 코드에서 바뀐 것 | 갱신할 문서 | 인덱스/CLAUDE.md 영향 |
|---|---|---|
| 새 도메인 (`apps/web/src/domain/X`) | `apps/web/domain/X/README.md` 신규 + `apps/web/README.md` 도메인 수 | README 트리, CLAUDE.md 트리, AGENTS.md Current Domains |
| 도메인 삭제/이름변경 | 해당 도메인 문서 삭제/개명 | 위와 동일 (개수·이름 동기화) |
| 새 공유 패키지 (`packages/X`) | `packages/X.md` 신규 + `packages/README.md` | README 트리, CLAUDE.md 트리 |
| 공용 컴포넌트/훅 추가·변경 | `apps/web/components.md` / `hooks.md` / `services.md` | 보통 본문만 |
| admin/mentor 앱 구조 변경 | `apps/admin/README.md` / `apps/mentor/README.md` | 필요 시 트리 |
| API 동작·계약 변경 | 해당 도메인 문서 (Swagger URL 자체는 `API_docs/swagger_url.md`) | 보통 본문만 |
| 라우팅·SSO·배포·CI 변경 | `pnpm전환 메모 폴더/0X-*.md` | 새 파일이면 README 트리·진입점 표 |
| 라이브러리 추가/버전업 | `tech-stack/README.md` | 보통 본문만 |
| 시스템 구조·데이터 흐름 변경 | `architecture.md` | 보통 본문만 |

## CLAUDE.md 갱신 규칙

`CLAUDE.md` 본문에서 문서와 연동되는 부분은 둘이다. 그 외(behavioral 규칙 등)는 건드리지 않는다.

- **`.claude/ 길잡이` 트리** — `docs/letscareer/` 블록이 실제 문서 구조와 맞아야 한다. 도메인 수,
  패키지 목록, 새 폴더 등이 바뀌면 주석까지 반영.
- **작업 → 참조 파일 매핑 표** — 새 문서가 *새로운 "상황 → 볼 곳"* 을 만들 때만 행을 추가한다.
  단순 본문 수정으로는 표를 건드리지 않는다 (표는 네비게이션용이지 변경 로그가 아니다).
- **`AGENTS.md` (CLAUDE.md 가 import)** — 도메인이 추가/삭제되면 `## Current Domains` 의 `src/domain/`
  목록도 맞춘다. 폴더 구조 규칙 자체는 바뀐 게 아니면 두지 마라.

## 작성 규칙

- **운영/테스트 도메인 문자열은 placeholder 로.** `README.md` 의 "도메인 표기 약속" 표를 따른다
  (`<운영 도메인>`, `<API 호스트>` 등). 실제 호스트를 박지 마라.
- **사실만, 간결하게.** 문서는 코드의 거울이다. 추측·미래 계획·장황한 배경 설명을 넣지 마라.
- **기존 스타일·말투를 따른다.** 한국어, 표/트리 위주. 새 포맷을 발명하지 마라.
- **surgical.** 바뀐 부분만 고친다. 옆 문서를 "개선"하지 마라 (드리프트가 보이면 보고는 하되 범위는 지킨다).

## 검증

마지막에 항상 드리프트 체커를 돌린다. 디스크에 있지만 인덱스에 없는 문서, CLAUDE.md/README 가
가리키지만 사라진 문서를 잡아준다 (basename 기반 휴리스틱이라 100%는 아니다 — 의심스러우면 직접 확인).

```bash
bash .claude/skills/dev-docs-updater/scripts/check-docs-sync.sh
```

깨끗하게 통과할 때까지(또는 남은 항목이 의도된 것임을 확인할 때까지) 4~6단계를 반복한다.
