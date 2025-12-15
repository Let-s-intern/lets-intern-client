import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { ComponentProps } from 'react';

interface WishJobModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function WishJobModal({
  title,
  onClose,
  children,
  footer,
  ...props
}: WishJobModalProps & ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 md:items-center',
        props.className,
      )}
      onClick={onClose}
    >
      <div
        className="flex max-h-[476px] w-full flex-col rounded-t-lg bg-white md:w-[340px] md:rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-small18 font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-2 pb-5">
          {children}
        </div>
        {footer && (
          <div className="flex gap-2 border-t border-neutral-85 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
