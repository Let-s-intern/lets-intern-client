import type { MentorDetailData } from '@/api/mentor/mentorSchema';
import EmptyContainer from '@/common/container/EmptyContainer';

interface MentorIntroSectionProps {
  mentor: MentorDetailData;
}

const MentorIntroSection = ({ mentor }: MentorIntroSectionProps) => {
  const description = mentor.mentorInfo.description;

  return (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium22 text-neutral-0 font-bold">멘토 소개</h2>
        <div className="flex flex-col gap-2">
          {description ? (
            <>
              <p className="text-xsmall16 flex items-center gap-1 font-semibold">
                <img src="/icons/message-dots.svg" alt="" />
                <span>멘토님의 한마디</span>
              </p>
              <p className="text-xsmall16 whitespace-pre-line leading-relaxed">
                {description}
              </p>
            </>
          ) : (
            <EmptyContainer text="아직 등록된 소개가 없습니다." />
          )}
        </div>
      </div>
    </section>
  );
};

export default MentorIntroSection;
