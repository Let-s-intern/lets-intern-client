---
name: git-branch-report
description: >-
  현재 브랜치의 작업 내역을 팀 공유용 흑백 HTML/PDF 보고서로 자동 생성한다. "이번 작업 공유하고 싶어",
  "작업 내역 정리해줘", "팀원 공유 문서 만들어줘", "브랜치 작업 문서화", "기능 설명 문서 만들어줘",
  "버그 수정한 거 공유", "리팩터링 정리해줘", "보안 패치 문서", "이번 스프린트 작업 공유" 처럼 말하거나,
  방금 끝낸 브랜치·PR 작업을 동료/팀/보안팀에게 설명·정리·공유·보고하려는 맥락이면 반드시 이 스킬을 사용하라.
  현재 체크아웃된 브랜치의 git log 를 자동 분석하므로 브랜치명을 따로 입력받지 않는다 — 사용자는 "무엇을
  공유하고 싶은지"만 자연어로 말하면 된다. 단, 단순 'git log 보여줘'·커밋 조회·diff 확인에는 쓰지 말 것.
---

# Git Branch Report

브랜치 작업이 끝난 뒤 "이번에 뭐 했어?"를 매번 손으로 정리하는 번거로움을 없앤다.
사용자가 **공유하고 싶은 내용을 자연어로 설명**하면, 현재 브랜치의 git log 를 자동 분석해
작업 유형에 맞는 흑백 보고서(HTML + PDF)를 만든다.

## 핵심 원칙

- **브랜치명을 받지 않는다.** 현재 체크아웃된 브랜치를 자동 감지한다. 사용자에게 브랜치를 묻지 마라.
- **자연어 설명이 1순위.** git log 분석은 보조다. 둘이 충돌하면 사용자의 설명을 따른다.
- **흑백·직각·무아이콘.** 디자인은 색·이모지·라운드 없이 글자 굵기와 테두리로만 위계를 만든다
  (`templates/_base.css` 에 강제). 새 색이나 장식을 임의로 넣지 마라.

## 입력

- (필수) 공유하고 싶은 내용에 대한 자연어 설명 — 배경·목적·강조점. 템플릿 선택과 섹션 내용의 근거.
- (선택) 캡처할 페이지 URL — `feature` 유형에서 화면을 보여주고 싶을 때만. 로컬 dev 서버 URL 권장.

## 워크플로우

권장 경로는 오케스트레이터 `scripts/report.sh` 하나로 extract→capture→build→pdf 를 순서대로 돌리는 것이다.
Claude 가 할 일은 **유형 판단 + content.json 작성**뿐이다.

```
[1] git 데이터 추출 (자동 감지)
    bash scripts/extract_git_log.sh > /tmp/gbr-git.json
    → 결과 JSON 의 branch / total_commits / category_counts / commits 를 살펴본다.
    → stderr 안내가 떴고 stdout 이 비었으면(엣지케이스), 아래 "엣지케이스" 표를 따른다.

[2] 문서 유형 판단
    → 사용자의 자연어 설명을 1순위로, category_counts 를 보조로 유형 결정.
    → 판단 기준과 type 값은 templates/_index.md "템플릿 선택 로직" 참조.

[3] content.json 작성  (이 스킬에서 가장 중요한 단계 — Claude 가 직접 쓴다)
    → git log 만으로 알 수 없는 배경·목적·구현 설명을 자연어로 채운다.
    → 스키마와 유형별 sections 필드는 templates/_index.md "content.json 계약" 참조.
    → /tmp/gbr-content.json 등에 저장.

[4] 보고서 생성 (한 방)
    bash scripts/report.sh --content /tmp/gbr-content.json --git /tmp/gbr-git.json
    → 출력 디렉토리 확정 → (feature+URL 이면) 화면 캡처 → HTML 합성 → PDF 변환.
    → 마지막 줄에 출력 디렉토리 경로가 찍힌다.

[5] 결과 전달
    → <출력폴더>/report.pdf (팀 공유용) 와 report.html (수정용) 을 사용자에게 알린다.
```

`--git` 을 생략하면 `report.sh` 가 현재 저장소에서 자동 추출한다.
PDF 가 필요 없으면 `--no-pdf`. base 브랜치가 main 이 아니면 `GBR_BASE=develop bash scripts/report.sh ...`.

### 개별 스크립트 (디버깅·부분 실행용)

| 스크립트 | 역할 |
| --- | --- |
| `scripts/extract_git_log.sh [repo]` | 현재 브랜치 자동 감지 → 표준 JSON(stdout). base 자동 감지(main→origin/HEAD→master→develop, `GBR_BASE` 로 override). |
| `scripts/build_report.js --git <j> --content <c> [--out <dir>]` | 템플릿 + git + content → `report.html`(자족적, CSS inline). |
| `scripts/capture_screens.js --content <c> --out-dir <dir>/screens` | feature 전용. URL → 레티나 fullPage PNG. 실패해도 계속. |
| `scripts/render_to_pdf.js --html <report.html>` | A4 흑백 PDF. Playwright 없으면 건너뜀(HTML 유지). |

## 출력 위치

```
<repo>/.claude/tasks/branch_reports/<유형>-<브랜치(슬래시→하이픈)>-<YYYYMMDD>/
├── report.html      # 자족적 HTML (CSS inline, 메일·이동 OK)
├── report.pdf       # A4 흑백 (Playwright 있을 때)
└── screens/         # feature + URL 제공 시
    └── screen-1.png ...
```

## 엣지케이스

| 상황 | 처리 |
| --- | --- |
| 자연어 설명 ↔ 커밋 유형 불일치 | 자연어 설명을 따른다. |
| 현재 브랜치가 base(main 등) | extract 가 경고 후 빈 출력 → 작업 브랜치로 체크아웃 안내. |
| base 대비 커밋 0개 | extract 가 안내 후 빈 출력 → `git log <base>..HEAD` 직접 확인 유도. |
| base 브랜치 자동 감지 실패 | `GBR_BASE` 로 지정하도록 안내. |
| 단일 커밋 | 타임라인 자동 생략, 요약 중심(build_report.js 가 처리). |
| URL 제공했으나 서버 미실행/로그인 필요 | 해당 화면만 "캡처 실패" 빈 칸, 나머지는 정상 진행. 로컬 dev 서버 권장. |
| Playwright 미설치 | HTML 만 생성. PDF 는 "브라우저에서 인쇄→PDF 저장" 또는 `npx playwright install chromium` 안내. |

## 의존성

- 필수: `git`, `jq`, `node`(v18+).
- 선택: `playwright`(PDF·화면 캡처). 없으면 HTML 까지는 항상 생성된다.

## 디자인 규칙 (어기지 말 것)

색은 `#000`/`#fff`/`#f5f5f5`/`#555`(보조 텍스트)만. 이모지·SVG 아이콘·`border-radius` 금지.
폰트는 Noto Sans KR 단일, 위계는 size·weight·테두리로만. 강조는 굵기 또는 밑줄.
이 규칙은 `templates/_base.css` 에 구현돼 있으니, 보고서 톤을 바꾸려면 거기서 한다.
