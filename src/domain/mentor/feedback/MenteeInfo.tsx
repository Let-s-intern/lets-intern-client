'use client';

import {
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';

interface MenteeInfoProps {
  challengeId: number;
  missionId: number;
  attendanceId: number | null;
  challengeTitle?: string;
}

const MenteeInfo = ({
  challengeId,
  missionId,
  attendanceId,
  challengeTitle,
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
    </div>
  );
};

export default MenteeInfo;
