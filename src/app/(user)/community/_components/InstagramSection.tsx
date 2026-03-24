'use client';

import { motion } from 'motion/react';
import InstagramCard from './InstagramCard';
import { instagramChannels } from './const';

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: 0.55 },
};

export default function InstagramSection() {
  return (
    <section className="w-full">
      <div className="mw-1180 px-4 py-16 md:py-24">
        {/* Section header */}
        <motion.div
          className="mb-5 flex items-center gap-2.5 border-b-2 border-neutral-10 pb-3 md:mb-6 md:gap-3 md:pb-4"
          {...FADE_IN}
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xxs bg-neutral-90 text-sm md:h-8 md:w-8 md:text-base">
            <span role="img" aria-label="camera">
              📸
            </span>
          </div>
          <h2 className="text-xsmall14 font-bold tracking-tight md:text-small18">
            인스타그램{' '}
            <span className="ml-1 font-normal text-neutral-45">3개 계정</span>
          </h2>
        </motion.div>

        {/* Instagram cards - 3col desktop, 1col mobile */}
        <motion.div
          className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-3.5"
          {...FADE_IN}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          {instagramChannels.map((channel) => (
            <InstagramCard key={channel.id} channel={channel} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
