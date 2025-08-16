import {
  MyChallengeMissionByType,
  Schedule,
  UserChallengeMissionDetail,
} from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { Link } from 'react-router-dom';
import OtVideo from '../../OtVideo';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';
import ParsedCommentBox from '../ParsedCommentBox';
interface Props {
  missionDetail: UserChallengeMissionDetail;
  missionByType: MyChallengeMissionByType;
  schedule: Schedule;
  applicationId?: string | number;
  programId?: string | number;
  challengeId?: string | number;
  isFeedbackOptionPurchased?: boolean;
  isFeedbackConfirmed?: boolean;
}

const DoneMissionDetailMenu = ({
  missionDetail,
  missionByType,
  schedule,
  applicationId,
  programId,
  challengeId,
  isFeedbackConfirmed = false,
}: Props) => {
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;
  const isOtMission = missionDetail.th === 0;
  const isBonusMission = missionDetail.th === BONUS_MISSION_TH;
  const showContent =
    !isBonusMission && (additionalContentsLink || essentialContentsLink);
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
        {showContent && (
          <div className="mt-4 flex flex-col gap-2">
            <MenuContentsDropdown missionDetail={missionDetail} />
          </div>
        )}
        {/* OT 영상 */}
        {showOtVod && <OtVideo vodLink={missionDetail.vodLink!} />}
      </div>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <h4 className="flex-shrink-0 text-lg font-semibold">제출한 미션</h4>
          <Link
            to={missionByType.attendanceLink ?? ''}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 hover:underline"
          >
            {missionByType.attendanceLink}
          </Link>
        </div>
        {schedule.attendanceInfo.comments && (
          <div className="mt-4">
            <ParsedCommentBox
              className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm"
              comment={schedule.attendanceInfo.comments}
            />
          </div>
        )}
        <div className="mt-10 flex w-full flex-col gap-y-2.5">
          <h4 className="text-xsmall16 font-bold">미션 소감</h4>
          <p className="h-20 overflow-auto rounded-md bg-neutral-95 p-3 text-xsmall14">
            {schedule.attendanceInfo.review ?? '-'}
          </p>
        </div>
        {isFeedbackConfirmed && (
          <div className="mt-4">
            <h4 className="flex-shrink-0 text-lg font-semibold">미션 피드백</h4>
            <div className="mt-2">
              <ParsedCommentBox
                className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm"
                comment={`(미션 피드백 페이지로 이동)[/challenge/${applicationId}/${programId}/challenge/${challengeId}/missions/${missionDetail.id}/feedback]`}
                openInNewTab={false}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoneMissionDetailMenu;
