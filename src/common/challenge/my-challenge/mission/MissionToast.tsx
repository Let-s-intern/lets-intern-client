import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface MissionToastProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  duration?: number;
}

const MissionToast = ({
  isVisible,
  onClose,
  message = '미션 제출이 완료되었습니다.',
  duration = 3000,
}: MissionToastProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // 애니메이션 완료 후 닫기
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-10">
      <div
        className={clsx(
          'flex items-center gap-1.5 rounded-xxs bg-neutral-0 bg-opacity-85 px-3 py-2.5 shadow-lg transition-all duration-300',
          isAnimating
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0',
        )}
      >
        {/* 체크 아이콘 */}
        <img
          src="/icons/check-circle.svg"
          alt="check icon"
          className="h-6 w-6 brightness-0 invert" // 파란색을 흰색으로 변경
        />

        {/* 메시지 */}
        <span className="text-xsmall16 text-white">{message}</span>
      </div>
    </div>
  );
};

export default MissionToast;
