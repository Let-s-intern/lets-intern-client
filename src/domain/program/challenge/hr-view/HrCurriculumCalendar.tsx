import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import { ReactNode } from 'react';

interface Props {
  challenge: ChallengeIdPrimitive;
  curriculumImage?: string;
}

interface CalendarItemProps {
  number: number;
  bgColor: string;
  title: string;
  description: ReactNode;
  gap?: string;
  tracking?: string;
}

const CalendarItem = ({
  number,
  bgColor,
  title,
  description,
  gap = 'gap-1.5',
  tracking,
}: CalendarItemProps) => {
  return (
    <li className={`flex flex-col ${gap} ${tracking || ''}`}>
      <div className="flex items-center gap-1.5 text-[16px]">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full ${bgColor} md:text-medium16 text-[12px] font-semibold text-white md:h-5 md:w-5`}
        >
          {number}
        </span>
        <span className="md:text-small16 text-xsmall14 font-semibold">
          {title}
        </span>
      </div>
      <span className="text-xxsmall12 md:text-xsmall14">{description}</span>
    </li>
  );
};

interface CalendarListProps {
  children: ReactNode;
}

const CalendarList = ({ children }: CalendarListProps) => {
  return (
    <ul className="flex w-full flex-col gap-3 rounded-xs bg-white p-3 text-xsmall14 md:min-w-[288px] md:p-4">
      {children}
    </ul>
  );
};

const HrCurriculumCalendar = ({ challenge, curriculumImage }: Props) => {
  const calendarItems = [
    {
      number: 1,
      bgColor: 'bg-[#3B82F6]',
      title: '합격 콘텐츠 & 미션 8회차',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          챌린지 대시보드를 통해 합격 자료를 확인 후 <br />
          회차별 미션을 제출합니다.
        </div>
      ),
      tracking: 'tracking-tight',
    },
    {
      number: 2,
      bgColor: 'bg-[#FB923C]',
      title: '마케터 필수 역량 Class 5회',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          실무 역량을 빠르게 기르는 압축 Class를 <br />
          매주 수요일 저녁에 진행합니다.
        </div>
      ),
    },
    {
      number: 3,
      bgColor: 'bg-[#65C065]',
      title: '현직자 Live Q&A 4회',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          현직자 마케터의 Live Q&A를 <br />
          <strong>매주 토요일 오후 8시</strong>에 진행합니다.
        </div>
      ),
    },
  ];

  return (
    <section className="flex w-full flex-col items-center bg-[#FFF7F2] pt-[60px] md:px-0 md:pb-[140px] md:pt-[100px]">
      <h2 className="mb-5 text-center text-[14px] font-bold md:mb-[60px] md:text-medium24 md:font-semibold">
        한눈에 보는 {'['} {challenge.title ?? ''} {']'} 일정
      </h2>

      <div className="flex w-full flex-col items-center gap-4 md:h-[522px] md:w-fit md:flex-row md:gap-3">
        {/* 왼쪽 달력 이미지 */}
        {curriculumImage && (
          <div className="relative aspect-[320/239] w-full md:h-[522px]">
            <Image
              src={curriculumImage}
              alt="커리큘럼 상세 일정"
              fill
              unoptimized
              className="absolute rounded-xxs object-cover md:rounded-xs"
            />
          </div>
        )}
        {/* 오른쪽 박스 */}
        <div className="relative flex w-full flex-col gap-3 text-neutral-0 md:h-full md:justify-between">
          <CalendarList>
            {calendarItems.map((item) => (
              <CalendarItem key={item.number} {...item} />
            ))}
          </CalendarList>
          <CalendarList>
            <li className="flex flex-col gap-1.5 text-xxsmall12 md:text-xsmall14">
              <div className="text-xxsmall12 md:text-xsmall14">
                <span className="font-bold">+ </span>
                <span className="rounded box-border inline-block rounded-[2px] bg-[#FF7B2E] px-[10px] py-[3px] text-[14px] font-semibold text-white md:text-[16px]">
                  렛츠커리어 24hr 커뮤니티
                </span>
              </div>
              <div className="leading-[20px] md:leading-[22px]">
                현직자 상주 커뮤니티에 참여하여 <br />
                상시 질의응답을 진행합니다.
              </div>
              <div className="leading-[20px] md:leading-[22px]">
                렛츠커리어만의 Special 합격 자료를 <br />
                커뮤니티를 통해 제공합니다.
              </div>
            </li>
            <li className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                + 1:1 피드백을 신청하신 경우
              </span>
              <div className="text-xxsmall12 leading-[20px] md:text-xsmall14 md:leading-[22px]">
                경험 피드백은 3회차 미션 제출 후 진행합니다.
                <br />
                서류 피드백은 8회차 미션 제출 후 진행합니다.
              </div>
            </li>
          </CalendarList>
        </div>
      </div>
    </section>
  );
};

export default HrCurriculumCalendar;
