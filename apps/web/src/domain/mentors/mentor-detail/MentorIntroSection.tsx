import { MentorDetail } from '../data/dummyMentorDetail';

interface MentorIntroSectionProps {
  mentor: MentorDetail;
}

const MentorIntroSection = ({ mentor }: MentorIntroSectionProps) => {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium22 text-neutral-0 font-bold">멘토 소개</h2>
        <div className="flex flex-col gap-2">
          <p className="text-xsmall16 flex items-center gap-1 font-semibold">
            <img src="/icons/message-dots.svg" alt="" />
            <span>멘토님의 한마디</span>
          </p>
          <p className="text-xsmall16 whitespace-pre-line leading-relaxed">
            {mentor.introComment}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MentorIntroSection;
