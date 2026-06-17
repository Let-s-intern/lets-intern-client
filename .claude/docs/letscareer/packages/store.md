# `@letscareer/store`

zustand 기반 클라이언트 전역 상태. 인증 토큰·스크롤·프로그램 신청 폼·미션 등.

## 위치

```
packages/store/src/
├── useAuthStore.ts                  # 인증 토큰 (access/refresh)
├── useScrollStore.ts                # 스크롤 위치
├── useProgramStore.ts               # 프로그램 신청 폼 상태
├── useReportApplicationStore.ts     # 리포트 신청 상태
├── useMissionStore.ts               # 미션 상태
├── hydration.ts                     # SSR/CSR 하이드레이션 헬퍼
└── index.ts
```

## Export 표면

```ts
export * from './hydration';
export { useMissionStore } from './useMissionStore';
export { default as useScrollStore } from './useScrollStore';
export { default as useAuthStore } from './useAuthStore';
export type { AuthStore, TokenSet } from './useAuthStore';
export {
  default as useProgramStore,
  checkInvalidate,
  initProgramApplicationForm,
  setProgramApplicationForm,
} from './useProgramStore';
export { default as useReportApplicationStore } from './useReportApplicationStore';
export type { ReportApplication, ReportPriceType } from './useReportApplicationStore';
```

## 핵심: useAuthStore + SSO

- `localStorage`의 `userLoginStatus` 키에 토큰을 persist
- web → admin/mentor 이동 시 [`buildCrossAppUrl`](../../../../apps/web/src/common/utils/crossAppUrl.ts)이 토큰을 URL hash로 인코딩
- 수신 측은 `consumeSsoHashIfPresent`(이 패키지의 `hydration` export)로 hash 파싱 → store에 저장
- 자세한 흐름: [`../pnpm전환 메모 폴더/03-domain-routing.md`](../pnpm전환%20메모%20폴더/03-domain-routing.md)

## 사용 예

```ts
import { useAuthStore } from '@letscareer/store';

function SignOutButton() {
  const logout = useAuthStore((s) => s.logout);
  return <button onClick={logout}>로그아웃</button>;
}
```

## zustand vs React Query

- **zustand**: 브라우저가 진실의 원천인 상태(인증 토큰·UI 토글·임시 폼)
- **React Query**: 서버가 진실의 원천인 상태(API 응답)

자세한 분리 원칙: [`../architecture.md`](../architecture.md).
