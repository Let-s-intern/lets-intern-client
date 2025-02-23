import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface Props {
  title: string;
  displayDate?: string;
  superTitle: string;
  buttonItem?: ReactNode;
  thumbnailItem: ReactNode;
  className?: string;
  onClick?: () => void;
}

const BlogCard = ({
  title,
  displayDate,
  superTitle,
  buttonItem,
  thumbnailItem,
  className,
  onClick,
}: Props) => {
  return (
    <div
      className={twMerge('flex flex-col gap-3', className)}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-70">
        {thumbnailItem}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xsmall14 font-semibold text-primary">
          {superTitle}
        </span>
        <h3 className="text-xsmall16 font-bold text-neutral-0">{title}</h3>
        <div className="flex items-center justify-between py-2">
          {displayDate && (
            <span className="text-xxsmall12 text-neutral-40">
              {displayDate} 작성
            </span>
          )}
          {buttonItem}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
