/**
 * ⚠️ 임시 코드 — 백엔드 연동이 끝나면 **이 파일을 통째로 삭제**할 것.
 *
 * ── 왜 있는가 ────────────────────────────────────────────────
 * 상세 페이지 설정·정산 현황은 아직 MSW 목(`VITE_API_MOCKING=enabled`)으로만 동작한다.
 * 목이 꺼진 환경에서는 서버에 엔드포인트 자체가 없어 조회가 실패하는데, 그때 화면이
 * "고장난 것"처럼 보였다:
 *   - 상세 페이지 설정: "템플릿을 불러오는 중..." 에서 영원히 멈춤
 *   - 정산 현황: 정상처럼 보이는 **빈 표** → "정산 내역이 없다"로 오독됨
 * 개발 중임을 명시하고 담당자를 알리기 위한 임시 안내다.
 * (목이 붙어 데이터가 내려오면 이 안내 대신 실제 화면이 그대로 렌더된다.)
 *
 * ── 언제 지우는가 (삭제 조건) ─────────────────────────────────
 * 아래 두 엔드포인트가 실서버에서 정상 응답하면 즉시. 하나만 열렸다면 그쪽 화면만 정리한다.
 *   - GET /mentor/live-mentoring/template
 *   - GET /mentor/live-mentoring/settlement
 *
 * ── 무엇을 지우는가 (삭제 목록) ───────────────────────────────
 * 1. 이 파일 (`pages/live-mentoring/ui/UnderDevelopmentNotice.tsx`)
 * 2. `detail-settings/DetailSettingsPage.tsx` — import 와 `isError` 분기.
 *    `header` 를 변수로 뽑아둔 것도 이 분기 때문이므로 원래처럼 JSX 안으로 되돌려도 된다.
 * 3. `settlement/SettlementPage.tsx` — import 와 `isError` 분기(위와 동일).
 * 4. `api/live-mentoring/liveMentoring.ts` 의 `retry: false` 2곳.
 *    없는 엔드포인트를 3회 재시도하느라 안내가 늦게 뜨는 걸 막으려던 것이라,
 *    API 가 생기면 기본 재시도(3회)로 되돌리는 편이 낫다.
 * 5. `pages/live-mentoring/__tests__/underDevelopmentFallback.test.tsx` — 파일 전체.
 *    단, '목 데이터가 내려오면 실제 표를 렌더한다' 케이스는 살려서
 *    `settlement/__tests__/SettlementPage.test.tsx` 로 옮길 만하다.
 *
 * 관련: apps/web 에도 같은 목적의 `UnderDevelopmentNotice` 가 따로 있다
 * (앱 간 컴포넌트를 공유하지 않는 규칙 때문에 의도적으로 중복). 그쪽은
 * `GET /live-mentoring/mentors/{mentorId}` 가 열리면 함께 정리한다.
 */

/** 미구현 화면 문의를 받는 담당자. */
const OWNER = '임성빈';

interface UnderDevelopmentNoticeProps {
  /** 어떤 데이터를 못 불러왔는지 (예: '정산 현황'). 생략하면 문구에서 뺀다. */
  feature?: string;
}
const UnderDevelopmentNotice = ({ feature }: UnderDevelopmentNoticeProps) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
    <p className="text-xsmall16 text-neutral-10 font-semibold">
      개발 중인 페이지입니다.
    </p>
    <p className="text-xsmall14 text-neutral-40">담당자 {OWNER}</p>
    {feature && (
      <p className="text-xxsmall12 text-neutral-45 mt-2">
        {feature} API 연동 전이라 데이터를 불러올 수 없습니다.
      </p>
    )}
  </div>
);

export default UnderDevelopmentNotice;
