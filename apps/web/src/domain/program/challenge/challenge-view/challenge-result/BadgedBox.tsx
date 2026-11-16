import Box from '@/domain/program/program-detail/Box';
import { twMerge } from '@/lib/twMerge';
import { CSSProperties, ReactNode } from 'react';

function BadgedBox({
  badgeContent,
  badgeColor,
  className,
  children,
  badgeStyle,
}: {
  badgeContent: string;
  badgeColor?: string;
  className?: string;
  children?: ReactNode;
  badgeStyle?: CSSProperties;
}) {
  const style = { color: badgeColor, ...badgeStyle };

  return (
    <Box
      className={twMerge(
        'flex w-full min-w-[260px] flex-col overflow-hidden p-0 md:p-0',
        className,
      )}
    >
      <div
        className={twMerge(
          'w-full bg-neutral-75 px-2.5 py-1 text-center text-xsmall16 font-semibold text-white md:py-2.5 md:text-small20',
        )}
        style={style}
      >
        {badgeContent}
      </div>
      {children}
    </Box>
  );
}

export default BadgedBox;
