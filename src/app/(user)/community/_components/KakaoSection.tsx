'use client';

import { motion } from 'motion/react';
import OgongoBlock from './OgongoBlock';
import QnaChatCard from './QnaChatCard';
import { kakaoRooms } from './const';

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: 0.55 },
};

export default function KakaoSection() {
  return (
    <section className="w-full">
      <div className="mw-1180 py-16 md:py-32">
        {/* Section header - B2B SectionHeader style */}
        <motion.div className="mb-10 text-center md:mb-16" {...FADE_IN}>
          <p className="text-xsmall16 font-medium text-primary-90">
            카카오 오픈톡방
          </p>
          <h2 className="mt-4 break-keep text-[26px] font-bold leading-[1.35] text-static-0 md:mt-6 md:text-[40px]">
            취준 고민, 혼자 안고 있지 마세요
          </h2>
          <p className="mt-4 break-keep text-xsmall14 leading-[22px] text-neutral-40 md:text-small20">
            렛츠커리어 커뮤니티에서 질문하고 정보 나누며 함께 취뽀해요.
          </p>
        </motion.div>

        {/* QNA cards - 2col desktop, 1col mobile */}
        <motion.div
          className="mb-6 grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-5"
          {...FADE_IN}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          {kakaoRooms.map((room) => (
            <QnaChatCard key={room.id} room={room} />
          ))}
        </motion.div>

        {/* Ogonggo block */}
        <motion.div
          className="px-4"
          {...FADE_IN}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <OgongoBlock />
        </motion.div>
      </div>
    </section>
  );
}
