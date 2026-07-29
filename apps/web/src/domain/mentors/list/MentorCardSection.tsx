import { DUMMY_MENTORS } from './dummyMentors';
import MentorCard from './MentorCard';

const MentorCardSection = () => {
  return (
    <section className="mb-[60px] mt-10 grid w-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
      {DUMMY_MENTORS.map((mentor) => (
        <MentorCard key={mentor.mentorId} mentor={mentor} />
      ))}
    </section>
  );
};

export default MentorCardSection;
