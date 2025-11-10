import { twMerge } from '@/lib/twMerge';
import { useEffect } from 'react';

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheet = ({ children, className }: BottomSheetProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
