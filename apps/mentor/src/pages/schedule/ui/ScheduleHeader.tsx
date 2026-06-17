/**
 * 피드백 캘린더 페이지 헤더 — 제목 + 서브카피.
 *
 * 디자인 참조(이미지 #1): "피드백 캘린더" 제목 아래 회색 보조 안내 문구.
 */
const ScheduleHeader = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold leading-8 text-neutral-900">
        피드백 캘린더
      </h1>
      <p className="text-sm leading-5 text-neutral-500">
        미션 피드백 일정을 확인하고 피드백을 진행하세요.
      </p>
    </div>
  );
};

export default ScheduleHeader;
