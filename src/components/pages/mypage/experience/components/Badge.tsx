import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

type BadgeProps = ComponentProps<'span'>;

export const Badge = (props: BadgeProps) => (
  <span
    {...props}
    className={cn(
      'rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal',
      props.className,
    )}
  >
    {props.children}
  </span>
);
