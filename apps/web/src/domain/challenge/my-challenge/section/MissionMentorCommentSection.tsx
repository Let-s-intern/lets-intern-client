import {
  useChallengeMissionAttendanceInfoQuery,
  useChallengeMissionFeedbackQuery,
} from '@/api/challenge/challenge';
import LexicalContent from '@/common/lexical/LexicalContent';
import { useParams } from 'next/navigation';

interface Props {
  missionId: string | number;
}

const MissionMentorCommentSection = ({ missionId }: Props) => {
  const params = useParams<{ programId: string }>();

  // 미션 상세 정보 (attendanceInfo 포함)
  const { data: missionData } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId ?? '',
    missionId,
  });

  // 피드백 데이터
  const { data: feedbackData } = useChallengeMissionFeedbackQuery({
    challengeId: params.programId ?? '',
    missionId,
  });

  const comment = missionData?.attendanceInfo?.comments;

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
          <div className="bg-neutral-80 mb-8 h-px" />
          <div className="mb-6">
            <div className="rounded-xs bg-primary-5 mb-2 p-3">
              <span className="text-xsmall16 text-primary font-semibold">
                코멘트
              </span>
            </div>
            <div className="rounded-xxs border-neutral-80 border bg-white p-3">
              <p className="text-xsmall14 text-neutral-0 md:text-xsmall16 min-h-[120px] break-all leading-relaxed">
                {comment}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 멘토 피드백 섹션: 멘토가 남기는 피드백 */}
      {mentorFeedback && mentorFeedback.root ? (
        <div>
          <div className="rounded-xs bg-primary-5 mb-2 p-3">
            <span className="text-xsmall16 text-primary font-semibold">
              멘토 피드백
            </span>
          </div>
          <div className="rounded-xxs border-neutral-80 border bg-white p-3">
            <div className="text-xsmall14 text-neutral-0 md:text-xsmall16 min-h-[120px] leading-relaxed">
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
