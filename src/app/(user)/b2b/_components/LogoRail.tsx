'use client';

import { motion } from 'motion/react';
import Image, { StaticImageData } from 'next/image';

import l11 from '../_images/l-1-1.png'; // seoul software academy
import l12 from '../_images/l-1-2.png'; // learn spoonz
import l13 from '../_images/l-1-3.png'; // root impact
import l14 from '../_images/l-1-4.png'; // ai career school
import l15 from '../_images/l-1-5.png'; // 슥삭
import l16 from '../_images/l-1-6.png'; // oz코딩스쿨
import l17 from '../_images/l-1-7.png'; // labdx
import l18 from '../_images/l-1-8.png'; // 한경닷컴
import l19 from '../_images/l-1-9.png'; // sniperfactory

import l21 from '../_images/l-2-1.png'; // 성동오랑
import l22 from '../_images/l-2-2.png'; // 슈퍼인턴
import l23 from '../_images/l-2-3.png'; // 부산시
import l24 from '../_images/l-2-4.png'; // 한국교통대
import l25 from '../_images/l-2-5.png'; // 부경대학교
import l26 from '../_images/l-2-6.png'; // 동아대학교
import l27 from '../_images/l-2-7.png'; // soft squared
import l28 from '../_images/l-2-8.png'; // next runners

type Props = {
  className?: string;
  speedSec?: number; // base duration per loop
};

const ROW1: StaticImageData[] = [l11, l12, l13, l14, l15, l16, l17, l18, l19];

const ROW2: StaticImageData[] = [l21, l22, l23, l24, l25, l26, l27, l28];

function MarqueeRow({
  images,
  direction = 'rtl',
  duration = 28,
}: {
  images: StaticImageData[];
  direction?: 'rtl' | 'ltr';
  duration?: number; // seconds
}) {
  // Duplicate the list for seamless looping
  const loopImages = [...images, ...images];

  return (
    <div className="fade-edges relative overflow-hidden">
      <div
        className="marquee-track w-max"
        style={{
          // @ts-expect-error CSS var
          '--duration': `${duration}s`,
          '--direction': direction === 'rtl' ? 'normal' : 'reverse',
        }}
      >
        {loopImages.map((src, idx) => (
          <div key={idx} className="mr-8 md:mr-12">
            <Image
              src={src}
              alt="파트너 로고"
              className="h-12 w-auto object-contain md:h-14 lg:h-16"
              placeholder="empty"
              sizes="(min-width: 1024px) 220px, (min-width: 768px) 180px, 150px"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .marquee-track {
          display: flex;
          align-items: center;
          will-change: transform;
          animation: scroll var(--duration) linear infinite;
          animation-direction: var(--direction);
          gap: 0px; /* we control gap via wrappers for consistent % math */
        }
        .fade-edges {
          --fade: 48px;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            black var(--fade),
            black calc(100% - var(--fade)),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            black var(--fade),
            black calc(100% - var(--fade)),
            transparent 100%
          );
        }
        @media (min-width: 768px) {
          .fade-edges {
            --fade: 72px;
          }
        }
        @media (min-width: 1024px) {
          .fade-edges {
            --fade: 96px;
          }
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

export default function LogoRail({ className, speedSec = 28 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-6">
        <MarqueeRow images={ROW1} direction="rtl" duration={speedSec} />
        <MarqueeRow images={ROW2} direction="ltr" duration={speedSec + 4} />
      </div>
    </motion.div>
  );
}
