import { INTRO_PARAGRAPHS, INTRO_STORIES } from '../data/intro';
import { revealDelay } from '../lib/reveal';
import { IntroStoryIcon } from './IntroStoryIcon';

export function Intro() {
  return (
    <section className="break-keep bg-[#f7f8fc] px-5 py-16 md:py-[88px]">
      <div className="mx-auto max-w-[840px]">
        <h2
          data-reveal
          className="text-2xl font-bold leading-8 tracking-[-0.02em] text-[#1c1e2e] md:text-4xl md:leading-[48px]"
        >
          Connecting the Dots,
          <br />
          고민과 도전 끝에 자신만의 길을 찾은 커리어 선배들의 이야기
        </h2>

        <div
          data-reveal
          className="mt-6 flex max-w-[285px] flex-col gap-6 text-sm leading-5 text-[#5a5c70] md:mt-8 md:max-w-[800px] md:gap-4 md:text-base md:leading-[26px]"
        >
          {INTRO_PARAGRAPHS.map((parts) => (
            <p key={parts[0].text}>
              {parts.map(({ text, strong }) =>
                strong ? (
                  <strong
                    key={text}
                    className="font-medium text-[#1c1e2e] md:font-bold"
                  >
                    {text}
                  </strong>
                ) : (
                  text
                ),
              )}
            </p>
          ))}
        </div>

        <h3
          data-reveal
          className="mt-10 text-lg font-bold leading-6 text-[#1c1e2e] md:mt-[29px]"
        >
          이런 이야기를 들려드려요!
        </h3>
        <ul
          data-reveal-group
          className="mt-4 flex flex-col gap-2 md:gap-[13px]"
        >
          {INTRO_STORIES.map(({ icon, text }, index) => (
            <li
              key={text}
              data-reveal
              data-lift
              style={revealDelay(index)}
              className="flex items-center gap-3 rounded-md border border-[#d9dbe3] bg-white px-4 py-3.5 text-sm font-bold leading-5 text-[#1f222b] md:px-5 md:py-[15px] md:text-base md:font-semibold"
            >
              <IntroStoryIcon name={icon} />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
