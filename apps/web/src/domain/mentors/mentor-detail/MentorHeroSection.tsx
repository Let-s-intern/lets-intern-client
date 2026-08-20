import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';

import type {
  MentorCareerItem,
  MentorDetailData,
} from '@/api/mentor/mentorSchema';

interface MentorHeroSectionProps {
  mentor: MentorDetailData;
}

const getCareerLabel = (career: MentorCareerItem) =>
  `${career.company ?? '-'} | ${career.position || career.job || '-'}`;

const CareerRow = ({
  career,
  iconSrc,
}: {
  career: MentorCareerItem;
  iconSrc: string;
}) => (
  <div className="flex items-center gap-2">
    <div className="bg-static-100 flex rounded-full p-1.5">
      <img src={iconSrc} alt="" className="rounded-xxs h-5 w-5 object-cover" />
    </div>
    <span>{getCareerLabel(career)}</span>
    {career.endDate === null && (
      <div className="rounded-xxs text-xxsmall12 bg-primary-10 text-primary flex w-fit px-2 py-1 text-center font-normal">
        재직 중
      </div>
    )}
  </div>
);

const MentorHeroSection = ({ mentor }: MentorHeroSectionProps) => {
  const { mentorInfo, careerList, reviewList } = mentor;

  const sortedCareers = [...careerList].sort((a, b) => {
    if (a.isRepresentative !== b.isRepresentative) {
      return a.isRepresentative ? -1 : 1;
    }
    return (b.startDate ?? '').localeCompare(a.startDate ?? '');
  });

  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-[60px] md:flex-row md:items-stretch">
        <div className="bg-neutral-90 aspect-square max-h-[341px] w-full max-w-[341px] shrink-0 overflow-hidden rounded-full">
          <img
            src={mentorInfo.profileImgUrl ?? '/icons/user-fill.svg'}
            alt={mentorInfo.nickname ?? '멘토 프로필'}
            className={
              mentorInfo.profileImgUrl
                ? 'h-full w-full object-cover'
                : 'h-full w-full object-contain p-20'
            }
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <h1 className="text-xlarge28 text-neutral-0 font-bold">
                {mentorInfo.nickname ?? '멘토 닉네임'}
              </h1>
              <p className="text-small18 text-neutral-0 whitespace-nowrap">
                {mentorInfo.company ?? '대표 회사'} |{' '}
                {mentorInfo.job ?? '대표 직무'}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-6">
              <OutlinedButton size="md">알림 받기</OutlinedButton>
              <SolidButton size="md">1:1 LIVE 멘토링</SolidButton>
            </div>
          </div>

          {sortedCareers.length > 0 && (
            <div className="text-small18 text-neutral-35 bg-primary-5 flex flex-1 flex-col justify-start gap-4 rounded-md p-4">
              {sortedCareers.map((career) => (
                <CareerRow
                  key={career.id}
                  career={career}
                  iconSrc={
                    career.isRepresentative
                      ? (mentorInfo.corpImgUrl ?? '/icons/company.svg')
                      : '/icons/company.svg'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 멘티 수/평점은 API에 필드가 없어 하드코딩 — 후기 수는 reviewList.length로 이미 연결됨 */}
      <div className="grid grid-cols-3 gap-3 md:gap-10">
        <div className="border-neutral-80 rounded-xxs flex flex-col items-center gap-1 border px-3 py-2">
          <span className="text-xsmall14 text-neutral-30">함께한 멘티</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            <img src="/icons/user-fill.svg" alt="" className="m-1 h-4 w-4" />
            0명
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById('mentor-reviews')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="border-neutral-80 rounded-xxs hover:bg-neutral-95 flex flex-col items-center gap-1 border px-3 py-2 transition-colors"
        >
          <span className="text-xsmall14 text-neutral-30">후기</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            {reviewList.length}
          </span>
        </button>
        <div className="border-neutral-80 rounded-xxs flex flex-col items-center gap-1 border px-3 py-2">
          <span className="text-xsmall14 text-neutral-30">평점</span>
          <span className="text-small20 text-neutral-20 flex items-center gap-1 font-medium">
            <img src="/icons/star-fill.svg" alt="" className="h-6 w-6" />
            0.0
          </span>
        </div>
      </div>
    </section>
  );
};

export default MentorHeroSection;
