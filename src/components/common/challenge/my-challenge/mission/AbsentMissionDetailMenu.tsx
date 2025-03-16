import { Schedule, UserChallengeMissionDetail } from '@/schema';
import AbsentContentsInfoMenu from '../menu/AbsentContentsInfoMenu';
import AbsentMissionSubmitMenu from '../menu/AbsentMissionSubmitMenu';

interface Props {
  missionDetail: UserChallengeMissionDetail;
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const AbsentMissionDetailMenu = ({
  missionDetail,
  currentSchedule,
  setOpenReviewModal,
}: Props) => {
  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="whitespace-pre-line text-black">
          {missionDetail.description}
        </p>
        <div className="mt-4">
          <h4 className="text-sm text-[#898989]">미션 가이드</h4>
          <p className="mt-1 whitespace-pre-line text-black">
            {missionDetail.guide}
          </p>
        </div>
      </div>
      <AbsentContentsInfoMenu missionDetail={missionDetail} />
      <hr className="my-6 border-[0.5px] border-[#DEDEDE]" />
      <AbsentMissionSubmitMenu
        missionDetail={missionDetail}
        currentSchedule={currentSchedule}
        setOpenReviewModal={setOpenReviewModal}
      />
    </>
  );
};

export default AbsentMissionDetailMenu;
