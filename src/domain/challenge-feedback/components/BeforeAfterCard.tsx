import Image from 'next/image';
import { memo } from 'react';

interface BeforeAfterCardProps {
  type: 'before' | 'after';
  image: string;
  description: string;
}

const BeforeAfterCard = memo(function BeforeAfterCard({
  type,
  image,
  description,
}: BeforeAfterCardProps) {
  const isAfter = type === 'after';

  return (
    <div className="flex flex-1 flex-col items-center">
      {/* 라벨 */}
      {isAfter && (
        <div className="mb-4 rounded-md bg-[#7C6BFF] px-6 py-2 text-lg font-bold text-white md:text-xl">
          After
        </div>
      )}
      {!isAfter && (
        <div className="mb-4 text-lg font-bold text-gray-300 md:text-xl">
          Before
        </div>
      )}

      {/* 이미지 */}
      <div
        className={`overflow-hidden rounded-lg ${
          isAfter ? 'border-2 border-[#7C6BFF]/50' : 'border border-white/10'
        }`}
      >
        <Image
          src={image}
          alt={`${type} 포트폴리오`}
          width={480}
          height={360}
          className="h-auto w-full object-contain"
        />
      </div>

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
