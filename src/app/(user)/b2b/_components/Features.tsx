'use client';

import { motion } from 'motion/react';
import Image, { StaticImageData } from 'next/image';

type Block = {
  title: string;
  desc: string;
  align: 'left' | 'right';
  badge?: string;
  image: StaticImageData;
  num: number;
  className: string;
};

import { twMerge } from '@/lib/twMerge';
import sol1 from '../_images/sol-1.png';
import sol2 from '../_images/sol-2.png';
import sol3 from '../_images/sol-3.png';
import sol4 from '../_images/sol-4.png';
import sol5 from '../_images/sol-5.png';

const blocks: Block[] = [
  {
    title: '맞춤형 취업교육',
    desc: '렛츠커리어는 교육 파트너의 취업 교육 대상, 목적, 직무, 예산에 맞는 서류 작성 교육, 현직자 강의, 1:1 서류 첨삭 등 다양한 렛츠커리어 프로그램을 제공합니다.',
    align: 'left',
    badge: '부트캠프 마무리 후 취업 교육이 어려워요.',
    image: sol1,
    num: 1,
    className: 'bg-primary-20',
  },
  {
    title: '현직자 멘토와 함께 설계한 커리큘럼',
    desc: '렛츠커리어 서류 작성 교육 커리큘럼은 현직자가 직접 참여하여, 실제 기업에서 요구하는 최신 직무 역량과 서류 작성 트렌드를 교육에 반영합니다.',
    align: 'right',
    badge: '최신 트렌드가 반영된 취업 교육이 필요해요.',
    image: sol2,
    num: 2,
    className: 'bg-neutral-20',
  },
  {
    title: '직무별 최신 합격 서류 제공',
    desc: '렛츠커리어는 100기 이상 진행된 서류 작성 교육을 통해 축적한 수천 건의 데이터를 바탕으로, 직무별·산업별 최신 합격 이력서, 자기소개서, 포트폴리오를 교육생에게 제공합니다.',
    align: 'left',
    badge: '최신 트렌드가 반영된 취업 교육이 필요해요.',
    image: sol3,
    num: 2,
    className: 'bg-primary-20',
  },
  {
    title: '교육생 데이터 대시보드 제공',
    desc: '교육생의 참여율, 과제 제출률, 서류 완성도, 만족도를 실시간으로 집계해 교육 파트너에게 데이터 대시보드를 제공합니다.',
    align: 'right',
    badge: '전반적인 취업 교육 참여 및 만족도 관리가 어려워요.',
    image: sol4,
    num: 3,
    className: 'bg-neutral-75',
  },
  {
    title: '현직자 멘토의 피드백을 직접 받으며 서류를 완성해요',
    desc: '렛츠커리어의 현직자 멘토 피드백 > 수정 > 재제출 과정을 거치며 교육생의 참여율과 서류 완성도가 자연스럽게 높아집니다.',
    align: 'left',
    badge: '전반적인 취업 교육 참여 및 만족도 관리가 어려워요.',
    image: sol5,
    num: 3,
    className: 'bg-neutral-20',
  },
];

export default function Features() {
  return (
    <div className="space-y-16 md:space-y-24">
      {blocks.map((b, i) => (
        <FeatureRow key={i} {...b} />
      ))}
    </div>
  );
}

function FeatureRow({
  title,
  desc,
  align,
  badge,
  image,
  num,
  className,
}: Block) {
  const imageEl = (
    <motion.div
      className={twMerge(
        'relative aspect-[500/380] w-full overflow-hidden rounded-sm md:rounded-xl',
        className,
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.55 }}
    >
      <Image src={image} alt="솔루션 이미지" fill className="object-contain" />
    </motion.div>
  );
  const text = (
    <motion.div
      className="w-full text-center md:text-left"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.55, delay: 0.05 }}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-xxs bg-neutral-90 px-3 py-2 text-xxsmall12 text-neutral-10 md:mx-0 md:rounded-md md:text-xsmall16">
          <span className="text-primary-90">{num}</span> {badge}
        </span>
      )}
      <h3 className="mt-3 break-keep text-[28px] font-bold leading-[1.4] text-static-0 md:mt-6 md:text-[34px]">
        {title}
      </h3>
      <p className="mt-2 break-keep text-xsmall14 leading-[22px] text-neutral-40 md:mt-3 md:text-small20 md:leading-[1.6]">
        {desc}
      </p>
    </motion.div>
  );
  return (
    <div className="grid items-center gap-4 md:grid-cols-2 md:gap-16">
      {align === 'left' ? (
        <>
          <div className="order-2 md:order-1">{imageEl}</div>
          <div className="order-1 md:order-2">{text}</div>
        </>
      ) : (
        <>
          <div className="order-1">{text}</div>
          <div className="order-2">{imageEl}</div>
        </>
      )}
    </div>
  );
}
