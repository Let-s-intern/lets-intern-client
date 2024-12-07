import { twMerge } from 'tailwind-merge';

interface HorizontalRuleProps {
  className?: string;
}

function HorizontalRule({ className }: HorizontalRuleProps) {
  return (
    <hr
      className={twMerge('m-0 block h-2 border-none bg-neutral-95', className)}
    />
  );
}

export default HorizontalRule;
