'use client';

import { twMerge } from '@/lib/twMerge';
import { motion } from 'motion/react';
import Image from 'next/image';

type Props = {
  title: string;
  content: string;
  tags: string[];
  imageSrc: string;
  logoImageSrc: string;
  className?: string;
};

export default function CaseCard({
  title,
  content,
  tags,
  imageSrc,
  logoImageSrc,
  className = '',
}: Props) {
  return (
    <motion.article
      className={twMerge(
        'overflow-hidden rounded-lg border border-neutral-200 bg-white',
        className,
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Image - 365x160 ratio */}
      <div className="relative h-[160px] w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>

      {/* Text content */}
      <div className="px-6 py-4 text-left">
        {/* Logo */}
        <div className="mb-1">
          <Image
            src={logoImageSrc}
            alt=""
            width={300}
            height={40}
            className="h-10 w-auto object-contain object-left"
          />
        </div>

        {/* Title */}
        <h3 className="mb-0.5 break-keep text-small18 font-semibold text-neutral-0">
          {title}
        </h3>

        {/* Content */}
        <p className="break-keep text-xsmall14 text-neutral-0">{content}</p>

        {/* Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-neutral-90 px-2 py-1 text-xxsmall12 text-neutral-10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
