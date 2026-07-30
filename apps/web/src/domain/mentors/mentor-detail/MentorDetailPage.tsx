import { DUMMY_MENTOR_DETAIL } from '../data/dummyMentorDetail';
import MentorHeroSection from './MentorHeroSection';
import MentorIntroSection from './MentorIntroSection';

interface MentorDetailPageProps {
  mentorId: string;
}

const MentorDetailPage = (_props: MentorDetailPageProps) => {
  const mentor = DUMMY_MENTOR_DETAIL;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-20 px-5 py-10 md:mb-14 md:px-0">
      <MentorHeroSection mentor={mentor} />
      <MentorIntroSection mentor={mentor} />
    </main>
  );
};

export default MentorDetailPage;
