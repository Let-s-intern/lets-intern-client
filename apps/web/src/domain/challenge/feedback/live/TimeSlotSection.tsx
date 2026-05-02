const TimeSlotSection = ({
  selectedMentorId,
}: {
  selectedMentorId: string | null;
}) => (
  <section>
    <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
      예약 가능한 시간
    </h2>
    <div className="text-xsmall14 text-neutral-40 py-8 text-center">
      {selectedMentorId ? '예약 캘린더 UI' : '멘토를 먼저 선택해주세요'}
    </div>
  </section>
);

export default TimeSlotSection;
