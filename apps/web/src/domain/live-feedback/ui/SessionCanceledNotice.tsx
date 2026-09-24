/**
 * 취소·진행불가 세션에 그리는 화면.
 *
 * 라이브 피드백에서는 예약 취소와 제출물 미제출이 모두 서버의 `FeedbackStatus.CANCELED`
 * 하나로 들어온다(멘토 앱 `FeedbackHeader` 의 "라이브는 취소(예약 후 미제출·예약취소)"
 * 와 같은 구분이다). 그래서 사유를 나눠 적지 않고 하나의 문구로 알린다.
 *
 * 이 화면이 없을 때는 상태를 보지 않고 입장 UI 를 그대로 그렸다. 알림톡을 이미 받은
 * 사람이 뒤늦게 링크를 누르면 취소된 세션인데도 정상 예약처럼 보였다.
 */
const SessionCanceledNotice = () => {
  return (
    <section className="border-neutral-80 rounded-xxl flex flex-col items-center gap-5 border bg-white p-6 text-center shadow-sm">
      <img
        src="/logo/horizontal-logo.svg"
        alt="렛츠커리어"
        className="h-6 w-auto"
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-small18 text-neutral-0 font-bold">
          진행할 수 없는 세션이에요
        </h1>
        <p className="text-xsmall14 text-neutral-40 break-keep">
          예약이 취소됐거나 제출물이 확인되지 않아 진행불가로 처리된 세션이에요.
          자세한 내용은 채팅문의로 알려주세요.
        </p>
      </div>
    </section>
  );
};

export default SessionCanceledNotice;
