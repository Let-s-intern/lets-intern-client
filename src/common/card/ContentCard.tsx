import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ContentCardProps {
  href: string;
  target?: string;
  thumbnail?: ReactNode;
  category: string;
  title: string;
  date?: string;
  dateClassName?: string;
  actionButton?: ReactNode;
  variant?: 'blog' | 'library';
  className?: string;
  containerProps?: Record<string, unknown>;
}

export default function ContentCard({
  href,
  target,
  thumbnail,
  category,
  title,
  date,
  dateClassName,
  actionButton,
  variant = 'blog',
  className,
  containerProps,
}: ContentCardProps) {
  return (
    <div
      {...containerProps}
      className={twMerge(
        'group relative flex flex-col gap-2.5',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-90">
        {thumbnail}
      </div>

      <div className="flex flex-col gap-1">
        <span
          className={twMerge(
            'text-xsmall14 font-semibold text-primary',
            variant === 'library' && 'truncate',
          )}
        >
          {category}
        </span>

        <div className="flex flex-col gap-2">
          <h3
            className={twMerge(
              'font-semibold text-neutral-0',
              variant === 'blog'
                ? 'line-clamp-3 text-small18 md:text-xsmall16'
                : 'line-clamp-2 text-xsmall16',
            )}
          >
            <Link href={href} target={target}>
              {title}
              <span className="absolute inset-0" />
            </Link>
          </h3>

          {(date || actionButton) && (
            <div className="flex items-center justify-between py-2">
              {date && (
                <span
                  className={twMerge(
                    'text-xxsmall12 text-neutral-40',
                    dateClassName,
                  )}
                >
                  {date}
                </span>
              )}
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
