import { CSSProperties, memo, MouseEventHandler } from 'react';

import { twMerge } from '@/lib/twMerge';

interface SlideItem {
  id?: number | string;
  backgroundImage: string;
  title: string;
  cta: string;
  to: string;
  onClickButton?: MouseEventHandler<HTMLButtonElement>;
}

interface ProgramRecommendSliderProps {
  list: SlideItem[];
  buttonStyle?: CSSProperties;
  className?: string;
  buttonClassName?: string;
}

const TEXT_SHADOW_STYLE = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

function ProgramRecommendSlider({
  list,
  buttonStyle,
  className,
  buttonClassName,
}: ProgramRecommendSliderProps) {
  const pushDataLayer = (item: SlideItem) => {
    const pageTitle = document.querySelector('title')?.textContent ?? '';

    // GA 데이터 전송
    window.dataLayer?.push({
      event: 'program_recommend_click',
      click_url: item.to,
      page_url: location.pathname,
      page_title: pageTitle,
    });
  };

  return (
    <div className={twMerge('custom-scrollbar overflow-x-auto', className)}>
      <div className="flex min-w-fit gap-4 md:gap-7">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex w-[262px] flex-col items-center md:w-[312px]"
          >
            <div
              className="aspect-[4/3] h-[12rem] w-full overflow-hidden rounded-sm bg-neutral-50 md:h-[15rem]"
              style={{
                backgroundImage: `url(${item.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="h-2/3 w-full bg-gradient-to-b from-[#161E31]/40 to-[#161E31]/0 px-5 pt-3">
                <span
                  className="block w-fit text-xsmall16 font-semibold text-white md:text-small18"
                  style={TEXT_SHADOW_STYLE}
                >
                  {item.title}
                </span>
              </div>
            </div>

            <button
              className={twMerge(
                'program_recommend mt-3 w-full rounded-xs bg-primary py-3 text-xsmall16 text-white md:mt-4 md:py-4 md:text-small18',
                buttonClassName,
              )}
              data-url={item.to}
              style={buttonStyle}
              onClick={(e) => {
                pushDataLayer(item); // GA 데이터 전송
                if (item.onClickButton) item.onClickButton(e);
              }}
            >
              {item.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

ProgramRecommendSlider.displayName = 'ProgramRecommendSlider';

export default memo(ProgramRecommendSlider);
