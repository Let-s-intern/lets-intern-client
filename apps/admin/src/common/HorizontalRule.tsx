import { twMerge } from '@/lib/twMerge';
import { memo } from 'react';

interface HorizontalRuleProps {
  className?: string;
}

function HorizontalRule({ className }: HorizontalRuleProps) {
  return (
    <hr
      className={twMerge('bg-neutral-95 m-0 block h-2 border-none', className)}
    />
  );
}

export default memo(HorizontalRule);
