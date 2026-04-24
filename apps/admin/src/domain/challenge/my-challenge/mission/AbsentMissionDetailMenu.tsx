import { Schedule, UserChallengeMissionDetail } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import BonusMissionSubmitMenu from '../../BonusMissionSubmitMenu';
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
  const showOtContent =
    isOtMission && (additionalContentsLink || essentialContentsLink);
  // 일반 미션 여부를 나타내는 변수
  const isNormalMission = !isOtMission && !isBonusMission;
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
        {/* OT 자료 */}
        {showOtVod && <OtVideo vodLink={missionDetail.vodLink!} />}
        {showOtContent && (
          <div className="mt-4 flex flex-col gap-2">
            <MenuContentsDropdown missionDetail={missionDetail} />
          </div>
        )}
      </div>
      {/* 일반 미션 자료 */}
      {isNormalMission && (
        <AbsentContentsInfoMenu missionDetail={missionDetail} />
      )}
      <hr className="my-6 border-[0.5px] border-[#DEDEDE]" />
      {/* OT 미션 제출 */}
      {isOtMission && <OtMissionSubmitMenu currentSchedule={currentSchedule} />}
      {/* 일반 미션 제출 */}
      {isNormalMission && (
        <AbsentMissionSubmitMenu
          missionDetail={missionDetail}
          currentSchedule={currentSchedule}
          setOpenReviewModal={setOpenReviewModal}
        />
      )}
      {/* 보너스 미션 제출 */}
      {isBonusMission && (
        <BonusMissionSubmitMenu
          currentSchedule={currentSchedule}
          setOpenReviewModal={setOpenReviewModal}
        />
      )}
    </>
  );
};

export default AbsentMissionDetailMenu;
