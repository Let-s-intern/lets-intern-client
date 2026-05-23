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
    <ul className="rounded-xs text-xsmall14 flex w-full min-w-0 flex-col gap-3 bg-white p-4 md:min-w-[288px] md:flex-1 md:flex-shrink-0 md:p-3">
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
                <span
                  className="box-border inline-block rounded rounded-[2px] px-[10px] py-[3px] text-[14px] font-semibold text-white md:text-[16px]"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  렛츠커리어 24hr 커뮤니티
                </span>
              </div>
            </li>
            <div className="flex flex-col gap-1">
              {config.bonusItems?.map((item, index) => (
                <li key={index} className="flex flex-col gap-1">
                  {item.title && (
                    <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                      + {item.title}
                    </span>
                  )}
                  <div className="text-xxsmall12 md:text-xsmall14 leading-[20px] md:leading-[22px]">
                    {item.description}
                  </div>
                </li>
              ))}
            </div>
          </CalendarList>
        </div>
      </div>
    </section>
  );
};

export default CurriculumCalendar;
