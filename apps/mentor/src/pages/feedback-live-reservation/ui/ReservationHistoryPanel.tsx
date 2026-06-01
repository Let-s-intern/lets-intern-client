/**
 * 예약 변경(이동) 내역 펼침 패널 — 예약 목록 행의 "예약 변경 내역" 버튼을
 * 누르면 그 행 아래(colSpan)에 인라인 드롭다운으로 렌더된다.
 *
 * 어드민 `ReservationHistoryPanel`(GET /admin/feedback/{id}/history) 디자인을
 * 그대로 재현하되, 멘토용 변경 내역 API 가 아직 없어 빈 상태만 표시한다.
 * 멘토 history API 가 생기면 이 컴포넌트에서 조회 훅을 연결하면 된다.
 */
const ReservationHistoryPanel = () => {
  return (
    <div className="text-xxsmall12 text-neutral-40 py-4 text-center">
      예약을 옮긴 내역이 없습니다.
    </div>
  );
};

export default ReservationHistoryPanel;
