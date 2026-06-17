'use client';

import { Break } from '@/common/Break';
import { motion } from 'motion/react';
import { FADE_IN } from '../animations';
import { heroChips } from '../data/hero';

export default function Hero() {
  return (
    <section className="w-full bg-[#F7F9FF]">
      <div className="mw-1180 px-4 pb-16 pt-20 text-center md:pb-24 md:pt-32">
        <motion.p
          className="text-xsmall16 text-primary-90 font-medium"
          {...FADE_IN()}
        >
          렛츠커리어 커뮤니티
        </motion.p>

        <motion.h1
          className="mx-auto mt-4 break-keep text-[30px] font-bold leading-[1.4] tracking-[-0.02em] md:mt-6 md:text-[3.5rem] md:font-extrabold md:leading-[1.15]"
          {...FADE_IN()}
        >
          막막하고 외로운 취준,
          <br className="hidden md:block" />{' '}
          <span className="shine-text">함께</span>라면 달라집니다
        </motion.h1>

        <motion.p
          className="text-xsmall14 text-neutral-40 md:text-small20 mx-auto mt-6 w-[256px] break-keep leading-[22px] md:w-auto md:px-0"
          {...FADE_IN(0.05)}
        >
          취준 고민과 질문을 자유롭게 공유하고, 렛츠커리어가
          <Break />
          아는 만큼 도와드리는 따뜻한 커뮤니티예요.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center gap-2.5 md:flex-row md:flex-wrap md:justify-center md:gap-3"
          {...FADE_IN(0.1)}
        >
          {heroChips.map((chip, i) => (
            <span
              key={i}
              className="text-xxsmall12 text-neutral-20 md:text-xsmall14 inline-block rounded-full bg-white px-5 py-2.5 font-medium shadow-sm"
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .shine-text {
          background: linear-gradient(
            90deg,
            #5f6af7,
            #7c83ff,
            #a78bfa,
            #5f6af7
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
