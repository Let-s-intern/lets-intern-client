# Tasks: Jitsi 라이브 피드백 도입 - Push 3

> PRD: `.claude/tasks/prd-jitsi-라이브-피드백-도입.md`
> Push 범위: **멘토 앱(apps/mentor)** Zep → Jitsi 교체 + T-10 활성화 유틸 리네임
> Push 2와 **함께 배포 권장** (양측이 같은 방으로 수렴)
> 상태: ✅ Push 3 단위 작업 완료 (3.4 통합 QA는 별도 단계로 분리)

---

### 관련 파일

- `apps/mentor/src/pages/feedback/utils/liveFeedbackAccess.ts` — 리네임 (구: `zepAccess.ts`)
- `apps/mentor/src/pages/feedback/utils/__tests__/liveFeedbackAccess.test.ts` — 리네임 + 입력 시그니처 보정
- `apps/mentor/src/pages/schedule/modal/JitsiEmbedModal.tsx` — 신규 (Zep 모달 대체)
- `apps/mentor/src/pages/schedule/modal/LiveFeedbackReservationModal.tsx` — import 교체 + 메타데이터 전달
- `apps/mentor/src/pages/schedule/__tests__/LiveFeedbackReservationModal.test.tsx` — 모달 교체 반영

### 의존성

- 선행: Push 1 (`packages/ui/JitsiEmbed`, `buildJitsiRoomUrl`)
- 동반 배포: Push 2 (멘티/멘토가 같은 방에 모이도록)
- 후행: Push 4 (ZEP 잔재 정리)

### Vercel React 베스트 프랙티스 적용 포인트

- 동적 import 후보: `JitsiEmbedModal`은 예약 상세 모달이 열렸을 때만 로드 (이미 모달 패턴이라 큰 이득은 아님, 다만 iframe heavyweight라 검토 가치 있음)
- `useMemo`: room URL은 `feedbackDetail` 변경 시에만 재계산
- 불필요한 prop drilling 방지: 메타데이터는 `feedbackDetail`에서 직접 추출

---

## 작업

- [x] 3.0 멘토(apps/mentor) Jitsi 교체 (Push 3)
    - [x] 3.1 `zepAccess.ts` → `liveFeedbackAccess.ts` 리네임
        - 파일 이동: `apps/mentor/src/pages/feedback/utils/zepAccess.ts` → `liveFeedbackAccess.ts`
        - 함수 리네임: `resolveZepAccess` → `resolveLiveFeedbackAccess`
        - 타입 리네임: `ZepAccess`, `ZepAccessState` → `LiveFeedbackAccess`, `LiveFeedbackAccessState`
        - 상수 리네임: `ZEP_ACTIVATION_LEAD_MS` → `LIVE_FEEDBACK_ACTIVATION_LEAD_MS`
        - **로직은 변경 없음** (T-10 룰 그대로). 입력 첫 인자 의미만 "BE가 내려준 URL" → "프론트가 만든 URL or null" 로 재해석 (시그니처는 그대로)
        - 테스트 파일도 함께 리네임 (`__tests__/liveFeedbackAccess.test.ts`)
        - [x] 3.1.T1 테스트 코드 작성 — 기존 테스트 이관 (테스트 케이스는 그대로, import만 갱신)
        - [x] 3.1.T2 테스트 실행 및 검증 — `pnpm test --filter=@letscareer/mentor`
    - [x] 3.2 `JitsiEmbedModal` 신설 (apps/mentor)
        - 파일: `apps/mentor/src/pages/schedule/modal/JitsiEmbedModal.tsx`
        - Props: `{ isOpen: boolean; onClose: () => void; meta: {...} }` (Push 2와 동일 형태)
        - env: `import.meta.env.VITE_JITSI_BASE_URL`, `import.meta.env.VITE_JITSI_FALLBACK_URL`
        - 공유 컴포넌트 `JitsiEmbed`는 `@letscareer/ui/JitsiEmbed`에서 import
        - [x] 3.2.T1 테스트 코드 작성 — `JitsiEmbedModal.test.tsx`
            - meta 동일 → 같은 URL 렌더
            - env 누락 → 안내 카피
        - [x] 3.2.T2 테스트 실행 및 검증 — `pnpm test --filter=@letscareer/mentor`
    - [x] 3.3 `LiveFeedbackReservationModal` 통합
        - `ZepEmbedModal` import 제거, `JitsiEmbedModal` import 추가
        - `resolveZepAccess` → `resolveLiveFeedbackAccess` 호출 갱신 (`zepAccess.state` 변수도 함께)
        - 멘티명/챌린지명/미션명을 `feedbackDetail`에서 추출 → `meta` props 전달
        - **부족 필드는 BE 협업 요청 메모로 분리** (`tasks/memos/be-request-jitsi-meta.md`)
        - [x] 3.3.T1 테스트 코드 작성 — `LiveFeedbackReservationModal.test.tsx` 갱신
            - 모달 트리거 시 새 모달이 열리는지
            - T-10 룰 회귀 없음 (기존 케이스 보존)
        - [x] 3.3.T2 테스트 실행 및 검증 — `pnpm test --filter=@letscareer/mentor`, `pnpm lint --filter=@letscareer/mentor`
    - [ ] 3.4 멘토 측 QA — **통합 QA 단계로 분리됨 (Push 4 이후 처리)**
        - 시나리오 1: 예약 상세 모달 → 시작 10분 전 → "입장하기" → Jitsi 모달 열림
        - 시나리오 2: "다른 서버로 입장" → fallback URL 전환
        - 시나리오 3: T-10 이전/종료 후 버튼 disabled 회귀 없음
        - 시나리오 4: **Push 2와 동시 진행 시** 멘티/멘토가 동일 방에 입장하는지 확인
            - **주의**: 현재 멘토 `missionName`은 placeholder (`{th}회차 라이브 피드백`)이므로
              BE가 `missionTitle` 응답 추가하기 전에는 양측 방이 분리됨.
              QA 시 iframe `src` 직접 비교하여 방 일치 확인 + BE 응답 추가 후 재검증
            - 참조: `.claude/tasks/memos/be-request-jitsi-mentor-meta.md`
        - [ ] 3.4.T1 테스트 코드 작성 — **수동 QA (브라우저 검증)**
        - [ ] 3.4.T2 테스트 실행 및 검증 — `pnpm dev:mentor` + 브라우저, 스크린샷 첨부
