import { twMerge } from '@/lib/twMerge';

interface Props {
  hideMobileBottomNavBar: boolean;
}

function Spacer({ hideMobileBottomNavBar }: Props) {
  const mobileSpace = hideMobileBottomNavBar ? 'h-[44px]' : 'h-[85px]';
  return (
    <div className={twMerge(mobileSpace, 'md:h-[117px]')} aria-hidden="true" />
  );
}

export default Spacer;
