import Link from 'next/link';

import type { MentorListItem } from '@/api/mentor/mentorSchema';
import { twMerge } from '@/lib/twMerge';

interface MentorCardProps {
  mentor: MentorListItem;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const nickname = mentor.nickname ?? '닉네임미지정';

  return (
    <Link
      href={`/mentors/${mentor.mentorId}`}
      className="flex w-full flex-col items-center p-4 text-center"
    >
      <div className="relative aspect-square w-full max-w-[200px]">
        <div className="bg-neutral-70 relative h-full w-full overflow-hidden rounded-full">
          <img
            src={mentor.profileImgUrl ?? '/icons/user-fill.svg'}
            alt={nickname}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-2 py-3">
            <span className="text-xsmall14 text-static-100 font-normal">
              {nickname} 멘토
            </span>
          </div>
        </div>

        <div className="border-neutral-80 bg-static-100 absolute right-0 top-0 h-[54px] w-[54px] overflow-hidden rounded-full border-2">
          <img
            src="/logo/logo-simple.svg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <p className="text-xsmall14 text-neutral-40 mt-2 line-clamp-1">
        하드코딩하드코딩 회사 | 하드코딩 직무 하드코딩 직무
      </p>
      <p className="text-small18 text-neutral-20 mt-0.5 line-clamp-1 font-semibold">
        하드코딩 대표경력대표경력대표경력대표경력
      </p>

      <div className="flex-1" />

      <div
        className={twMerge(
          'text-xxsmall12 text-neutral-0 mt-2 min-h-8 w-full truncate rounded-[6px] px-3 py-2',
          mentor.hashTagList.length > 0 ? 'bg-neutral-90' : 'bg-static-100',
        )}
      >
        {mentor.hashTagList.map((tag) => `#${tag.title}`).join('  ')}
      </div>
    </Link>
  );
};

export default MentorCard;
