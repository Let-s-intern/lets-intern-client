import BellIcon from '@/assets/icons/Bell.svg';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';

type LibraryCardStatus = 'published' | 'upcoming' | 'notified';

interface LibraryCardProps {
  href: string;
  thumbnail?: string | null;
  category: string;
  title: string;
  date?: string;
  status?: LibraryCardStatus;
  className?: string;
}

export default function LibraryCard({
  href,
  thumbnail,
  category,
  title,
  date,
  status = 'published',
  className,
}: LibraryCardProps) {
  return (
    <Link
      href={href}
      className={twMerge('flex flex-col gap-2.5', className)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-90">
        {thumbnail && (
          <img
            className="h-full w-full object-cover"
            src={thumbnail}
            alt={title}
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="truncate text-xsmall14 font-semibold text-primary">
          {category}
        </span>

        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
            {title}
          </h3>

          {date && (
            <div className="flex items-center justify-between py-2">
              <span
                className={twMerge(
                  'text-xxsmall12',
                  status === 'published'
                    ? 'text-neutral-40'
                    : 'text-primary',
                )}
              >
                {date}{' '}
                {status === 'published' ? '작성' : '공개 예정'}
              </span>

              {status === 'upcoming' && (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-xs bg-point p-2.5 text-xxsmall12 font-medium text-neutral-20"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <BellIcon width={16} height={16} />
                  <span>알림 설정</span>
                </button>
              )}

              {status === 'notified' && (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-xs bg-neutral-70 p-2.5 text-xxsmall12 font-medium text-white"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <BellIcon width={16} height={16} />
                  <span>알림 설정 완료</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
