import Link from 'next/link';

import { getTagLabel } from '../constants';
import { DummyMentor } from '../data/dummyMentors';

interface MentorCardProps {
  mentor: DummyMentor;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <Link
      href={`/mentors/${mentor.mentorId}`}
      className="flex w-full flex-col items-center p-4 text-center"
    >
      <div className="relative aspect-square w-full max-w-[200px]">
        <div className="bg-neutral-70 relative h-full w-full overflow-hidden rounded-full">
          <img
            src={mentor.profileImage}
            alt={mentor.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-2 py-3">
            <span className="text-xsmall14 text-static-100 font-normal">
              {mentor.name}
            </span>
          </div>
        </div>

        <div className="border-neutral-80 bg-static-100 absolute right-0 top-0 h-[54px] w-[54px] overflow-hidden rounded-full border-2">
          <img
            src={mentor.badgeImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <p className="text-xsmall14 text-neutral-40 line-clamp-2 mt-2">
        {mentor.company} | {mentor.position}
      </p>
      <p className="text-small18 text-neutral-20 line-clamp-2 mt-0.5 font-semibold">
        {mentor.careerTitle}
      </p>

      <div className="flex-1" />

      <div className="bg-neutral-90 text-xxsmall12 text-neutral-0 rounded-1.5 mt-2 w-full truncate px-3 py-2">
        {mentor.tags.map((tag) => `#${getTagLabel(tag)}`).join('  ')}
      </div>
    </Link>
  );
};

export default MentorCard;
