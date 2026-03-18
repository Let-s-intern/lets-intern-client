import { memo, useMemo } from 'react';
import MentorCard from '../components/MentorCard';
import { COMMON_NOTICE } from '../data/challenge-feedback-data';
import type { ChallengeData } from '../types';

interface MentorListSectionProps {
  challenge: ChallengeData;
}

const MentorListSection = memo(function MentorListSection({
  challenge,
}: MentorListSectionProps) {
  const displayCount =
    challenge.mentorDisplayCount ?? challenge.mentors.length;

  const visibleMentors = useMemo(
    () => challenge.mentors.slice(0, displayCount),
    [challenge.mentors, displayCount],
  );

  return (
    <section className="flex w-full min-h-[70vh] flex-col items-center justify-center bg-[#0f0d2e] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-xl font-bold text-white md:text-2xl">
          {challenge.mentorSectionField},{' '}
          <span className="text-[#B49AFF]">현직자 {displayCount}명</span>이 다
          봐드립니다
        </h2>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:overflow-visible">
          {visibleMentors.map((mentor, i) => (
            <MentorCard key={`${mentor.nickname}-${i}`} mentor={mentor} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          {COMMON_NOTICE}
        </p>
      </div>
    </section>
  );
});

export default MentorListSection;
