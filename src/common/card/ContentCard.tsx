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
  variant?: 'blog' | 'library' | 'library-card';
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
        'group relative flex',
        variant === 'library'
          ? 'items-center justify-between gap-4 md:flex-col md:items-stretch md:justify-start md:gap-2.5'
          : 'flex-col gap-2.5',
        className,
      )}
    >
      <div
        className={twMerge(
          'relative overflow-hidden rounded-sm bg-neutral-90',
          variant === 'library'
            ? 'order-2 h-[3.375rem] w-[4.5rem] shrink-0 rounded-xxs md:order-none md:aspect-[4/3] md:h-auto md:w-full md:rounded-sm'
            : 'aspect-[4/3] w-full',
        )}
      >
        {thumbnail}
      </div>

      <div
        className={twMerge(
          'flex flex-col gap-1',
          variant === 'library' && 'order-1 flex-1 md:order-none',
        )}
      >
        <span
          className={twMerge(
            'text-xsmall16 font-semibold text-primary md:text-xsmall14',
            (variant === 'library' || variant === 'library-card') && 'truncate',
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
                : variant === 'library'
                  ? 'line-clamp-3 text-xsmall16 md:line-clamp-2'
                  : 'line-clamp-2 text-small18 md:text-xsmall16',
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
