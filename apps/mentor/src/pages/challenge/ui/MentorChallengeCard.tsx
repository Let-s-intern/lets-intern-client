import { Link } from 'react-router-dom';
import config from '@/constants/config';

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

const statusConfig = {
  PREV: {
    text: config.challengeStatus.PREV,
    className: 'bg-yellow-100 text-yellow-700',
  },
  PROCEEDING: {
    text: config.challengeStatus.PROCEEDING,
    className: 'bg-green-100 text-green-700',
  },
  POST: {
    text: config.challengeStatus.POST,
    className: 'bg-gray-100 text-gray-500',
  },
} as const;

type ProgramStatus = keyof typeof statusConfig;

function isValidProgramStatus(value: string): value is ProgramStatus {
  return value in statusConfig;
}

function getStatusFromDates(startDate: string, endDate: string): ProgramStatus {
  const now = new Date();
  if (now < new Date(startDate)) return 'PREV';
  if (now > new Date(endDate)) return 'POST';
  return 'PROCEEDING';
}

const MentorChallengeCard = ({
  challengeId,
  title,
  shortDesc,
  thumbnail,
  startDate,
  endDate,
  programStatusType,
}: MentorChallengeCardProps) => {
  const statusKey = isValidProgramStatus(programStatusType)
    ? programStatusType
    : getStatusFromDates(startDate, endDate);
  const status = statusConfig[statusKey];

  return (
    <Link
      to={`/challenges/${challengeId}`}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
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
