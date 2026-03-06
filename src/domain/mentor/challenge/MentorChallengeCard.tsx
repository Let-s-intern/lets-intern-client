'use client';

import Link from 'next/link';

interface MentorChallengeCardProps {
  challengeId: number;
  title: string;
  shortDesc: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  programStatusType: string;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr)
    .toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .replace(/\s/g, '');
};

const statusLabel: Record<string, { text: string; className: string }> = {
  PROCEEDING: { text: '진행중', className: 'bg-green-100 text-green-700' },
  DONE: { text: '완료', className: 'bg-gray-100 text-gray-500' },
  READY: { text: '준비중', className: 'bg-yellow-100 text-yellow-700' },
};

const MentorChallengeCard = ({
  challengeId,
  title,
  shortDesc,
  thumbnail,
  startDate,
  endDate,
  programStatusType,
}: MentorChallengeCardProps) => {
  const status = statusLabel[programStatusType];

  return (
    <Link
      href={`/mentor/challenges/${challengeId}`}
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
    >
      <img
        src={thumbnail || '/images/community1.png'}
        alt={title}
        className="h-40 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {status && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.text}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-gray-500">{shortDesc}</p>
        <div className="mt-auto flex items-center gap-1 pt-2">
          <span className="text-xs text-gray-400">진행기간</span>
          <span className="text-xs font-medium text-gray-600">
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MentorChallengeCard;
