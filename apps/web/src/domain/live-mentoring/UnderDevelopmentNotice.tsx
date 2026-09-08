/**
 * ⚠️ 임시 코드 — 백엔드 연동이 끝나면 **이 파일을 통째로 삭제**할 것.
 *
 * ── 왜 있는가 ────────────────────────────────────────────────
 * 멘토 상세 조회 `GET /live-mentoring/mentors/{mentorId}` 가 아직 미완성이라
 * 실서버에서 500(INTERNAL_SERVER_ERROR)을 돌려준다. 그대로 두면 사용자에게
 * "멘토 정보를 불러오지 못했습니다"라는 **일반 오류**로 보여서, 일시적 장애인지
 * 미구현인지 구분이 안 된다. 개발 중임을 명시하고 담당자를 알리기 위한 임시 안내다.
 *
 * ── 언제 지우는가 (삭제 조건) ─────────────────────────────────
 * `GET /live-mentoring/mentors/{mentorId}` 가 정상 응답하기 시작하면 즉시.
 * 확인법: `curl -s "$NEXT_PUBLIC_SERVER_API/live-mentoring/mentors/1"` 가 200 이면 됨.
 *
 * ── 무엇을 지우는가 (삭제 목록) ───────────────────────────────
 * 1. 이 파일 (`domain/live-mentoring/UnderDevelopmentNotice.tsx`)
 * 2. `domain/live-mentoring/detail/LiveMentoringDetailPage.tsx` 의 import 와
 *    `isError` 분기 — 원래의 "멘토 정보를 불러오지 못했습니다" 문구로 되돌린다.
 *    (조회 실패가 진짜 장애를 뜻하게 되므로 일반 오류 문구가 맞다.)
 * 3. `domain/live-mentoring/detail/LiveMentoringDetailPage.test.tsx` 의
 *    '개발 중 안내' 케이스 — 일반 오류 문구 단언으로 되돌린다.
 *
 * 관련: apps/mentor 에도 같은 목적의 `UnderDevelopmentNotice` 가 따로 있다
 * (앱 간 컴포넌트를 공유하지 않는 규칙 때문에 의도적으로 중복). 그쪽은
 * `/mentor/live-mentoring/template` 이 열리면 함께 정리한다(정산 현황 화면은
 * 폐지되어 이 조건에서 빠졌다).
 */

/** 미구현 화면 문의를 받는 담당자. */
const OWNER = '임성빈';

const UnderDevelopmentNotice = () => (
  <div className="mw-1180 flex flex-col items-center justify-center gap-2 px-5 py-24 text-center">
    <p className="text-xsmall16 text-neutral-0 font-semibold">
      개발 중인 페이지입니다.
    </p>
    <p className="text-xsmall14 text-neutral-40">담당자 {OWNER}</p>
  </div>
);

export default UnderDevelopmentNotice;
