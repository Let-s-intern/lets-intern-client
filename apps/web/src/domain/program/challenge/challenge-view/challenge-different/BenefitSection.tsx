import BenefitCard from '@/domain/program/program-detail/different/BenefitCard';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { tripleBenefits } from './challenge-different.constants';

const { EXPERIENCE_SUMMARY, ETC } = challengeTypeSchema.enum;

interface BenefitSectionProps {
  challengeType: ChallengeType;
  challengeTitle: string;
  isResumeTemplate: boolean;
  primaryColor: string;
}

const BenefitSection = ({
  challengeType,
  challengeTitle,
  isResumeTemplate,
  primaryColor,
}: BenefitSectionProps) => {
  return (
    <div className="flex w-full flex-col gap-y-8 md:items-center md:gap-y-16">
      <p className="text-small20 md:text-xlarge28 whitespace-pre-line font-bold md:text-center">
        여기서 끝이 아니죠
        <br />
        {challengeTitle}
        <br className="md:hidden" /> 참여자만을 위한{' '}
        {isResumeTemplate ? '' : '트리플'} 혜택!
      </p>

      <div
        className="-mx-5 flex w-fit flex-col gap-y-4 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:px-0"
        style={{ color: primaryColor }}
      >
        {(challengeType === EXPERIENCE_SUMMARY || challengeType === ETC) && (
          <BenefitCard
            title={tripleBenefits[0].title}
            options={tripleBenefits[0].options}
            imgUrl={tripleBenefits[0].imgUrl.src}
          />
        )}
        <BenefitCard
          title={tripleBenefits[1].title}
          options={tripleBenefits[1].options}
          imgUrl={tripleBenefits[1].imgUrl.src}
        />
        {!isResumeTemplate && (
          <BenefitCard
            title={tripleBenefits[2].title}
            options={tripleBenefits[2].options}
            imgUrl={tripleBenefits[2].imgUrl.src}
          />
        )}
      </div>
    </div>
  );
};

export default BenefitSection;
