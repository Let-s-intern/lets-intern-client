'use client';

import { twMerge } from '@/lib/twMerge';
import { Break } from '@components/Break';
import { motion } from 'motion/react';
import iconPortfolio from '../_images/icon-portfolio-32-32.svg';
import iconResume from '../_images/icon-resume-32-32.svg';
import iconSelf from '../_images/icon-self-32-32.svg';
import { contactLink } from './const';

export default function Hero() {
  return (
    <>
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-[50px] top-[80px] md:left-1/2 md:top-1/3 md:-translate-x-[450px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.0 }}
        >
          <HeroBadge
            label="포트폴리오"
            animate="float"
            duration={6.2}
            amplitude={6}
            Icon={iconPortfolio}
          />
        </motion.div>
        <motion.div
          className="absolute left-[calc(50%-20px)] top-[50px] md:top-16 md:translate-x-[100px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <HeroBadge
            label="이력서"
            animate="float"
            duration={7.4}
            amplitude={6}
            Icon={iconResume}
          />
        </motion.div>
        <motion.div
          className="absolute right-[50px] top-[95px] md:left-1/2 md:right-auto md:top-1/2 md:-translate-y-[40px] md:translate-x-[330px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          <HeroBadge
            label="자기소개서"
            animate="float"
            duration={5.6}
            amplitude={6}
            delay={0.3}
            Icon={iconSelf}
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h1
          className="mx-auto break-keep text-[30px] font-bold leading-[1.4] tracking-[-0.02em] md:text-[3.5rem] md:font-extrabold md:leading-[1.15]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55 }}
        >
          <span className="shine-text">합격</span>으로 이어지는 서류,
          <br className="hidden md:block" /> 렛츠커리어가 설계합니다
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 w-[256px] break-keep text-xsmall14 leading-[22px] text-neutral-40 md:w-auto md:px-0 md:text-small20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55 }}
        >
          직무별 취업 시장 맞춤형 교육으로, 취업준비생의 경험과 역량을
          <Break />
          극대화하여 이력서·자기소개서·포트폴리오를 완성합니다.
        </motion.p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <motion.a
            href="https://drive.google.com/drive/folders/16neodrrBoI3RcS_FLvVVS9TisZTwWlbn?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="b2b_introduce_download inline-flex items-center justify-center rounded-xs bg-primary-90 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-primary-90 md:px-5 md:text-xsmall16"
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
      <style jsx>{`
        /* animated gradient text for 강조어 */
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
    </>
  );
}

function HeroBadge({
  label,
  className,
  animate = 'none',
  duration = 6,
  amplitude = 6,
  delay = 0,
  Icon,
}: {
  label: string;
  className?: string;
  animate?: 'none' | 'float';
  duration?: number; // seconds
  amplitude?: number; // px
  delay?: number; // seconds
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
}) {
  const animStyle =
    animate === 'float'
      ? ({
          '--float-d': `${duration}s`,
          '--float-a': `${amplitude}px`,
          '--float-delay': `${delay}s`,
          animation:
            'hero-badge-float var(--float-d) ease-in-out var(--float-delay) infinite',
        } as React.CSSProperties)
      : undefined;
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-xxs bg-white/90 p-1.5 shadow-06 backdrop-blur-md md:p-3',
        className,
      )}
      style={animStyle}
    >
      <span className="inline-flex items-center justify-center overflow-hidden rounded-xxs">
        <Icon
          viewBox="0 0 32 32 "
          className="h-4 w-4 md:h-8 md:w-8"
          aria-hidden
        />
      </span>
      <span className="text-xxsmall12 text-neutral-10 md:text-xsmall16">
        {label}
      </span>
      <style jsx>{`
        @keyframes hero-badge-float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(calc(var(--float-a) * -1));
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
