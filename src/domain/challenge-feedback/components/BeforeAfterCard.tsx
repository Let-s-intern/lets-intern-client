import Image from 'next/image';
import { memo } from 'react';

interface BeforeAfterCardProps {
  type: 'before' | 'after';
  image: string;
  description: string;
  onImageClick: (src: string, alt: string) => void;
}

const BeforeAfterCard = memo(function BeforeAfterCard({
  type,
  image,
  description,
  onImageClick,
}: BeforeAfterCardProps) {
  const isAfter = type === 'after';
  const alt = `${type} 포트폴리오`;

  return (
    <div className="flex flex-1 flex-col items-center">
      {/* 라벨 */}
      <div
        className={`mb-4 rounded-md px-6 py-2 text-lg font-bold md:text-xl ${
          isAfter ? 'bg-[#7C6BFF] text-white' : 'bg-white/10 text-gray-300'
        }`}
      >
        {isAfter ? 'After' : 'Before'}
      </div>

      {/* 이미지 */}
      <button
        type="button"
        onClick={() => onImageClick(image, alt)}
        className="group relative w-full cursor-zoom-in overflow-hidden rounded-lg"
      >
        <Image
          src={image}
          alt={alt}
          width={700}
          height={525}
          className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 700px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
              <line x1={11} y1={8} x2={11} y2={14} />
              <line x1={8} y1={11} x2={14} y2={11} />
            </svg>
          </div>
        </div>
      </button>

      {/* 설명 */}
      <p
        className={`mt-4 text-center text-sm md:text-base ${
          isAfter ? 'font-semibold text-[#B49AFF]' : 'text-gray-400'
        }`}
      >
        {description}
      </p>
    </div>
  );
});

export default BeforeAfterCard;
