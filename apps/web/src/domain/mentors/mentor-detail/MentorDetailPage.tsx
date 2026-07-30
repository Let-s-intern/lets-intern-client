import { DUMMY_MENTOR_DETAIL } from '../data/dummyMentorDetail';

interface MentorDetailPageProps {
  mentorId: string;
}

const MentorDetailPage = ({ mentorId }: MentorDetailPageProps) => {
  const mentor = DUMMY_MENTOR_DETAIL;

  return (
    <main className="flex w-full flex-col">
      <p>
        {mentor.name} 상세페이지 (mentorId: {mentorId})
      </p>
    </main>
  );
};

export default MentorDetailPage;
