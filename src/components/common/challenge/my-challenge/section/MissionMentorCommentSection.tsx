import { useChallengeMissionFeedbackQuery } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import LexicalContent from '@components/common/blog/LexicalContent';
import { useParams } from 'react-router-dom';

interface Props {
  missionId: string | number;
}

const MissionMentorCommentSection = ({ missionId }: Props) => {
  const params = useParams();

  // 피드백 데이터
  const { data: feedbackData } = useChallengeMissionFeedbackQuery({
    challengeId: params.programId ?? '',
    missionId,
  });

  const { schedules } = useCurrentChallenge();
  const { selectedMissionTh } = useMissionStore();

  const startsFromZero = schedules[0]?.missionInfo?.th === 0; // 0회차 존재 여부

  const getScheduleIndex = () => {
    if (selectedMissionTh === BONUS_MISSION_TH) return schedules.length - 1;
    return startsFromZero ? selectedMissionTh : selectedMissionTh - 1;
  };
  const scheduleIndex = getScheduleIndex();
  const comment = schedules[scheduleIndex]?.attendanceInfo?.comments;

  const mentorFeedback = feedbackData?.attendanceInfo?.feedback
    ? JSON.parse(feedbackData.attendanceInfo.feedback)
    : null;
  const isNoFeedbackOrComment = !comment && !mentorFeedback;
  if (isNoFeedbackOrComment)
    return <section className="mb-8 hidden h-px md:block" />;

  return (
    <section>
      {/* 코멘트 섹션: 관리자가 남기는 코멘트 */}
      {comment && (
        <>
          <div className="mb-8 h-px bg-neutral-80" />
          <div className="mb-6">
            <div className="mb-2 rounded-xs bg-primary-5 p-3">
              <span className="text-xsmall16 font-semibold text-primary">
                코멘트
              </span>
            </div>
            <div className="rounded-xxs border border-neutral-80 bg-white p-3">
              <p className="min-h-[120px] break-all text-xsmall14 leading-relaxed text-neutral-0 md:text-xsmall16">
                {comment}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 멘토 피드백 섹션: 멘토가 남기는 피드백 */}
      {mentorFeedback && mentorFeedback.root ? (
        <div>
          <div className="mb-2 rounded-xs bg-primary-5 p-3">
            <span className="text-xsmall16 font-semibold text-primary">
              멘토 피드백
            </span>
          </div>
          <div className="rounded-xxs border border-neutral-80 bg-white p-3">
            <div className="min-h-[120px] text-xsmall14 leading-relaxed text-neutral-0 md:text-xsmall16">
              <LexicalContent node={mentorFeedback.root} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 h-px" />
      )}
    </section>
  );
};
export default MissionMentorCommentSection;
