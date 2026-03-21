import Image from 'next/image';
import { memo } from 'react';
import type { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard = memo(function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="flex w-full flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white md:w-[260px]">
      {/* 프로필 이미지 */}
      <div className="relative flex items-end justify-center bg-gray-100 pt-4">
        <Image
          src={mentor.profileImage}
          alt={`${mentor.nickname} 프로필`}
          width={200}
          height={220}
          className="h-[140px] w-auto object-contain md:h-[220px]"
        />
      </div>
      {/* 정보 */}
      <div className="p-4">
        <p className="text-sm font-bold text-gray-900">{mentor.company}</p>
        <p className="mt-0.5 text-xs text-gray-500">{mentor.role}</p>
      </div>
    </div>
  );
});

export default MentorCard;
