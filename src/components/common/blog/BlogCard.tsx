import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  displayDateItem?: string;
  superTitle: string;
  buttonItem?: ReactNode;
  thumbnailItem: ReactNode;
}

const BlogCard = ({
  title,
  displayDateItem,
  superTitle,
  buttonItem,
  thumbnailItem,
  ...restProps
}: Props) => {
  return (
    <a
      {...restProps}
      className={twMerge('flex flex-col gap-2.5', restProps.className)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-70">
        {thumbnailItem}
      </div>
      <div className="flex flex-col gap-2">
        <span className="mb-1 text-xsmall14 font-semibold text-primary">
          {superTitle}
        </span>
        <h3 className="text-small18 font-semibold text-neutral-0 md:text-xsmall16">
          {title}
        </h3>
        <div className="flex items-center justify-between py-2">
          {displayDateItem && (
            <span className="text-xxsmall12 text-neutral-40">
              {displayDateItem}
            </span>
          )}
          {buttonItem}
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
