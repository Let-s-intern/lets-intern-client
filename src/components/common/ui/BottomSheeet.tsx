import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheet = ({ children, className }: BottomSheetProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  useControlScroll(isMobile);
  if (!isMobile) return null;

  return (
    <>
      {isMobile && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50" />
      )}
      <div
        className={twMerge(
          'fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 rounded-t-lg bg-static-100 px-5 pb-2.5 pt-5 shadow-button',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default BottomSheet;
