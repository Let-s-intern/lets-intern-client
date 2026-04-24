# 렛츠커리어 프로젝트 문서

최종 업데이트: 2026-04-24

## 프로젝트 구조 개요 (2026-04-22 모노레포 전환 완료)

렛츠커리어 클라이언트는 pnpm + Turborepo 기반 모노레포로 운영됩니다.

### 앱 구성

| 앱 | 경로 | 기술 | 도메인 | 포트 |
|---|---|---|---|---|
| web | `apps/web/` | Next.js 15 App Router | 사용자 페이지 | 3000 |
| admin | `apps/admin/` | Vite + React Router v6 | 어드민 | 3001 |
| mentor | `apps/mentor/` | Vite + React Router v6 | 멘토 마이페이지 | 3002 |

### 배포 도메인 (2026-04-24 분리 완료)

| 환경 | web | admin | mentor |
|---|---|---|---|
| Production | `letscareer.co.kr` | `admin.letscareer.co.kr` | `mentor.letscareer.co.kr` |
| Preview | `test.letscareer.co.kr` | `test-admin.letscareer.co.kr` | `test-mentor.letscareer.co.kr` |

- `apps/web/src/middleware.ts`가 `/admin/*` 요청을 `NEXT_PUBLIC_ADMIN_URL`로, `/mentor/*` 요청을 `NEXT_PUBLIC_MENTOR_URL`로 **308 리다이렉트** 처리
- admin/mentor 앱은 react-router-dom v6 기반이며 `next/*` import 없음

### 공유 패키지

| 패키지 | 경로 | 내용 |
|---|---|---|
| `@letscareer/ui` | `packages/ui/` | 프레임워크 독립 UI 컴포넌트 |
| `@letscareer/store` | `packages/store/` | Zustand 스토어 |
| `@letscareer/api` | `packages/api/` | Axios 인스턴스 |
| `@letscareer/hooks` | `packages/hooks/` | 공유 커스텀 훅 |
| `@letscareer/utils` | `packages/utils/` | 순수 유틸리티 함수 |
| `@letscareer/types` | `packages/types/` | 공유 타입 |
| `@letscareer/tsconfig` | `packages/config/typescript/` | TypeScript 설정 |
| `@letscareer/eslint-config` | `packages/config/eslint/` | ESLint 설정 |
| `@letscareer/prettier-config` | `packages/config/prettier/` | Prettier 설정 |
| `@letscareer/tailwind-config` | `packages/config/tailwind/` | Tailwind 프리셋 |

---

## 문서 폴더 구조

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
├── tech-stack/                  # 기술 스택 문서
│   └── README.md
└── domain/                      # 도메인별 문서
    ├── challenge-detail/        # 챌린지 상세페이지
    │   └── README.md
    ├── challenge-feedback/      # 챌린지 피드백 멘토링
    │   └── README.md
    ├── community/               # 커뮤니티
    │   └── README.md
    ├── curation/                # 큐레이션
    │   ├── README.md
    │   └── flow-map.md
    └── mentor/                  # 멘토 (apps/mentor 앱)
        └── design-system.md
```

## 도메인 문서

| 도메인 | 경로 | 앱 | 설명 |
|--------|------|---|------|
| [챌린지 상세](domain/challenge-detail/README.md) | `/program/challenge/{id}/{title}` | web | 챌린지 상세 정보 페이지 |
| [챌린지 피드백 멘토링](domain/challenge-feedback/README.md) | `/challenge/feedback-mentoring` | web | 피드백 멘토링 옵션 안내 랜딩페이지 |
| [커뮤니티](domain/community/README.md) | `/community` | web | 카카오 오픈톡방 · 인스타그램 소개 랜딩페이지 |
| [큐레이션](domain/curation/README.md) | `/curation` | web | 맞춤형 챌린지 추천 시스템 |
| [멘토 디자인 시스템](domain/mentor/design-system.md) | — | mentor | 멘토 앱 UI 디자인 시스템 |

## 명령어

```bash
# 전체 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter @letscareer/web dev
pnpm --filter @letscareer/admin dev
pnpm --filter @letscareer/mentor dev

# 전체 빌드
pnpm build

# 전체 타입 체크
pnpm typecheck
```

## 문서 작성 규칙

- 도메인별 문서는 `domain/{도메인명}/README.md`에 작성
- 공통 컴포넌트/훅은 `common/`에 작성
- API 관련은 `API_docs/`에 작성
- `apps/web/src/` 기준 경로가 기본이며, admin/mentor 전용 코드는 각 앱 경로 명시
