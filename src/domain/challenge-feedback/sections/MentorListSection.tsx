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
  const displayCount = challenge.mentorDisplayCount ?? challenge.mentors.length;

  const visibleMentors = useMemo(
    () => challenge.mentors.slice(0, displayCount),
    [challenge.mentors, displayCount],
  );

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0f0d2e] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-center text-sm font-semibold text-[#B49AFF] md:text-base">
          렛츠커리어 현직자 멘토단
        </p>
        <h2 className="mt-2 text-center text-lg font-bold text-white md:text-2xl">
          서류의 완성도를 높여줄
          <br />
          현직자 멘토단
        </h2>
        <p className="mt-4 text-center text-sm text-gray-300 md:text-lg">
          혼자 준비하느라 막막했다면,
          <br className="md:hidden" />
          이제는 현직자 멘토단이 도와드릴게요
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-5 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:mx-auto [&>*:last-child:nth-child(odd)]:max-w-[50%]">
          {visibleMentors.map((mentor, i) => (
            <MentorCard key={`${mentor.nickname}-${i}`} mentor={mentor} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          {COMMON_NOTICE}
        </p>
      </div>
    </section>
  );
});

export default MentorListSection;
