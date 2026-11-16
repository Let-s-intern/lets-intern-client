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
          'fixed bottom-0 left-0 right-0 z-40 flex rounded-t-lg bg-static-100 px-5 shadow-button',
          variant === 'sheet'
            ? 'min-h-[35vh] items-start gap-3 pb-2.5 pt-5'
            : 'items-center pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3',
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
