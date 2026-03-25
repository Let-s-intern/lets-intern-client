'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import communityStatsImg from '../images/community-stats.png';

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: 0.55 },
};

export default function StatsSection() {
  return (
    <section className="hidden w-full bg-white md:block">
      <div className="mw-1180 py-24 text-center">
        <motion.p
          className="mb-4 text-small20 font-bold text-static-0"
          {...FADE_IN}
        >
          렛츠커리어 자체 플랫폼과 SNS는 월 7만명의 취준생이 함께 합니다.
        </motion.p>
        <motion.p
          className="mb-12 text-xsmall16 text-neutral-40"
          {...FADE_IN}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          렛츠커리어는 매일 취업 준비생 및 인턴/신입 합격생과 가장 가까이에서
          이야기하며, 트렌디한 취준 소식을 전합니다.
        </motion.p>
        <motion.div {...FADE_IN} transition={{ duration: 0.55, delay: 0.1 }}>
          <Image
            src={communityStatsImg}
            alt="렛츠커리어 커뮤니티 현황 - 인스타그램 팔로워 4.6만명+, 월 방문자 2만명+, 톡방 참여자 7,000명+"
            className="rounded-2xl mx-auto w-full max-w-[900px]"
            placeholder="blur"
          />
        </motion.div>
      </div>
    </section>
  );
}
