'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CareerCardProps {
  title: string;
  labelOnClick?: () => void;
  className?: string;
  body: React.ReactNode;
  fullWidth?: boolean;
}

const CareerCard = ({
  title,
  labelOnClick,
  className,
  body,
  fullWidth = false,
}: CareerCardProps) => {
  return (
    <div className={clsx({ 'w-full': fullWidth })}>
      <div
        className={clsx(
          'flex flex-1 flex-col gap-3 rounded-xs border border-neutral-85 p-4',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#4A495C]">{title}</h3>
          {labelOnClick && (
            <ChevronRight
              className="cursor-pointer stroke-[1.5] text-neutral-50"
              size={24}
              onClick={labelOnClick}
            />
          )}
        </div>
        {body}
      </div>
    </div>
  );
};

interface EmptyProps {
  height?: number;
  description: string;
  buttonText: string;
  buttonHref?: string;
  onClick?: () => void;
  className?: string;
}

const Empty = ({
  height,
  description,
  buttonText,
  buttonHref,
  onClick,
}: EmptyProps) => {
  const router = useRouter();
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonHref) {
      router.push(buttonHref);
      return;
    }
    onClick?.();
  };

  return (
    <div
      className={clsx(
        'flex h-[179px] flex-col items-center justify-center gap-3',
        height && `h-[${height}px]`,
      )}
    >
      <p className="text-sm text-[#666666]">{description}</p>
      <button
        type="button"
        onClick={handleButtonClick}
        className="h-[32px] w-fit rounded-xs border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        {buttonText}
      </button>
    </div>
  );
};

CareerCard.Empty = Empty;

export type CareerCardComponent = typeof CareerCard & {
  Empty: typeof Empty;
};

export default CareerCard as CareerCardComponent;
