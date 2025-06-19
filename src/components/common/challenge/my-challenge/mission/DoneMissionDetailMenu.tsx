import { Link } from 'react-router-dom';

import {
  MyChallengeMissionByType,
  Schedule,
  UserChallengeMissionDetail,
} from '@/schema';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';
import ParsedCommentBox from '../ParsedCommentBox';
interface Props {
  missionDetail: UserChallengeMissionDetail;
  missionByType: MyChallengeMissionByType;
  schedule: Schedule;
  challengeId?: string | number;
  applicationId?: string | number;
  programId?: string | number;
  isFeedbackOptionPurchased?: boolean;
  isFeedbackCompleted?: boolean;
}

const DoneMissionDetailMenu = ({
  missionDetail,
  missionByType,
  schedule,
  challengeId,
  applicationId,
  programId,
  isFeedbackCompleted = false,
}: Props) => {
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;
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
        {(additionalContentsLink || essentialContentsLink) && (
          <div className="mt-4 flex flex-col gap-2">
            <MenuContentsDropdown missionDetail={missionDetail} />
          </div>
        )}
      </div>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <h4 className="flex-shrink-0 text-lg font-semibold">제출한 미션</h4>
          <Link
            to={missionByType.attendanceLink ?? ''}
            target="_blank"
            rel="noopenner noreferrer"
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
        {!isFeedbackCompleted && (
          <div className="mt-4">
            <h4 className="flex-shrink-0 text-lg font-semibold">미션 피드백</h4>
            <div className="mt-2">
              <ParsedCommentBox
                className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm"
                comment={`(미션 피드백 페이지로 이동)[/challenge/${applicationId}/${programId}/${challengeId}/missions/${missionDetail.id}/feedback]`}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoneMissionDetailMenu;
