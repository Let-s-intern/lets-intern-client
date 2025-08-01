import { clsx } from 'clsx';

interface MissionStatusMessageProps {
  todayTh: number;
  isFixed?: boolean;
  className?: string;
}

interface MessagePart {
  text: string;
  className?: string;
}

const MissionStatusMessage = ({
  todayTh,
  isFixed = false,
  className,
}: MissionStatusMessageProps) => {
  const getMessageParts = (): MessagePart[] => {
    if (todayTh >= 1 && todayTh <= 8) {
      return [
        { text: '오늘은 ', className: 'font-bold text-neutral-0' },
        { text: `${todayTh}회차` },
        { text: ' 미션날입니다!', className: 'font-bold text-neutral-0' },
      ];
    }

    if (todayTh === 100) {
      return [
        { text: '보너스 미션', className: 'font-bold text-primary' },
        { text: ' 완료하고 리워드 챙겨가세요!' },
      ];
    }
    if (todayTh === 101) {
      return [
        { text: '오늘은 ', className: 'font-bold text-neutral-0' },
        { text: `0회차` },
        { text: ' 미션날입니다!', className: 'font-bold text-neutral-0' },
      ];
    }
    // 기본값
    return [{ text: '챌린지가 시작됐어요! 함께 끝까지 완주해봐요!' }];
  };

  const messageParts = getMessageParts();

  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-xxs bg-primary-5 px-3 py-3',
        className,
      )}
    >
      <img src="/icons/check-star.svg" alt="status icon" className="h-6 w-6" />
      <span className="flex-1 text-xsmall16 font-semibold text-primary">
        {messageParts.map((part, index) => (
          <span key={index} className={part.className}>
            {part.text}
          </span>
        ))}
      </span>
      {isFixed && (
        <span className="rounded-xs bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
          고정
        </span>
      )}
    </div>
  );
};

export default MissionStatusMessage;
