'use client';

import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { twMerge } from '@/lib/twMerge';
import { Link } from 'lucide-react';

interface Props {
  className?: string;
  hideCaption?: boolean;
  iconWidth?: number | string;
  iconHeight?: number | string;
  iconColor?: string;
}

function BlogLinkShareBtn({
  className,
  hideCaption = false,
  iconWidth,
  iconHeight,
  iconColor,
}: Props) {
  const { snackbar } = useAdminSnackbar();

  return (
    <button
      type="button"
      className={twMerge(
        'blog_share flex items-center gap-1.5 rounded-full border border-neutral-80 px-3 py-2',
        className,
      )}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            window.location.origin + location.pathname,
          );
          snackbar('클립보드에 복사되었습니다.');
        } catch (err) {
          console.error(err);
        }
      }}
    >
      <Link
        width={iconWidth ?? 16}
        height={iconHeight ?? 16}
        color={iconColor ?? '#5C5F66'}
      />
      {!hideCaption && (
        <span className="text-xsmall14 font-medium text-neutral-35">
          공유하기
        </span>
      )}
    </button>
  );
}

export default BlogLinkShareBtn;
