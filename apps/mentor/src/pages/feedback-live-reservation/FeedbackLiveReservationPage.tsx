import ReservationListContent from './ui/ReservationListContent';

/**
 * 좌측 메뉴 "라이브설정 > 예약 현황" 페이지.
 *
 * 헤더(제목/부제)만 직접 그리고, 본문은 페이지·모달 공용
 * `ReservationListContent` 로 위임한다.
 */
const FeedbackLiveReservationPage = () => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          예약 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          멘티가 신청한 라이브 피드백 예약 내역을 확인하세요.
        </p>
      </header>

      <ReservationListContent />
    </div>
  );
};

export default FeedbackLiveReservationPage;
