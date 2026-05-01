const LiveReservationContent = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      <section>
        <h2 className="text-xsmall16 text-neutral-0 mb-3 font-semibold">
          담당 멘토
        </h2>
        <div className="text-xsmall14 text-neutral-40 py-8 text-center">
          멘토 선택 UI
        </div>
      </section>
      <section>
        <h2 className="text-xsmall16 text-neutral-0 mb-3 font-semibold">
          예약 가능한 시간
        </h2>
        <div className="text-xsmall14 text-neutral-40 py-8 text-center">
          예약 캘린더 UI
        </div>
      </section>
    </div>
  );
};

export default LiveReservationContent;
