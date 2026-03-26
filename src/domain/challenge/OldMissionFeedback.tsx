import {
  useChallengeMissionAttendanceInfoQuery,
  useChallengeMissionFeedbackQuery,
} from '@/api/challenge/challenge';
import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { useParams, useRouter } from 'next/navigation';

export default function OldMissionFeedback() {
  const router = useRouter();
  const params = useParams<{
    applicationId: string;
    programId: string;
    missionId: string;
  }>();
  const { applicationId, programId, missionId } = params;
  const { currentChallenge } = useOldCurrentChallenge();
  const challengeId = currentChallenge?.id;

  // 미션 정보 (제목, 회차 등)
  const { data: missionData } = useChallengeMissionAttendanceInfoQuery({
    challengeId: challengeId ?? '',
    missionId: missionId ?? '',
  });

  // 피드백 데이터
  const { data: feedbackData } = useChallengeMissionFeedbackQuery({
    challengeId: challengeId ?? '',
    missionId: missionId ?? '',
  });

  const handleGoBack = () => {
    router.push(`/challenge/${applicationId}/${programId}/me`);
  };

  const missionInfo = missionData?.missionInfo;
  const attendanceInfo = missionData?.attendanceInfo;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="rounded flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">
            {missionInfo?.title || '미션명'} {missionInfo?.th || 0}
            회차 피드백
          </h1>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4">
        {/* 미션 정보 섹션 */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">멘토명:</span>
          </div>
          <div className="text-sm text-gray-900">
            {feedbackData?.attendanceInfo?.mentorName || '-'}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              미션 제출 링크:
            </span>
          </div>
          <div className="text-sm">
            {attendanceInfo?.link ? (
              <a
                href={attendanceInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 hover:underline"
              >
                {attendanceInfo.link}
              </a>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        </div>

        {/* 피드백 내용 섹션 */}
        <div className="mt-6">
          <div
            className="rounded min-h-[500px] w-full border border-gray-300 bg-gray-100 p-6"
            style={{ minHeight: '60vh' }}
          >
            <div className="flex h-full items-center justify-center">
              <div>
                <div className="mb-2 text-lg font-medium text-gray-600">
                  피드백 내용
                </div>
                {feedbackData?.attendanceInfo?.feedback && (
                  <LexicalContent
                    node={
                      JSON.parse(
                        feedbackData?.attendanceInfo.feedback as string,
                      ).root
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
