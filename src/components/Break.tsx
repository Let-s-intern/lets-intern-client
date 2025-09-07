import { twMerge } from '@/lib/twMerge';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type BreakProps = {
  breakpoint?: Breakpoint;
};

/**
 * 반응형 줄바꿈 컴포넌트
 * 지정된 브레이크포인트 이상에서는 줄바꿈(<br>)을 표시하고,
 * 그 미만에서는 공백을 표시합니다.
 * 
 * @param breakpoint - 줄바꿈이 적용될 최소 화면 크기 (기본값: 'md')
 * 
 * @example
 * // md 이상에서 줄바꿈, 그 미만에서 공백
 * <Break />
 * 
 * // lg 이상에서 줄바꿈, 그 미만에서 공백
 * <Break breakpoint="lg" />
 */
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
