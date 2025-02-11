import { memo } from 'react';

import { twMerge } from '@/lib/twMerge';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

/* 챌린지 목표 또는 서류작성 고민 박스 */
function GoalOrConcernsBox({ children, className }: Props) {
  return (
    <div
      className={twMerge(
        'overflow-hidden rounded-md bg-point text-neutral-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default memo(GoalOrConcernsBox);
