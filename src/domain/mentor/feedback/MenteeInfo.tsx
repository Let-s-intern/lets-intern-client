'use client';

import {
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';

interface MenteeInfoProps {
  challengeId: number;
  missionId: number;
  attendanceId: number | null;
  challengeTitle?: string;
  missionLink?: string | null;
  onPrevMentee?: () => void;
  onNextMentee?: () => void;
}

const MenteeInfo = ({
  challengeId,
  missionId,
  attendanceId,
  challengeTitle,
  missionLink,
  onPrevMentee,
  onNextMentee,
}: MenteeInfoProps) => {
  const { data } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId,
    enabled: !!challengeId && !!missionId,
  });

  const mentee = data?.attendanceList?.find((a) => a.id === attendanceId);

  if (!mentee) {
    return (
      <div className="py-4 text-sm text-gray-400">
        멘티를 선택해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-3 py-4">
      {/* Navigation */}
      {(onPrevMentee || onNextMentee) && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMentee}
            disabled={!onPrevMentee}
            className="text-sm text-gray-500 hover:text-gray-800 disabled:invisible"
          >
            &lt; 이전 멘티
          </button>
          <button
            type="button"
            onClick={onNextMentee}
            disabled={!onNextMentee}
            className="text-sm text-gray-500 hover:text-gray-800 disabled:invisible"
          >
            다음 멘티 &gt;
          </button>
        </div>
      )}

      {/* Name & challenge */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">{mentee.name}</h3>
        {challengeTitle && (
          <p className="text-sm text-gray-500">{challengeTitle}</p>
        )}
      </div>

      {/* Detail info */}
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        {mentee.wishJob && (
          <div>
            <p className="text-xs text-gray-400">희망 직군</p>
            <p className="font-medium text-gray-800">{mentee.wishJob}</p>
          </div>
        )}
        {mentee.wishCompany && (
          <div>
            <p className="text-xs text-gray-400">희망 기업</p>
            <p className="font-medium text-gray-800">{mentee.wishCompany}</p>
          </div>
        )}
      </div>

      {/* Mission submission link */}
      {missionLink && (
        <a
          href={missionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          미션 제출물 보기 →
        </a>
      )}
    </div>
  );
};

export default MenteeInfo;
