/** 신청 입력의 신청 버전 (LC-3247). 버전은 상세 페이지에서 정해져 여기서는 바꿀 수 없다 */
const AppliedVersionSection = ({ versionTitle }: { versionTitle: string }) => {
  return (
    <div className="mx-5 mb-10 flex items-center gap-x-3">
      <span className="text-neutral-0 font-semibold">신청 버전</span>
      <span className="text-xsmall16 text-neutral-10">{versionTitle}</span>
    </div>
  );
};

export default AppliedVersionSection;
