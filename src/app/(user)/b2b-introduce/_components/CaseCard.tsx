'use client';

import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';

type Props = {
  company?: string;
  title: string;
  desc: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export default function CaseCard({
  title,
  desc,
  imageSrc,
  imageAlt = '',
  className = '',
}: Props) {
  return (
    <article
      className={twMerge(
        'overflow-hidden rounded-ms bg-neutral-100',
        className,
      )}
    >
      {/* Media on top (16:9) */}
      <div className="relative">
        <div className="relative aspect-[16/9] bg-neutral-200">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              fill
              className="object-cover"
            />
          ) : null}
        </div>
      </div>
      {/* Text panel same as FeatureCard */}
      <div className="bg-white p-6 md:p-8">
        <h3 className="text-small18 font-semibold text-neutral-0">{title}</h3>
        <p className="mt-2 break-keep text-xsmall14 font-medium text-neutral-40">
          {desc}
        </p>
      </div>
    </article>
  );
}
