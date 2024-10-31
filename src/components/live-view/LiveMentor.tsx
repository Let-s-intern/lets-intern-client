import { LiveIdSchema } from '@/schema';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

interface LiveMentorProps {
  mentor: Pick<
    LiveIdSchema,
    | 'mentorName'
    | 'mentorImg'
    | 'mentorCompany'
    | 'mentorJob'
    | 'mentorCareer'
    | 'mentorIntroduction'
  >;
}

function LiveMentor({ mentor }: LiveMentorProps) {
  return (
    <section
      id="mentor-intro"
      className="mb-20 py-20 md:flex md:flex-col md:items-center md:py-36"
    >
      <Heading2 className="mb-8 md:mb-20">
        렛츠커리어 LIVE 클래스에서만
        <br />
        들을 수 있는 <span className="text-primary">요즘 PM 취업의 A to Z</span>
      </Heading2>
      <SuperTitle className="mb-5 text-neutral-45 md:mb-10">
        멘토 소개
      </SuperTitle>

      <div className="flex flex-col gap-6 md:flex-row">
        <img
          className="h-auto w-full rounded-md md:max-w-[342px]"
          src={mentor.mentorImg}
          alt="멘토 프로필 사진"
        />
        <div className="flex flex-col justify-between gap-6 text-neutral-0">
          <div>
            <span className="text-small20 font-bold">
              {mentor.mentorName} 멘토
            </span>
            <div className="mb-4 mt-1 text-xsmall16 font-semibold md:text-small18">
              <span>{mentor.mentorCompany}</span> |{' '}
              <span>{mentor.mentorJob}</span>
            </div>
            <p className="whitespace-pre-line text-xxsmall12 font-semibold text-neutral-35 md:text-small18">
              {mentor.mentorCareer}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-[#F4F5FF] p-4 pb-5">
            <div className="flex items-center gap-1">
              <img src="/icons/speech-bubble-icon.svg" alt="말풍선 아이콘" />
              <span className="text-xxsmall12 font-semibold text-black md:text-xsmall16">
                멘토님의 한마디
              </span>
            </div>
            <p className="whitespace-pre-line text-xxsmall12 text-black md:text-xsmall16">
              {mentor.mentorIntroduction}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveMentor;
