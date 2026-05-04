import type { Mentor } from './types';
import MentorCard from './ui/MentorCard';

const MentorSection = ({ mentor }: { mentor: Mentor }) => (
  <section>
    <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
      담당 멘토
    </h2>
    <MentorCard mentor={mentor} className="" />
  </section>
);

export default MentorSection;
