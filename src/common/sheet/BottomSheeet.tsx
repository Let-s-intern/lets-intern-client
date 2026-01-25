import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  variant?: 'sheet' | 'footer';
}

const BottomSheet = ({
  children,
  className,
  onClose,
  variant = 'sheet',
}: BottomSheetProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const shouldLockScroll = isMobile && variant === 'sheet';

  useControlScroll(shouldLockScroll);
  if (!isMobile) return null;

  return (
    <>
      {variant === 'sheet' && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      <div
        className={twMerge(
          variant === 'sheet'
            ? 'fixed bottom-0 left-0 right-0 z-40 flex min-h-[35vh] items-start gap-3 rounded-t-lg bg-static-100 px-5 pb-2.5 pt-5 shadow-button'
            : 'fixed bottom-0 left-0 right-0 z-40 flex items-center rounded-t-lg bg-static-100 px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 shadow-button',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

export default BottomSheet;
