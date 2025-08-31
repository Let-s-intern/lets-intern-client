import { twMerge } from '@/lib/twMerge';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type BreakProps = {
  breakpoint?: Breakpoint;
};

export const Break = ({ breakpoint = 'md' }: BreakProps) => {
  return (
    <>
      <br
        className={twMerge(
          'hidden',
          breakpoint === 'sm' && 'sm:inline',
          breakpoint === 'md' && 'md:inline',
          breakpoint === 'lg' && 'lg:inline',
          breakpoint === 'xl' && 'xl:inline',
          breakpoint === '2xl' && '2xl:inline',
        )}
      />
      <span
        className={twMerge(
          breakpoint === 'sm' && 'sm:hidden',
          breakpoint === 'md' && 'md:hidden',
          breakpoint === 'lg' && 'lg:hidden',
          breakpoint === 'xl' && 'xl:hidden',
          breakpoint === '2xl' && '2xl:hidden',
        )}
      >
        {' '}
      </span>
    </>
  );
};
