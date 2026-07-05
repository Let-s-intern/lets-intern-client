import PaybackTicket from '@/domain/program/challenge/challenge-view/PaybackTicket';
import DifferentCard, {
  DifferentCardProps,
} from '@/domain/program/program-detail/different/DifferentCard';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { ChallengeType, challengeTypeSchema } from '@/schema';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

interface DifferentSectionProps {
  challengeType: ChallengeType;
  challengeTitle: string;
  deposit: number;
  isResumeTemplate: boolean;
  iconName?: string;
  paypackImgSrc?: string;
  differentList: DifferentCardProps[];
  styles: DifferentCardProps['styles'];
}

const DifferentSection = ({
  challengeType,
  challengeTitle,
  deposit,
  isResumeTemplate,
  iconName,
  paypackImgSrc,
  differentList,
  styles,
}: DifferentSectionProps) => {
  return (
    <div className="flex w-full flex-col gap-y-8 md:gap-y-20">
      <div className="flex w-full flex-col gap-y-6 md:gap-y-12">
        <SuperTitle style={{ color: styles.primaryColor }}>차별점</SuperTitle>
        <div className="flex flex-col gap-y-3 md:items-center">
          <p
            className="text-xsmall16 md:text-small18 font-bold"
            style={{ color: styles.primaryColor }}
          >
            {isResumeTemplate
              ? `${challengeTitle}에서 얻어갈 수 있는 것들`
              : '비교 불가!'}
          </p>
          <div className="md:text-xlarge28 whitespace-pre text-[22px] font-bold text-black md:text-center">
            {isResumeTemplate ? (
              <>
                <span>렛츠커리어 챌린지만의 차별점</span>
                <br />
              </>
            ) : (
              <>
                <span>{challengeTitle}만의</span>
                <br />
              </>
            )}
            <span>
              {isResumeTemplate ? '이 모든걸 ' : '차별점, 이 모든걸 '}
              <img
                className="inline-block h-auto w-8 md:w-10"
                src={`/icons/${iconName}`}
                alt=""
              />{' '}
              얻어가실 수 있어요!
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-6">
        {differentList.map((different) => (
          <DifferentCard
            key={different.title}
            order={different.order}
            title={different.title}
            options={different.options}
            imageUrl={different.imageUrl}
            styles={styles}
          />
        ))}
        {deposit >= 10000 && (
          <div
            className="text-small18 md:text-medium22 relative flex w-full gap-x-2 overflow-hidden rounded-md px-5 pb-10 pt-[30px] font-bold md:px-10 md:py-[50px]"
            style={{
              backgroundColor: styles.primaryLightColor,
              color: styles.primaryLightColor,
            }}
          >
            <span style={{ color: styles.primaryColor }}>혜택</span>
            <p className="z-10 whitespace-pre text-black">
              모든 커리큘럼을 따라오기만 하면,
              <br className="md:hidden" /> {deposit / 10000}
              만원을 페이백해드려요!
            </p>
            {challengeType === PERSONAL_STATEMENT ? (
              <PaybackTicket
                deposit={deposit}
                className="absolute bottom-0 right-0 h-auto w-28 md:top-0 md:w-48"
              />
            ) : (
              <img
                className="absolute bottom-0 right-0 h-auto w-28 md:top-0 md:w-48"
                src={paypackImgSrc}
                alt={`페이백 ${deposit / 10000}만원`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DifferentSection;
