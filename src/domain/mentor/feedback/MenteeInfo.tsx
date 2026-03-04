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
}

// DEV mock – 목 챌린지(9999)용
const MOCK_MENTEE_MAP: Record<number, { name: string; wishJob: string | null; wishCompany: string | null }> = {
  88801: { name: '김테스트', wishJob: '프론트엔드 개발자', wishCompany: '렛츠커리어' },
  88802: { name: '이테스트', wishJob: 'UX 디자이너', wishCompany: null },
  88803: { name: '박미제출', wishJob: null, wishCompany: null },
};

const MenteeInfo = ({
  challengeId,
  missionId,
  attendanceId,
  challengeTitle,
  missionLink,
}: MenteeInfoProps) => {
  const isMock = challengeId === 9999;
  const { data } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId,
    enabled: !!challengeId && !!missionId && !isMock,
  });

  const mentee = isMock && attendanceId
    ? MOCK_MENTEE_MAP[attendanceId]
    : data?.attendanceList?.find((a) => a.id === attendanceId);

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
