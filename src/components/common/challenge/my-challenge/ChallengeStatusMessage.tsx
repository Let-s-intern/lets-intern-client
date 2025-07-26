import { clsx } from 'clsx';

interface ChallengeStatusMessageProps {
  todayTh: number;
  isFixed?: boolean;
  className?: string;
}

const ChallengeStatusMessage = ({
  todayTh,
  isFixed = false,
  className,
}: ChallengeStatusMessageProps) => {
  const getStatusMessage = () => {
    if (todayTh === 0) {
      return {
        message: '챌린지가 시작됐어요! 끝까지 완주해 봅시다!',
        icon: '/icons/check-star.svg',
      };
    }

    if (todayTh >= 1 && todayTh <= 8) {
      return {
        message: `오늘은 ${todayTh}회차 미션날입니다!`,
        icon: '/icons/check-star.svg',
      };
    }

    if (todayTh === 100) {
      return {
        message: '보너스 미션 완료하고 리워드 챙겨가세요!',
        icon: '/icons/check-star.svg',
      };
    }

    // 기본값
    return {
      message: '챌린지가 시작됐어요! 함께 끝까지 완주해봐요!',
      icon: '/icons/check-star.svg',
    };
  };

  const { message, icon } = getStatusMessage();

  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3',
        className,
      )}
    >
      <img src={icon} alt="status icon" className="h-6 w-6" />
      <span className="flex-1 text-xsmall16 font-semibold text-primary">
        {message}
      </span>
      {isFixed && (
        <span className="rounded-xs bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
          고정
        </span>
      )}
    </div>
  );
};

export default ChallengeStatusMessage;
