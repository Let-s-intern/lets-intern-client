import {
  useChallengeMissionAttendanceInfoQuery,
  useChallengeMissionFeedbackQuery,
} from '@/api/challenge/challenge';
import LexicalContent from '@/domain/blog/ui/LexicalContent';
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
