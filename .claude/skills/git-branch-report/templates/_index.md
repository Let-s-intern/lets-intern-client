# 템플릿 선택 기준 & content.json 계약

이 문서는 Claude 가 (1) 어떤 템플릿을 고를지, (2) `build_report.js` 에 넘길 `content.json` 을
어떻게 채울지 판단할 때 참조한다. SKILL.md 본문에서 필요할 때 이 파일을 읽는다.

---

## 1. 템플릿 선택 로직

핵심 원칙: **사용자의 자연어 설명이 1순위**, git log 커밋 분포는 보조(2순위)다.
둘이 충돌하면 자연어를 따른다. (예: 설명은 "기능 추가"인데 커밋은 fix 위주여도 → `feature`)

판단 순서:

1. 자연어 설명에 아래 표의 힌트 키워드가 뚜렷하면 그 유형으로 결정.
2. 불명확하면 `category_counts` 로 보조 판단(특정 유형이 과반이면 그 유형).
3. 그래도 애매하거나 여러 성격이 섞였으면 `mixed`.

| 유형       | type 값     | 자연어 힌트                                 | git log 보조 조건       |
| ---------- | ----------- | ------------------------------------------- | ----------------------- |
| 기능 구현  | `feature`   | "기능 추가", "새로 만들었어", "구현했어"    | feat 커밋 과반          |
| 오류 수정  | `bugfix`    | "버그 고쳤어", "오류 수정", "에러 잡았어"   | fix 커밋 과반           |
| 리팩터링   | `refactor`  | "리팩터링", "구조 바꿨어", "정리했어"       | refactor 커밋 과반      |
| 보안 패치  | `security`  | "보안", "취약점", "패치", "CVE"             | security 키워드 감지    |
| 혼합 작업  | `mixed`     | "전반적으로", "여러 가지", "이것저것"       | 위 조건 미충족          |

---

## 2. content.json 스키마 (build_report.js 입력 계약)

`type` 만 필수다. 나머지는 채운 만큼만 문서에 나오고, 빈 필드의 섹션 제목은 자동 생략된다.
git 데이터(브랜치·기간·작성자·커밋 수·타임라인·변경 파일)는 `git.json` 에서 자동으로 들어가므로
**여기에는 git log 만으로 알 수 없는 "배경·목적·설명"만** 자연어로 채운다.

```json
{
  "type": "feature",
  "title": "선택 — 문서 제목(기본값: 브랜치명)",
  "author": "선택 — 작성자 표기(기본값: git 저자)",
  "summary": "권장 — 사용자 설명 기반 한 줄 핵심 요약",
  "changes": [
    {
      "heading": "변경 묶음 제목",
      "detail": "이 묶음이 무엇을/왜 바꿨는지 자연어 설명",
      "files": ["src/api/resume.ts", "src/components/ResumeAnalyzer.tsx"]
    }
  ],
  "sections": { "유형별 필드는 아래 표 참조": "" },
  "screens": [
    { "url": "http://localhost:3000/resume", "caption": "이력서 업로드 화면" }
  ]
}
```

### 유형별 `sections` 필드

| type       | sections 키 (전부 자연어 문자열, 단락 1개 권장)                          |
| ---------- | ------------------------------------------------------------------------ |
| `feature`  | `background`(배경/문제), `implementation`(구현 방식), `entrypoint`(진입점) |
| `bugfix`   | `problem`(현상), `cause`(원인), `fix`(해결), `prevention`(재발 방지)       |
| `refactor` | `motivation`(동기), `beforeAfter`(전/후 구조), `impact`(외부 영향)         |
| `security` | `vulnerability`(취약점), `patch`(패치 요약), `scope`(영향 범위)            |
| `mixed`    | `background`(배경), `highlights`(문자열 배열 — 하이라이트 목록)            |

### 작성 규칙 (중요)

- **각 텍스트 필드는 단락 1개**로 쓴다. 템플릿은 줄바꿈을 공백으로 합치므로,
  목록이 필요하면 `changes`(주요 변경) 나 `mixed.highlights`(배열) 를 사용한다.
- `screens` 는 `feature` 에서 캡처 URL 을 제공할 때만. 순서대로 `screen-1.png … screen-n.png`
  와 매핑되고, 캡처에 실패한 항목은 보고서에 "캡처 실패" 빈 칸으로 표시된다.
- `mixed` 의 유형별 소계 표는 `category_counts` 로 자동 생성되므로 직접 적지 않는다.
- **보안(`security`)**: 식별자·증상·영향 범위까지만. 재현 절차(PoC)·악용 방법은 적지 않는다.
