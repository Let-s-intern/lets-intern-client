'use client';

import { Break } from '@/common/Break';
import { motion } from 'motion/react';
import finalCtaBg from '../_images/final-cta-bg.png';
import { contactLink } from './const';

export default function FinalCTA() {
  return (
    <div
      className="rounded-md bg-cover bg-center px-4 py-10 text-center shadow-sm md:p-12"
      style={{
        backgroundImage: `url("${finalCtaBg.src}")`,
      }}
    >
      <motion.h3
        className="break-keep text-[26px] font-semibold text-white md:text-xxlarge36"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.55 }}
      >
        여러분의 기관에 맞춘 취업 교육
        <Break />
        지금 바로 제안 받아 보세요.
      </motion.h3>
      <div className="mt-8 flex items-center justify-center gap-3">
        <motion.a
          href="https://drive.google.com/drive/folders/16neodrrBoI3RcS_FLvVVS9TisZTwWlbn?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="b2b_introduce_download inline-flex items-center justify-center rounded-xs bg-white px-5 py-3 text-xsmall16 font-medium text-black shadow-sm transition hover:text-neutral-20 md:px-5 md:text-xsmall16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55 }}
        >
          교육 소개서 받기
        </motion.a>

        <motion.a
          href={contactLink}
          target="_blank"
          className="b2b_education_inquire inline-flex items-center justify-center rounded-xs bg-neutral-900 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-5 md:text-xsmall16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55, delay: 0.06 }}
        >
          맞춤 교육 문의
        </motion.a>
      </div>
    </div>
  );
}
