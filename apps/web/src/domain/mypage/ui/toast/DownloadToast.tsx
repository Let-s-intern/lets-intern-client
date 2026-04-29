import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface DownloadToastProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  duration?: number;
}

const DownloadToast = ({
  isVisible,
  onClose,
  message = '다운로드가 완료되었습니다.',
  duration = 3000,
}: DownloadToastProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-10">
      <div
        className={clsx(
          'rounded-xxs bg-neutral-0 flex items-center gap-1.5 bg-opacity-85 px-3 py-2.5 shadow-lg transition-all duration-300',
          isAnimating
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0',
        )}
      >
        <img
          src="/icons/check-circle.svg"
          alt="check icon"
          className="h-6 w-6 brightness-0 invert"
        />

        <span className="text-xsmall16 text-white">{message}</span>
      </div>
    </div>
  );
};

export default DownloadToast;
