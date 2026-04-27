# apps/web E2E

## 실행

```bash
# 1) 한번만 brwoser 설치
pnpm --filter @letscareer/web e2e:install

# 2) 테스트 실행 (webServer 자동 부팅)
pnpm --filter @letscareer/web e2e

# 3) UI 모드
pnpm --filter @letscareer/web e2e:ui
```

## 정책

- **Chromium 만 사용** — Firefox/WebKit 빌드 시간 절약. 추후 필요 시 확장.
- **web 에만 도입** — admin/mentor 는 중요도 기반 차등화로 단위 테스트만 운영.
- **dev 서버 부팅 의존** — `playwright.config.ts` 의 `webServer.command = 'pnpm dev'`.
  CI 에서 wall-clock 부담이 크면 `pnpm start` (build → start) 로 갈아끼움.
