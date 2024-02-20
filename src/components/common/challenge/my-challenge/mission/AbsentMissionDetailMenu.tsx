import AbsentContentsInfoMenu from '../menu/AbsentContentsInfoMenu';
import AbsentMissionSubmitMenu from '../menu/AbsentMissionSubmitMenu';

interface Props {
  missionDetail: any;
}

const AbsentMissionDetailMenu = ({ missionDetail }: Props) => {
  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="text-black">{missionDetail.contents}</p>
        <div className="mt-4">
          <h4 className="text-sm text-[#898989]">미션 가이드</h4>
          <p className="mt-1 text-black">{missionDetail.guide}</p>
        </div>
      </div>
      <AbsentContentsInfoMenu missionDetail={missionDetail} />
      <hr className="my-6 border-[0.5px] border-[#DEDEDE]" />
      <AbsentMissionSubmitMenu missionDetail={missionDetail} />
    </>
  );
};

export default AbsentMissionDetailMenu;
