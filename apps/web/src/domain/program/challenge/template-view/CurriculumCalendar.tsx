import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import { ReactNode } from 'react';
import { CalendarItemConfig, CurriculumSectionConfig } from './types';

interface Props {
  challenge: ChallengeIdPrimitive;
  config: CurriculumSectionConfig;
  curriculumImage?: string;
  lectureCount: number;
}

const BADGE_COLORS = ['bg-[#3B82F6]', 'bg-[#FB923C]', 'bg-[#65C065]'];

const CalendarItem = ({ number, title, description }: CalendarItemConfig) => {
  const bgColor = BADGE_COLORS[(number - 1) % BADGE_COLORS.length];
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[16px]">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full ${bgColor} md:text-medium16 text-[12px] font-semibold text-white md:h-5 md:w-5`}
        >
          {number}
        </span>
        <span className="text-xsmall14 font-semibold md:text-[16px]">
          {title}
        </span>
      </div>
      <span className="text-xxsmall12 md:text-xsmall14">{description}</span>
    </li>
  );
};

const CalendarList = ({ children }: { children: ReactNode }) => {
  return (
    <ul className="rounded-xs text-xsmall14 flex w-full min-w-0 flex-col gap-3 bg-white p-4 md:min-w-[288px] md:flex-shrink-0 md:p-3">
      {children}
    </ul>
  );
};

const DEFAULT_LECTURE_COUNT = 4;

const CurriculumCalendar = ({
  challenge,
  config,
  curriculumImage,
  lectureCount = DEFAULT_LECTURE_COUNT,
}: Props) => {
  const calendarItems = config.getCalendarItems(lectureCount);

  return (
    <section
      className="flex w-full flex-col items-center pt-[60px] md:overflow-x-hidden md:px-0 md:pb-[104px] md:pt-[100px]"
      style={{ backgroundColor: config.lightAccentColor }}
    >
      <h2 className="md:text-medium24 mb-5 text-center text-[14px] font-bold md:mb-[60px] md:font-semibold">
        한눈에 보는 {'['} {challenge.title ?? ''} {']'} 일정
      </h2>

      <div className="flex w-full flex-col items-center gap-4 md:h-[524px] md:w-fit md:flex-row md:items-center md:justify-center md:gap-3 md:overflow-x-hidden">
        {curriculumImage && (
          <div className="relative aspect-[320/239] w-full md:h-[522px]">
            <Image
              src={curriculumImage}
              alt="커리큘럼 상세 일정"
              fill
              unoptimized
              className="rounded-xxs md:rounded-xs absolute object-cover"
            />
          </div>
        )}
        <div className="text-neutral-0 relative flex w-full min-w-0 flex-col gap-3 md:h-full md:justify-between">
          <CalendarList>
            {calendarItems.map((item) => (
              <CalendarItem key={item.number} {...item} />
            ))}
          </CalendarList>
          <CalendarList>
            <li className="text-xxsmall12 md:text-xsmall14 flex flex-col">
              <div className="text-xxsmall12 md:text-xsmall14">
                <span className="font-bold">+ </span>
                <span className="box-border inline-block rounded rounded-[2px] bg-[#FF7B2E] px-[10px] py-[3px] text-[14px] font-semibold text-white md:text-[16px]">
                  렛츠커리어 24hr 커뮤니티
                </span>
              </div>
            </li>
            <div className="flex flex-col gap-1">
              <li className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                  + {challenge.challengeType} 직무 및 산업 스터디
                </span>
                <div className="text-xxsmall12 md:text-xsmall14 leading-[20px] md:leading-[22px]">
                  꾸준한 {challenge.challengeType}에 대한 관심을 보여줄 수 있는{' '}
                  <br />
                  {challenge.challengeType} 직무/산업 스터디 템플릿을 제공해요.
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                  + 1:1 피드백을 신청하신 경우
                </span>
                <div className="text-xxsmall12 md:text-xsmall14 leading-[20px] md:leading-[22px]">
                  내가 희망하는 세부 직무에 맞는 현직자와 <br />
                  매칭되어, 커리어 패스 상담 및 서류 작성과 <br />
                  면접 준비에 대한 조언을 얻을 수 있어요.
                </div>
              </li>
            </div>
          </CalendarList>
        </div>
      </div>
    </section>
  );
};

export default CurriculumCalendar;
