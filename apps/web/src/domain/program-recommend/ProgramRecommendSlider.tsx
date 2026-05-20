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

/**
 * 슬라이더 끝에 추가되는 단일 슬라이드.
 *
 * `trailingSlide`는 `memo` 비교에서 참조 동등성을 유지해야 한다.
 * 호출부에서 반드시 `useMemo`로 감싸 안정화하라.
 *
 * - `eventName`: GA 클릭 이벤트명. 미지정 시 기본(`program_recommend_click`) 사용.
 * - `buttonClassName`: 트레일링 슬라이드 버튼에만 적용되는 클래스 (예: 큐레이션 카드는 주황 고정).
 * - `ariaLabel`: 카드 전체에 부여할 접근성 라벨.
 */
type TrailingSlide = SlideItem & {
  eventName?: string;
  buttonClassName?: string;
  ariaLabel?: string;
};

interface ProgramRecommendSliderProps {
  list: SlideItem[];
  buttonStyle?: CSSProperties;
  className?: string;
  buttonClassName?: string;
  /**
   * 슬라이더 마지막에 추가되는 트레일링 슬라이드.
   * 호출부에서 `useMemo`로 감싸 참조 안정성을 확보하라.
   */
  trailingSlide?: TrailingSlide;
}

const TEXT_SHADOW_STYLE = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

const DEFAULT_GA_EVENT = 'program_recommend_click';

function ProgramRecommendSlider({
  list,
  buttonStyle,
  className,
  buttonClassName,
  trailingSlide,
}: ProgramRecommendSliderProps) {
  const pushDataLayer = (item: SlideItem, eventName: string) => {
    const pageTitle = document.querySelector('title')?.textContent ?? '';

    // GA 데이터 전송
    window.dataLayer?.push({
      event: eventName,
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
                  className="text-xsmall16 md:text-small18 block w-fit font-semibold text-white"
                  style={TEXT_SHADOW_STYLE}
                >
                  {item.title}
                </span>
              </div>
            </div>

            <button
              className={twMerge(
                'program_recommend rounded-xs bg-primary text-xsmall16 md:text-small18 mt-3 w-full py-3 text-white md:mt-4 md:py-4',
                buttonClassName,
              )}
              data-url={item.to}
              style={buttonStyle}
              onClick={(e) => {
                pushDataLayer(item, DEFAULT_GA_EVENT); // GA 데이터 전송
                if (item.onClickButton) item.onClickButton(e);
              }}
            >
              {item.cta}
            </button>
          </div>
        ))}

        {trailingSlide && (
          <div
            key={trailingSlide.id ?? 'trailing-slide'}
            className="flex w-[262px] flex-col items-center md:w-[312px]"
            aria-label={trailingSlide.ariaLabel}
          >
            <div
              className="aspect-[4/3] h-[12rem] w-full overflow-hidden rounded-sm bg-neutral-50 md:h-[15rem]"
              style={{
                backgroundImage: `url(${trailingSlide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="h-2/3 w-full bg-gradient-to-b from-[#161E31]/40 to-[#161E31]/0 px-5 pt-3">
                <span
                  className="text-xsmall16 md:text-small18 block w-fit font-semibold text-white"
                  style={TEXT_SHADOW_STYLE}
                >
                  {trailingSlide.title}
                </span>
              </div>
            </div>

            <button
              className={twMerge(
                'program_recommend rounded-xs bg-primary text-xsmall16 md:text-small18 mt-3 w-full py-3 text-white md:mt-4 md:py-4',
                trailingSlide.buttonClassName,
              )}
              data-url={trailingSlide.to}
              style={buttonStyle}
              onClick={(e) => {
                pushDataLayer(
                  trailingSlide,
                  trailingSlide.eventName ?? DEFAULT_GA_EVENT,
                );
                if (trailingSlide.onClickButton) trailingSlide.onClickButton(e);
              }}
            >
              {trailingSlide.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ProgramRecommendSlider.displayName = 'ProgramRecommendSlider';

export default memo(ProgramRecommendSlider);
