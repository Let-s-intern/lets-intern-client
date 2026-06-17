import { memo } from 'react';

import { twMerge } from '@/lib/twMerge';

interface RequiredStarProps {
  className?: string;
}

function RequiredStar({ className }: RequiredStarProps) {
  return <span className={twMerge('text-requirement', className)}>*</span>;
}

export default memo(RequiredStar);
