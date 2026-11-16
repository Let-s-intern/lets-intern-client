import Heading2 from '@/common/header/Heading2';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { twMerge } from '@/lib/twMerge';
import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';

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
  curriculumTitle: LiveContent['curriculumTitle'];
  className?: string;
  id?: string;
}

function LiveMentor({
  mentor,
  className,
  id,
  curriculumTitle,
}: LiveMentorProps) {
  return (
    <section
      id={id}
      className={twMerge(
        'flex w-full max-w-[1000px] flex-col px-5 pt-[70px] md:items-center md:px-10 md:pt-40',
        className,
      )}
    >
      <Heading2 className="mb-8 md:mb-20 md:text-center">
        렛츠커리어 LIVE 클래스에서만
        <br className="md:hidden" /> 들을 수 있는{' '}
        <br className="hidden md:block" />
        <span className="text-primary">{curriculumTitle}</span>
      </Heading2>
      <SuperTitle className="mb-5 text-primary md:mb-10">멘토 소개</SuperTitle>

      <div className="flex w-full max-w-[800px] flex-col gap-6 md:flex-row">
        {mentor.mentorImg && (
          <img
            className="h-auto w-full rounded-md md:max-w-[342px]"
            src={mentor.mentorImg}
            alt="멘토 프로필 사진"
          />
        )}
        {/* 멘토정보 */}
        <div className="flex w-full flex-col justify-between gap-6 text-neutral-0">
          <div>
            {mentor.mentorName && (
              <span className="text-small20 font-bold">
                {mentor.mentorName}
              </span>
            )}
            {mentor.mentorCompany && mentor.mentorJob && (
              <div className="mb-4 mt-1 text-xsmall16 font-semibold md:text-small18">
                <span>{mentor.mentorCompany}</span> |{' '}
                <span>{mentor.mentorJob}</span>
              </div>
            )}
            {mentor.mentorCareer && (
              <p className="whitespace-pre-line text-xxsmall12 font-semibold text-neutral-35 md:text-small18">
                {mentor.mentorCareer}
              </p>
            )}
          </div>
          {mentor.mentorIntroduction && (
            <div className="flex flex-col gap-2 rounded-md bg-[#F4F5FF] p-4 pb-5">
              <div className="flex items-center gap-1">
                <img src="/icons/speech-bubble-icon.svg" alt="말풍선 아이콘" />
                <span className="text-xxsmall12 font-semibold text-black md:text-xsmall16">
                  멘토님의 한마디
                </span>
              </div>
              <p className="whitespace-pre-line text-xxsmall12 text-black md:text-xsmall16">
                {mentor.mentorIntroduction ?? ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LiveMentor;
