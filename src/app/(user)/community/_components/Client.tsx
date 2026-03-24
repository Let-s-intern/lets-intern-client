'use client';

import { motion } from 'motion/react';
import Hero from './Hero';
import KakaoSection from './KakaoSection';

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: 0.55 },
};

export default function Client() {
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <Hero />

      {/* Kakao Open Chat Section */}
      <KakaoSection />

      {/* Section divider */}
      <div className="mw-1180 px-4">
        <hr className="border-t-2 border-dashed border-neutral-70" />
      </div>

      {/* Instagram Section - placeholder */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-24">
          <motion.div {...FADE_IN}>
            <div className="text-center text-neutral-40">
              {/* 인스타그램 섹션 (Push 3에서 구현 예정) */}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
