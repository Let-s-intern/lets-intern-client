import { X } from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function WishJobModalWrapper({
  title,
  onClose,
  children,
  footer,
}: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex max-h-[476px] w-[340px] flex-col rounded-sm bg-white">
        <div className="flex items-center justify-between p-5">
          <h3 className="text-small18 font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-2">
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
