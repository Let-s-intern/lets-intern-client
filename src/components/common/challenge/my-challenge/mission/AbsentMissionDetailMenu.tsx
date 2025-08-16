import { Schedule, UserChallengeMissionDetail } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import OtMissionSubmitMenu from '../../OtMissionSubmitMenu';
import OtVideo from '../../OtVideo';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';
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
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;
  const isOtMission = missionDetail.th === 0;
  const isBonusMission = missionDetail.th === BONUS_MISSION_TH;
  const showContent =
    isOtMission && (additionalContentsLink || essentialContentsLink);
  const showAbsentContent = !isOtMission && !isBonusMission;
  const showOtVod = isOtMission && missionDetail.vodLink;

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
        {/* OT 영상 */}
        {showOtVod && <OtVideo vodLink={missionDetail.vodLink!} />}
        {showContent && (
          <div className="mt-4 flex flex-col gap-2">
            <MenuContentsDropdown missionDetail={missionDetail} />
          </div>
        )}
      </div>
      {showAbsentContent && (
        <AbsentContentsInfoMenu missionDetail={missionDetail} />
      )}
      <hr className="my-6 border-[0.5px] border-[#DEDEDE]" />
      {isOtMission && (
        <OtMissionSubmitMenu
          currentSchedule={currentSchedule}
          setOpenReviewModal={setOpenReviewModal}
        />
      )}
      <AbsentMissionSubmitMenu
        missionDetail={missionDetail}
        currentSchedule={currentSchedule}
        setOpenReviewModal={setOpenReviewModal}
      />
    </>
  );
};

export default AbsentMissionDetailMenu;
