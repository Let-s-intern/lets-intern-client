import { DUMMY_MENTOR_DETAIL } from '../data/dummyMentorDetail';
import MentorHeroSection from './MentorHeroSection';

interface MentorDetailPageProps {
  mentorId: string;
}

const MentorDetailPage = (_props: MentorDetailPageProps) => {
  const mentor = DUMMY_MENTOR_DETAIL;

  return (
    <main className="flex w-full flex-col">
      <MentorHeroSection mentor={mentor} />
    </main>
  );
};

export default MentorDetailPage;
