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
        <span className="text-xsmall14 font-semibold md:text-[16px]">
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
    <ul className="flex w-full flex-col gap-3 rounded-xs bg-white p-4 text-xsmall14 md:min-w-[288px] md:p-3">
      {children}
    </ul>
  );
};

const HrCurriculumCalendar = ({ challenge, curriculumImage }: Props) => {
  const calendarItems = [
    {
      number: 1,
      bgColor: 'bg-[#3B82F6]',
      title: '합격 콘텐츠 & 미션 6회차',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          챌린지 대시보드를 통해 HR 서류 작성 콘텐츠를 <br />
          확인 후 회차별 미션을 제출합니다.
        </div>
      ),
      tracking: 'tracking-tight',
    },
    {
      number: 2,
      bgColor: 'bg-[#FB923C]',
      title: '현직자 LIVE 세미나 5회',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          채용, 리크루팅, HRD, People Analytics 등 <br />
          다양한 분야의 <strong>HR 현직자의 이야기</strong>를 들어요.
        </div>
      ),
    },
    {
      number: 3,
      bgColor: 'bg-[#65C065]',
      title: 'HR/인사 직무 과제 전형 피드백',
      description: (
        <div className="leading-[20px] md:leading-[22px]">
          스페셜 미션으로, IT기업/스타트업/대기업의 <br />
          과제 전형을 3일 만에 수행하고 현직자에게 <br />
          직접 피드백을 받을 수 있어요.
        </div>
      ),
    },
  ];

  return (
    <section className="flex w-full flex-col items-center bg-[#FFF7F2] pt-[60px] md:px-0 md:pb-[104px] md:pt-[100px]">
      <h2 className="mb-5 text-center text-[14px] font-bold md:mb-[60px] md:text-medium24 md:font-semibold">
        한눈에 보는 {'['} {challenge.title ?? ''} {']'} 일정
      </h2>

      <div className="flex w-full flex-col items-center gap-4 md:h-[524px] md:w-fit md:flex-row md:items-center md:justify-center md:gap-3">
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
            <li className="flex flex-col text-xxsmall12 md:text-xsmall14">
              <div className="text-xxsmall12 md:text-xsmall14">
                <span className="font-bold">+ </span>
                <span className="rounded box-border inline-block rounded-[2px] bg-[#FF7B2E] px-[10px] py-[3px] text-[14px] font-semibold text-white md:text-[16px]">
                  렛츠커리어 24hr 커뮤니티
                </span>
              </div>
            </li>
            <div className="flex flex-col gap-1">
              <li className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                  + HR 직무 및 산업 스터디
                </span>
                <div className="text-xxsmall12 leading-[20px] md:text-xsmall14 md:leading-[22px]">
                  꾸준한 HR에 대한 관심을 보여줄 수 있는 <br />
                  HR 직무/산업 스터디 템플릿을 제공해요.
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold leading-[20px] md:text-[16px] md:leading-[22px]">
                  + 1:1 피드백을 신청하신 경우
                </span>
                <div className="text-xxsmall12 leading-[20px] md:text-xsmall14 md:leading-[22px]">
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

export default HrCurriculumCalendar;
