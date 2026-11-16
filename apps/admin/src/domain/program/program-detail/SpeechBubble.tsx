import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';
import { IoTriangleSharp } from 'react-icons/io5';

function SpeechBubble({
  className,
  children,
  bgColor,
  tailPosition = 'right',
  tailHidden = false,
}: {
  className?: string;
  children?: ReactNode;
  bgColor?: string;
  tailPosition?: 'left' | 'right';
  tailHidden?: boolean;
}) {
  return (
    <div
      className={twMerge(
        'min-w-50 md:min-w-120 relative w-fit rounded-full bg-neutral-90 px-8 py-4 text-xxsmall12 font-semibold text-neutral-0 md:px-20 md:py-9 md:text-medium24',
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      {children}
      {!tailHidden && (
        <IoTriangleSharp
          className={twMerge(
            'absolute -bottom-4',
            tailPosition === 'right'
              ? 'right-8 -rotate-90'
              : 'left-8 rotate-90',
          )}
          size={32}
          color={bgColor ? bgColor : '#F3F3F3'}
        />
      )}
    </div>
  );
}

export default SpeechBubble;
