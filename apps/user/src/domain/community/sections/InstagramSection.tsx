'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { FADE_IN } from '../animations';
import InstagramCard from '../components/InstagramCard';
import { instagramChannels } from '../data/instagram';

export default function InstagramSection() {
  return (
    <section className="w-full bg-[#F7F9FF]">
      <div className="mw-1180 py-16 md:py-32">
        {/* Section header - B2B SectionHeader style */}
        <motion.div className="mb-10 text-center md:mb-16" {...FADE_IN()}>
          <p className="flex items-center justify-center gap-1.5 text-xsmall16 font-medium text-primary-90">
            <Image src="/icons/instagram.svg" alt="" width={20} height={20} />
            인스타그램
          </p>
          <h2 className="mt-4 break-keep text-[26px] font-bold leading-[1.35] text-static-0 md:mt-6 md:text-[40px]">
            취준 인사이트, 빠르게 받아보세요
          </h2>
          <p className="mt-4 break-keep text-xsmall14 leading-[22px] text-neutral-40 md:text-small20">
            렛츠커리어 인스타그램에서 트렌디한 취준 정보를 만나보세요.
          </p>
        </motion.div>

        {/* Instagram cards - 3col desktop, 1col mobile */}
        <motion.div
          className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 md:gap-5"
          {...FADE_IN(0.05)}
        >
          {instagramChannels.map((channel) => (
            <InstagramCard key={channel.id} channel={channel} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
