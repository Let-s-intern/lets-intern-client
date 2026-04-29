import Image from '@/common/ui/Image';
import { memo } from 'react';
import type { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard = memo(function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white">
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
      {/* 정보 — company/role이 있을 때만 표시 */}
      {(mentor.company || mentor.role) && (
        <div className="space-y-0.5 p-4">
          {mentor.company && (
            <p className="text-sm font-bold text-gray-900">{mentor.company}</p>
          )}
          {mentor.role && (
            <p className="text-xs text-gray-500">{mentor.role}</p>
          )}
        </div>
      )}
    </div>
  );
});

export default MentorCard;
