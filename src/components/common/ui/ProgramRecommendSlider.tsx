import useHasScroll from '@/hooks/useHasScroll';
import { memo, MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgramRecommendSliderProps {
  list: {
    id?: number | string;
    backgroundImage: string;
    title: string;
    onClickButton?: MouseEventHandler<HTMLButtonElement>;
    cta: string;
  }[];
  buttonColor?: string;
  className?: string;
}

const textShadowStyle = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

function ProgramRecommendSlider({
  list,
  buttonColor,
  className,
}: ProgramRecommendSliderProps) {
  const { scrollRef, hasScroll } = useHasScroll();

  return (
    <div
      className={twMerge(
        'custom-scrollbar -mx-5 mt-8 max-w-[1000px] overflow-x-auto px-5 md:mx-auto md:mt-16 lg:px-0',
        !hasScroll && 'flex justify-center',
        className,
      )}
      ref={scrollRef}
    >
      <div className="flex min-w-fit gap-4 md:gap-8">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex w-[262px] flex-col items-center md:w-[312px]"
          >
            <div
              className="aspect-[4/3] h-[199px] w-auto overflow-hidden rounded-sm bg-neutral-50 md:h-[235px]"
              style={{
                backgroundImage: `url(${item.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="h-2/3 w-full bg-gradient-to-b from-[#161E31]/40 to-[#161E31]/0 px-5 pt-3">
                <span
                  className="block w-fit text-xsmall16 font-semibold text-white md:text-small18"
                  style={textShadowStyle}
                >
                  {item.title}
                </span>
              </div>
            </div>

            <button
              className="mt-3 w-full rounded-xs bg-primary py-3 text-xsmall16 text-white md:mt-4 md:py-4 md:text-small18"
              style={{ backgroundColor: buttonColor }}
              onClick={item.onClickButton}
            >
              {item.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProgramRecommendSlider);
