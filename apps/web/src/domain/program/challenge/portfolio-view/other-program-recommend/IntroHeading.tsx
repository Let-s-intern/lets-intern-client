import Heading2 from '@/common/header/Heading2';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengePoint } from '@/types/interface';
import { josa } from 'es-hangul';

const { EXPERIENCE_SUMMARY, ETC } = challengeTypeSchema.enum;

const IntroHeading = ({
  challengeType,
  challengeTitle,
  weekText,
  isResumeTemplate,
  introHeadingColor,
}: {
  challengeType: ChallengeType;
  challengeTitle: string;
  weekText: ChallengePoint['weekText'];
  isResumeTemplate: boolean;
  introHeadingColor: string;
}) => {
  if (isResumeTemplate) {
    return (
      <Heading2 className="mb-10 break-keep lg:mb-20">
        매력적인 이력서를 완성하는 {weekText}
        <br />
        <span style={{ color: introHeadingColor }}>
          합격 서류 확인하고 멘토 코멘트와 함께
        </span>{' '}
        이력서 완성해요!
      </Heading2>
    );
  }

  const isExperienceSummary =
    challengeType === EXPERIENCE_SUMMARY || challengeType === ETC;
  const taskText = isExperienceSummary ? '경험 정리' : '서류 준비';

  return (
    <Heading2 className="mb-10 break-keep lg:mb-20">
      {josa(challengeTitle, '을/를')} 통해
      <br />
      <span style={{ color: introHeadingColor }}>하루 30분</span>, 단 {weekText}
      만에 {taskText}를 <br className="lg:hidden" />
      끝낼 수 있어요
    </Heading2>
  );
};

export default IntroHeading;
