# 렛츠커리어 프로젝트 문서

## 폴더 구조

```
.claude/docs/letscareer/
├── README.md                    # 이 파일 (문서 인덱스)
├── API_docs/                    # API 관련 문서
│   └── swagger_url.md
├── common/                      # 공통 컴포넌트/훅/서비스 문서
│   ├── README.md
│   ├── components.md
│   ├── hooks.md
│   └── services.md
└── domain/                      # 도메인별 문서
    ├── challenge-feedback/      # 챌린지 피드백 멘토링
    │   └── README.md
    └── curation/                # 큐레이션
        ├── README.md
        └── flow-map.md
```

## 도메인 문서

| 도메인 | 경로 | 설명 |
|--------|------|------|
| [챌린지 피드백 멘토링](domain/challenge-feedback/README.md) | `/challenge/feedback-mentoring` | 피드백 멘토링 옵션 안내 랜딩페이지 |
| [큐레이션](domain/curation/README.md) | — | 큐레이션 도메인 |

## 문서 작성 규칙

- 도메인별 문서는 `domain/{도메인명}/README.md`에 작성
- 공통 컴포넌트/훅은 `common/`에 작성
- API 관련은 `API_docs/`에 작성
