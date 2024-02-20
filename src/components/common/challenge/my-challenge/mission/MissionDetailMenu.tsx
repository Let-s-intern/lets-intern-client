import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';

interface Props {
  missionDetail: any;
  todayTh: number;
}

const MissionDetailMenu = ({ missionDetail, todayTh }: Props) => {
  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="text-black">{missionDetail.contents}</p>
        <div className="mt-4">
          <h4 className="text-sm text-[#898989]">미션 가이드</h4>
          <p className="mt-1 text-black">{missionDetail.guide}</p>
        </div>
        <div className="mt-4">
          {(missionDetail.essentialContentsLink ||
            missionDetail.additionalContentsLink) &&
            missionDetail.th < todayTh && (
              <MenuContentsDropdown missionDetail={missionDetail} />
            )}
        </div>
      </div>
    </>
  );
};

export default MissionDetailMenu;
