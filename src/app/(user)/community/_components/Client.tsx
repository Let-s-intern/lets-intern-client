'use client';

import { motion } from 'motion/react';
import Hero from './Hero';

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

      {/* Kakao Open Chat Section - placeholder */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-24">
          <motion.div {...FADE_IN}>
            <div className="text-center text-neutral-40">
              {/* 카카오 오픈톡방 섹션 (Push 2에서 구현 예정) */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Section - placeholder */}
      <section className="w-full bg-neutral-95">
        <div className="mw-1180 py-16 md:py-24">
          <motion.div {...FADE_IN}>
            <div className="text-center text-neutral-40">
              {/* 인스타그램 섹션 (Push 2에서 구현 예정) */}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
