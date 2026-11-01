import { EMPATHY_WORRIES } from '../data/intro';

export function Empathy() {
  return (
    <section className="break-keep bg-[linear-gradient(180deg,#11142b_0%,#222663_100%)] px-5 py-16 text-white md:py-[88px]">
      <h2 className="text-center text-xl font-bold leading-7 tracking-[-0.02em] md:text-4xl md:leading-[50px]">
        혹시 지금, 이런 생각 하고 계시나요?
      </h2>

      <ul className="mx-auto mt-[38px] flex max-w-[522px] flex-col gap-3.5 md:mt-10 md:gap-4">
        {EMPATHY_WORRIES.map((worry, index) => {
          const fromLeft = index % 2 === 0;
          return (
            <li
              key={worry}
              className={`max-w-[284px] px-4 py-3.5 text-base leading-[25px] text-[#1f222b] shadow-[0_6px_16px_rgba(5,6,30,0.25)] md:max-w-none md:px-5 md:py-[15px] md:text-[15px] ${
                fromLeft
                  ? 'self-start rounded-xl rounded-bl-xxs bg-white'
                  : 'self-end rounded-xl rounded-br-xxs bg-[#eef0ff]'
              }`}
            >
              {worry}
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-[13px] leading-[18px] text-white/85 md:mt-[46px] md:text-base md:leading-6">
        쉬고 싶은데 아무것도 안 하고 있으면 또 불안해지는 마음.
        <strong className="block font-bold text-[#ffe066]">
          렛츠커리어도 알고 있어요!
        </strong>
      </p>
    </section>
  );
}
