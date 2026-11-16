import { useMediaQuery } from '@mui/material';
import { memo, useState } from 'react';

import { twMerge } from '@/lib/twMerge';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';

interface TooltipProps {
  alt?: string;
  className?: string;
  children: React.ReactNode;
}

/** TODO: **공통화** */
const Tooltip = ({ alt = '툴팁', children, className }: TooltipProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const [isShow, setIsShow] = useState(false);

  return (
    <div className="relative h-5 w-5 cursor-pointer">
      <img
        aria-describedby="helper"
        className="h-auto w-full"
        src="/icons/message-question-circle.svg"
        alt={alt}
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
      />
      {isShow && (
        <div
          id="helper"
          role="tooltip"
          className={twMerge(
            'absolute z-10 w-52 rounded-xs bg-neutral-95 px-4 py-3 text-xxsmall12 text-neutral-40 drop-shadow-[0_0_4px_rgba(0,0,0,0.32)]',
            isMobile ? '-left-10 top-8' : '-top-1 left-8',
            className,
          )}
        >
          {children}
          <div
            className={twMerge(
              'absolute h-3 w-3 rotate-45 bg-neutral-95',
              isMobile ? '-top-1 left-11' : '-left-1 top-2',
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(Tooltip);
