import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

function MainLink({
  className,
  href = '#',
  children,
  ...restProps
}: React.ComponentProps<'a'>) {
  const linkClassName = twMerge('w-fit text-xsmall14 font-medium', className);

  return (
    <HybridLink className={linkClassName} href={href} {...restProps}>
      {children}
    </HybridLink>
  );
}

export default MainLink;
