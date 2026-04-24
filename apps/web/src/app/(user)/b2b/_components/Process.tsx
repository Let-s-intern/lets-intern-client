'use client';

import { motion } from 'motion/react';
import DownArrow from '../_images/down-arrow-36-20.svg';
import { contactLink } from './const';

const steps = [
  '교육 문의하기',
  '교육 담당자의 고민 미팅',
  '맞춤형 취업 교육 제안',
  '교육 과정 운영',
  '결과 리포트 전달',
];

export default function Process() {
  return (
    <div className="w-full bg-[#0F1B42] py-16 md:py-20">
      <div className="mw-1180">
        <div className="grid gap-4 md:grid-cols-2 md:gap-24 md:gap-8">
          {/* Left side - Title and description */}
          <div className="flex flex-col items-start justify-center pb-3">
            <motion.h3
              className="mx-auto mb-6 text-center text-[26px] font-bold text-white md:mx-0 md:text-left md:text-[40px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.55 }}
            >
              맞춤형 취업
              <br />
              교육을 위한 단계
            </motion.h3>
            <motion.p
              className="mb-8 break-keep text-center text-xsmall14 font-normal text-white/50 md:text-left md:text-small20"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              렛츠커리어는 교육 파트너의 취업 교육 대상, 목적, 직무에 맞춰서
              맞춤형 서류 작성 교육을 제공합니다.
            </motion.p>
            <motion.a
              href={contactLink}
              target="_blank"
              className="b2b_education_inquire inline-flex w-full items-center justify-center rounded-xs bg-primary-90 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm transition hover:bg-primary-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:w-auto md:px-5 md:text-xsmall16"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.55, delay: 0.06 }}
            >
              맞춤 교육 문의
            </motion.a>
          </div>

          {/* Right side - Steps */}
          <div className="relative pr-0 md:pr-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="rounded-2xl flex items-center rounded-sm bg-white/15 px-6 py-4 backdrop-blur-sm transition-all hover:bg-white/15">
                  <div className="flex items-center gap-4">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-static-100/25 text-xsmall14 text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-small18 font-semibold text-white">
                      {step}
                    </h3>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex h-8 items-center justify-center">
                    <DownArrow alt="" width={36} height={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
