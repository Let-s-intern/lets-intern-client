import clsx from 'clsx';
import { ReactNode } from 'react';

interface MoreHeaderProps {
  children?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  isBig?: boolean;
  isVertical?: boolean;
  gaText: string;
  hideMoreWhenMobile?: boolean;
}

/**
 * @param hideMoreWhenMobile 모바일일 때 더보기 숨기기기
 */
const MoreHeader = ({
  children,
  subtitle,
  href,
  isBig,
  isVertical,
  gaText,
  hideMoreWhenMobile,
}: MoreHeaderProps) => {
  return (
    <div
      className={clsx(
        'flex w-full justify-between gap-x-8',
        isVertical ? 'items-start' : 'items-center',
      )}
    >
      <div
        className={clsx(
          'flex flex-1 select-none gap-x-2 text-neutral-0',
          isVertical ? 'flex-col items-start gap-y-1' : 'items-center',
        )}
      >
        <h2
          className={clsx(
            'line-clamp-2 overflow-hidden break-all text-neutral-0',
            isBig
              ? 'text-small20 font-bold md:text-medium24'
              : 'text-small20 font-semibold',
          )}
        >
          {children}
        </h2>
        {subtitle && (
          <p
            className={clsx(
              '',
              isBig ? 'text-xsmall14 md:text-xsmall16' : 'text-xsmall14',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        // home에서 program으로 갈 경우 react, 나머지는 next라서 a태그 사용
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          className={clsx(
            'more_btn shrink-0 font-medium text-neutral-45',
            isBig ? 'text-xsmall16' : 'text-xsmall14',
            isVertical ? 'mt-0.5' : '',
            hideMoreWhenMobile ? 'hidden md:block' : '',
          )}
          data-text={gaText}
          data-url={href}
        >
          더보기
        </a>
      )}
    </div>
  );
};

export default MoreHeader;
