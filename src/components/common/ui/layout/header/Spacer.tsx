import { twMerge } from '@/lib/twMerge';

interface Props {
  hideMobileBottomNavBar: boolean;
  backgroundColor?: string;
}

function Spacer({ hideMobileBottomNavBar, backgroundColor = '' }: Props) {
  const mobileSpace = hideMobileBottomNavBar ? 'h-[44px]' : 'h-[85px]';
  return (
    <div
      className={twMerge(mobileSpace, 'md:h-[116px]', backgroundColor)}
      aria-hidden="true"
    />
  );
}

export default Spacer;
