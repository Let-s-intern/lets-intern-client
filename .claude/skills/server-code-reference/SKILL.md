---
name: server-code-reference
description: >-
  렛츠커리어 백엔드(Spring Boot) 서버 코드를 직접 확인·검증할 때 사용하는 스킬. 서버 레포는 클라이언트 레포 기준 형제 폴더
  `../lets-career-server` 에 있다. API 요청/응답 형태, DTO·VO·Entity 구조, 엔드포인트 실제 동작, 도메인 비즈니스
  로직, 에러 코드를 알아야 할 때 자동 활성화한다. "서버 코드 확인", "BE 응답 형태가 뭐야", "이 API 실제 스펙",
  "엔티티/DTO 구조 보여줘", "백엔드에서 어떻게 처리하는지", "Swagger 말고 실제 코드" 같은 요청이면 추측하지 말고
  이 스킬로 실제 소스를 읽어라. 1544개 파일을 grep 으로 헤매지 말고, 먼저 `references/server-structure.md`
  구조 트리로 파일 위치를 바로 짚어 토큰 낭비를 막아라.
---

# 렛츠커리어 서버 코드 레퍼런스

클라이언트(이 레포)에서 작업하다가 **백엔드 실제 동작을 확인해야 할 때** 쓰는 스킬이다.
Swagger 문서나 추측에 의존하지 말고 서버 소스를 직접 읽어 정확한 스펙을 확인한다.

## 서버 위치 (상대경로)

서버 레포는 **클라이언트 레포의 형제 폴더**다. 절대경로(`/Users/...`)는 쓰지 마라 — 사람마다 다르다.

```
workspace/
├── lets-intern-client/   ← 지금 이 레포 (cwd)
└── lets-career-server/   ← 서버 (= ../lets-career-server)
```

모든 명령은 **클라이언트 레포 루트** 기준 `../lets-career-server` 로 접근한다.
소스 루트는 `../lets-career-server/src/main/java/org/letscareer/letscareer/` 이다.

cwd 가 레포 루트가 아니면 먼저 루트로 이동한다. 서버 폴더가 없으면 추측하지 말고
"서버 레포를 형제 폴더로 클론해 주세요 (`../lets-career-server`)" 라고 사용자에게 알린다.

## 시작 절차

1. **존재 확인**: `ls ../lets-career-server` 로 서버가 형제 폴더에 있는지 본다.
2. **동기화 확인**: 검증 전 반드시 origin 과 맞춘다. 로컬이 stale 하면 잘못된 결론을 내린다.
   ```bash
   git -C ../lets-career-server fetch --quiet && git -C ../lets-career-server status -sb
   ```
   `behind` 가 보이면 사용자에게 알리고, 필요하면 pull 여부를 확인한다.
3. **구조 트리 먼저 읽기**: 파일을 찾으려고 광범위 grep/find 를 돌리기 전에
   `references/server-structure.md` 를 읽어라. 도메인 목록·레이어 규칙·API 경로 매핑이
   정리돼 있어, 어디를 봐야 할지 바로 알 수 있다. 이게 토큰을 아끼는 핵심이다.

## 의도별 탐색 맵

질문 유형마다 봐야 할 레이어가 정해져 있다. 도메인을 `{domain}` 으로 두면:

| 알고 싶은 것 | 읽을 위치 |
|---|---|
| 엔드포인트 목록·HTTP 메서드·URL | `domain/{domain}/controller/*Controller.java` |
| 응답 JSON 형태 | `domain/{domain}/dto/response/*ResponseDto.java` |
| 요청 바디·파라미터 | `domain/{domain}/dto/request/*RequestDto.java` |
| DB 테이블·컬럼·연관관계 | `domain/{domain}/entity/*.java` |
| 쿼리 결과 투영(조인 결과) | `domain/{domain}/vo/*Vo.java` |
| 비즈니스 로직·트랜잭션 흐름 | `domain/{domain}/service/*.java` |
| 커스텀 쿼리(QueryDSL) | `domain/{domain}/repository/*RepositoryImpl.java` |
| enum·상태값 | `domain/{domain}/type/*.java` |
| 도메인 에러 코드 | `domain/{domain}/error/*.java` |

도메인명을 모르면 트리의 **도메인 목록 + API 경로 매핑** 표에서 API 경로로 역추적한다.
그래도 못 찾을 때만 좁은 범위 grep 을 쓴다 (예: `grep -rl "특정문구" ../lets-career-server/src/main/java/.../domain/{후보}`).

## 검증 원칙

- **VO/DTO/Entity 를 직접 읽어라.** Swagger 는 누락·구버전일 수 있다. 실제 응답 형태가
  궁금하면 `dto/response` 와 `vo` 를, 저장 구조가 궁금하면 `entity` 를 본다.
- **클라이언트 타입과 대조.** 이 레포의 zod 스키마/타입이 서버 DTO 와 어긋나면 그 차이를
  사용자에게 명확히 보고한다.
- 읽은 파일은 `file_path:line` 형태로 인용해 사용자가 바로 찾아가게 한다.

## 트리 갱신

서버 구조가 바뀌어 `references/server-structure.md` 가 오래됐다고 의심되면 갱신 스크립트를 돌린다.
도메인 목록과 API 베이스 경로 매핑을 재생성해 표를 업데이트할 수 있다.

```bash
bash .claude/skills/server-code-reference/scripts/refresh-structure.sh
```

## 참조 파일

- `references/server-structure.md` — 기술 스택, 최상위 구조, 표준 도메인 레이어 규칙,
  45개 도메인 목록, 도메인↔API 경로 매핑, `global/` 구조, 탐색 치트시트. **탐색 전 먼저 읽어라.**
