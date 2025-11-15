'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface CareerCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  onClick?: () => void;
  labelOnClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const CareerCard = ({
  title,
  description,
  buttonText,
  buttonHref,
  onClick,
  labelOnClick,
  className,
  fullWidth = false,
}: CareerCardProps) => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonHref) {
      router.push(buttonHref);
      return;
    }
    onClick?.();
  };

  const cardContent = (
    <div
      className={clsx(
        'flex flex-1 flex-col gap-3 rounded-xs border border-[#E4E4E7] p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#4A495C]">{title}</h3>
        <img
          src="/icons/chevron-right-filled.svg"
          alt=""
          className="h-4 w-4 cursor-pointer text-[#B0B0B0]"
          onClick={labelOnClick}
          onError={(e) => {
            // chevron 아이콘이 없을 경우 대체
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="flex h-[118px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-[#666666]">{description}</p>
        <button
          type="button"
          onClick={handleButtonClick}
          className="w-fit rounded-xs border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  return <div className={clsx({ 'w-full': fullWidth })}>{cardContent}</div>;
};

export default CareerCard;
