// 보너스 미션용 placeholder 컴포넌트
const MissionGuideBonusSection = ({ todayTh }: { todayTh: number }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-neutral-0">
        {todayTh}회차 미션 (보너스용)
      </h2>
      <p className="text-sm text-neutral-60">
        이 부분은 보너스 미션용 UI가 들어갈 예정입니다.
      </p>
    </div>
  );
};

export default MissionGuideBonusSection;
