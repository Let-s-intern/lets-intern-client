import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';

import { MentorDetail } from '../data/dummyMentorDetail';

interface MentorHeroSectionProps {
  mentor: MentorDetail;
}

const MentorHeroSection = ({ mentor }: MentorHeroSectionProps) => {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-[60px] md:flex-row md:items-stretch">
        <img
          src={mentor.profileImage}
          alt={mentor.name}
          className="bg-neutral-70 aspect-square max-h-[341px] w-full max-w-[341px] shrink-0 rounded-full object-cover"
        />

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <h1 className="text-xlarge28 text-neutral-0 font-bold">
                {mentor.name}
              </h1>
              <p className="text-small18 text-neutral-0 whitespace-nowrap">
                {mentor.company} | {mentor.position}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-6">
              <OutlinedButton size="md">알림 받기</OutlinedButton>
              <SolidButton size="md">1:1 LIVE 멘토링</SolidButton>
            </div>
          </div>

          <div className="text-small18 text-neutral-35 bg-primary-5 flex flex-1 flex-col justify-start gap-6 rounded-md p-4">
            <div className="flex items-center gap-2">
              <img
                src={mentor.badgeImage}
                alt=""
                className="rounded-xxs h-6 w-6 object-cover p-1"
              />
              <span>{mentor.representativeInfo.label}</span>
              {mentor.representativeInfo.isActive && (
                <div className="rounded-xxs text-xxsmall12 bg-primary-10 text-primary flex w-fit px-2 py-1 text-center font-normal">
                  재직 중
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <img
                src="/icons/company.svg"
                alt=""
                className="rounded-xxs h-6 w-6 object-cover p-1"
              />{' '}
              <span>{mentor.companyInfo.label}</span>
            </div>

            <ul className="flex flex-col">
              {mentor.bullets.map((bullet, i) => (
                <li key={i}>- {bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-10">
        <div className="border-neutral-80 rounded-xxs flex flex-col items-center gap-1 border px-3 py-2">
          <span className="text-xsmall14 text-neutral-30">함께한 멘티</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            <img src="/icons/user-fill.svg" alt="" className="m-1 h-4 w-4" />
            {mentor.stats.menteeCount}명
          </span>
        </div>
        <div className="border-neutral-80 rounded-xxs flex flex-col items-center gap-1 border px-3 py-2">
          <span className="text-xsmall14 text-neutral-30">후기</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            {mentor.stats.reviewCount}
          </span>
        </div>
        <div className="border-neutral-80 rounded-xxs flex flex-col items-center gap-1 border px-3 py-2">
          <span className="text-xsmall14 text-neutral-30">평점</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            <img src="/icons/star-fill.svg" alt="" className="h-6 w-6" />

            {mentor.stats.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default MentorHeroSection;
