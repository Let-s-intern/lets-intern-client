import { twMerge } from '@/lib/twMerge';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface Props extends LinkProps {
  title: string;
  displayDateItem?: string;
  superTitle: string;
  buttonItem?: ReactNode;
  thumbnailItem: ReactNode;
  className?: string;
  target?: string;
}

const BlogCard = ({
  title,
  displayDateItem,
  superTitle,
  buttonItem,
  thumbnailItem,
  className,
  target,
  ...restProps
}: Props) => {
  return (
    <Link
      {...restProps}
      className={twMerge('flex flex-col gap-2.5', className)}
      target={target}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-70">
        {thumbnailItem}
      </div>
      <div className="flex flex-col">
        <span className="mb-1 text-xsmall14 font-semibold text-primary">
          {superTitle}
        </span>
        <h3 className="line-clamp-3 text-small18 font-semibold text-neutral-0 md:text-xsmall16">
          {title}
        </h3>
        <div className="mt-2 flex items-center justify-between py-2">
          {displayDateItem && (
            <span className="text-xxsmall12 text-neutral-40">
              {displayDateItem}
            </span>
          )}
          {buttonItem}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
