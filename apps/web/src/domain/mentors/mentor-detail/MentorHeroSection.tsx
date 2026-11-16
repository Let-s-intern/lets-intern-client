// import OutlinedButton from '@/common/button/OutlinedButton';
// import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';

import type {
  MentorCareerItem,
  MentorDetailData,
  MentorStats,
} from '@/api/mentor/mentorSchema';

import { getSnsIcon, parseSnsList } from './sns';

interface MentorHeroSectionProps {
  mentor: MentorDetailData;
  stats: MentorStats;
}

const getCareerPeriod = (career: MentorCareerItem): string => {
  if (!career.startDate) return '';

  const start = dayjs(career.startDate);
  const end = career.endDate ? dayjs(career.endDate) : dayjs();
  const totalMonths = Math.max(0, end.diff(start, 'month'));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) return '근무';
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}년`;
  return `${years}년 ${months}개월`;
};

const getCareerLabel = (career: MentorCareerItem) => {
  const period = getCareerPeriod(career);
  return `${career.company ?? '-'} | ${career.position || career.job || '-'}${period ? ` ${period}` : ''}`;
};

const CareerRow = ({
  career,
  iconSrc,
}: {
  career: MentorCareerItem;
  iconSrc: string;
}) => (
  <div className="flex items-center gap-1 md:gap-2">
    <div className="flex shrink-0 rounded-full bg-static-100 p-1.5">
      <img
        src={iconSrc}
        alt=""
        className="h-[18px] w-[18px] rounded-xxs object-cover md:h-5 md:w-5"
      />
    </div>
    <p className="text-xsmall14 md:text-xsmall16">
      <span className="mr-1.5">{getCareerLabel(career)}</span>
      {career.endDate === null && (
        <span className="inline-block whitespace-nowrap rounded-xxs bg-primary-10 px-2 py-1 align-middle text-xxsmall12 font-normal text-primary">
          재직 중
        </span>
      )}
    </p>
  </div>
);

const MentorHeroSection = ({ mentor, stats }: MentorHeroSectionProps) => {
  const { mentorInfo, careerList } = mentor;
  const { feedbackMenteeCount, reviewCount, averageScore } = stats;

  const snsList = parseSnsList(mentorInfo.sns);

  const sortedCareers = [...careerList].sort((a, b) => {
    if (a.isRepresentative !== b.isRepresentative) {
      return a.isRepresentative ? -1 : 1;
    }
    return (b.startDate ?? '').localeCompare(a.startDate ?? '');
  });

  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-stretch md:gap-[60px]">
        <div className="aspect-square max-h-[300px] w-full max-w-[300px] shrink-0 overflow-hidden rounded-full bg-neutral-90 md:max-h-[341px] md:max-w-[341px]">
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

        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between md:gap-4">
            <div className="order-2 flex w-full flex-col items-start gap-1 text-center md:order-none md:text-left">
              <h1 className="text-xlarge28 font-bold text-neutral-0">
                {mentorInfo.nickname ?? '멘토 닉네임'}
              </h1>
              <p className="whitespace-nowrap text-small18 font-semibold text-neutral-0">
                {mentorInfo.company ?? '대표 회사'} |{' '}
                {mentorInfo.job ?? '대표 직무'}
              </p>

              {snsList.length > 0 && (
                <div className="flex items-center gap-4 py-1">
                  <span className="text-xsmall16 text-neutral-50">SNS</span>
                  <span className="h-4 w-px bg-neutral-80" />
                  <div className="flex items-center gap-4">
                    {snsList.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-xxs border border-neutral-80 px-[3px] py-[2px] transition-colors hover:bg-neutral-95"
                      >
                        <img
                          src={getSnsIcon(url)}
                          alt=""
                          className="h-4 w-4 object-contain"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 이번 배포에서 숨김 처리 — 추후 재노출 예정 */}
            {/* <div className="order-1 flex shrink-0 items-center gap-6 md:order-none">
              <OutlinedButton size="md">알림 받기</OutlinedButton>
              <SolidButton size="md">1:1 LIVE 멘토링</SolidButton>
            </div> */}
          </div>

          {sortedCareers.length > 0 && (
            <div className="flex flex-1 flex-col justify-start gap-4 rounded-md bg-primary-5 p-4 text-small18 text-neutral-35">
              {sortedCareers.map((career) => (
                <CareerRow
                  key={career.id}
                  career={career}
                  // 경력 로고가 먼저다. 없으면 대표 경력만 대표 로고, 나머지는 기본 아이콘(LC-3499)
                  iconSrc={
                    career.logoImgUrl ||
                    (career.isRepresentative ? mentorInfo.corpImgUrl : null) ||
                    '/icons/company.svg'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-10">
        <div className="flex flex-col items-center gap-1 rounded-xxs border border-neutral-80 px-3 py-2">
          <span className="text-xxsmall12 text-neutral-30 md:text-xsmall14">
            함께한 멘티
          </span>
          <span className="flex items-center gap-1 text-xsmall16 font-medium text-neutral-20 md:text-small20">
            <img
              src="/icons/user-fill.svg"
              alt=""
              className="m-1 h-3.5 w-3.5 md:h-4 md:w-4"
            />
            {feedbackMenteeCount}명
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById('mentor-reviews')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="flex flex-col items-center gap-1 rounded-xxs border border-neutral-80 px-3 py-2 transition-colors hover:bg-neutral-95"
        >
          <span className="text-xxsmall12 text-neutral-30 md:text-xsmall14">
            후기
          </span>
          <span className="flex items-center gap-1 text-xsmall16 font-medium text-neutral-20 md:text-small20">
            {reviewCount}
          </span>
        </button>
        <div className="flex flex-col items-center gap-1 rounded-xxs border border-neutral-80 px-3 py-2">
          <span className="text-xxsmall12 text-neutral-30 md:text-xsmall14">
            평점
          </span>
          <span className="flex items-center gap-1 text-xsmall16 font-medium text-neutral-20 md:text-small20">
            <img
              src="/icons/star-yellow.svg"
              alt=""
              className="h-5 w-5 md:h-6 md:w-6"
            />
            {averageScore.toFixed(1)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default MentorHeroSection;
