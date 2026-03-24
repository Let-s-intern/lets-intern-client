'use client';

import { motion } from 'motion/react';
import { heroChips } from './const';

const FADE_IN_UP = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: 0.55 },
};

export default function Hero() {
  return (
    <section className="w-full bg-[#F5F5F3]">
      <div className="mw-1180 px-4 pb-12 pt-16 md:pb-20 md:pt-24">
        <motion.p
          className="mb-4 text-xsmall14 font-semibold text-primary-90 md:text-xsmall16"
          {...FADE_IN_UP}
        >
          렛츠커리어 커뮤니티
        </motion.p>

        <motion.h1
          className="break-keep text-[22px] font-bold leading-[1.4] tracking-[-0.02em] md:text-[36px]"
          {...FADE_IN_UP}
        >
          막막하고 외로운 취준,
          <br />
          함께라면 달라집니다
        </motion.h1>

        <motion.p
          className="mt-4 max-w-[540px] break-keep text-xsmall14 leading-[22px] text-neutral-40 md:mt-6 md:text-xsmall16"
          {...FADE_IN_UP}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          취준 고민과 질문을 자유롭게 공유하고, 렛츠커리어가 아는 만큼
          도와드리는 따뜻한 커뮤니티예요. 합격하시면 꼭 소식 들려주세요. 그
          경험이 다음 취준생에게 이어집니다.
        </motion.p>

        <motion.div
          className="mt-6 flex flex-col gap-2 md:mt-8 md:flex-row md:flex-wrap md:gap-3"
          {...FADE_IN_UP}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {heroChips.map((chip, i) => (
            <span
              key={i}
              className="inline-block rounded-xxs border border-neutral-70 bg-white px-3 py-1.5 text-xxsmall12 text-neutral-30 md:text-xsmall14"
            >
              {`${i + 1}. ${chip}`}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
