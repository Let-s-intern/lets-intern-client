import { memo } from 'react';

import { twMerge } from '@/lib/twMerge';

interface Props {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

// ReviewInstruction에서 공동으로 사용
export const REQUIRED_STYLE =
  'relative after:absolute after:text-requirement after:content-["*"]';

function ReviewQuestion({ children, required = false, className }: Props) {
  return (
    <p
      className={twMerge(
        'text-xsmall16 font-bold text-neutral-0',
        required ? REQUIRED_STYLE : '',
        className,
      )}
    >
      {children}
    </p>
  );
}

export default memo(ReviewQuestion);
