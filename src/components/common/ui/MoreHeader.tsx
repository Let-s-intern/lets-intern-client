import clsx from 'clsx';
import { ReactNode } from 'react';

interface MoreHeaderProps {
  children?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  isBig?: boolean;
  isVertical?: boolean;
  gaText: string;
}

const MoreHeader = ({
  children,
  subtitle,
  href,
  isBig,
  isVertical,
  gaText,
}: MoreHeaderProps) => {
  return (
    <div
      className={clsx(
        'flex w-full justify-between',
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
            'text-small20',
            isBig ? 'font-bold md:text-large26' : 'font-semibold',
          )}
        >
          {children}
        </h2>
        {subtitle && <p className="text-xsmall14">{subtitle}</p>}
      </div>
      {href && (
        // home에서 program으로 갈 경우 react, 나머지는 next라서 a태그 사용
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          className={clsx(
            'more_btn font-medium text-neutral-45',
            isBig ? 'text-xsmall16' : 'text-xsmall14',
            isVertical ? 'mt-0.5' : '',
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
