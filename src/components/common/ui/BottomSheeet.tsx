import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

const BottomSheet = ({
  children,
  className,
  isOpen = true,
}: BottomSheetProps) => {
  useControlScroll(isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black bg-opacity-50" />
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
