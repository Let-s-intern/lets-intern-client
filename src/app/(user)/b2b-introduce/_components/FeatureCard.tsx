'use client';

import { twMerge } from '@/lib/twMerge';
import Image, { StaticImageData } from 'next/image';

type Props = {
  title: string;
  desc: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  className?: string;
};

export default function FeatureCard({
  title,
  desc,
  imageSrc,
  imageAlt = '',
  className = '',
}: Props) {
  return (
    <section
      className={twMerge(
        'overflow-hidden rounded-ms bg-white shadow-sm',
        className,
      )}
    >
      <div className="relative">
        <div className="relative aspect-[365/171]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          ) : null}
        </div>
      </div>
      <div className="bg-white p-6 md:p-8">
        <h3 className="text-small18 font-semibold text-neutral-0">{title}</h3>
        <p className="mt-2 break-keep text-xsmall14 font-medium text-neutral-40">
          {desc}
        </p>
      </div>
    </section>
  );
}
