import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface NotiToastProps {
  isVisible: boolean;
  onClose: () => void;
}

const TOAST_DISPLAY_DURATION_MS = 3000;
const TOAST_ANIMATION_DURATION_MS = 300;

const NotiToast = ({ isVisible, onClose }: NotiToastProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, TOAST_ANIMATION_DURATION_MS);
      }, TOAST_DISPLAY_DURATION_MS);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center p-10">
      <div
        className={clsx(
          'rounded-xxs bg-neutral-0 flex items-center gap-1.5 bg-opacity-85 px-3 py-2.5 shadow-lg transition-all duration-300',
          isAnimating
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0',
        )}
      >
        <img
          src="/icons/check-circle.svg"
          alt="check icon"
          className="h-6 w-6 brightness-0 invert"
        />
        <span className="text-xsmall16 text-white">
          다음 기수 알림이 신청되었습니다.
        </span>
      </div>
    </div>
  );
};

export default NotiToast;
