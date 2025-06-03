import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

export const curriculums = [
  {
    date: '6/21-28',
    title: '+ 네이버웹툰 / 캐시노트 현직자 강연',
    contentClassName: 'max-h-[504px]',
    detail: [
      {
        date: '6/21-23',
        title: '1회차 직무 탐색',
        content: (
          <Description>
            마케터 직무와 업무를 통해 지원서 작성 전략을 탐색합니다.
          </Description>
        ),
      },
      {
        date: '6/24-27',
        title: '2회차 경험 정리',
        content: (
          <Description>
            내 경험을 체계적으로 정리하여 장단점과 역량 키워드를 도출합니다.
          </Description>
        ),
      },
      {
        date: '6/25',
        title: '역량 더하기 | 렛츠커리어 LIVE 클래스',
        content: <Highlight description="마케터 필수 Figma 사용 방법 A to Z" />,
      },
      {
        date: '6/21, 6/28',
        title: '현직자에게 듣는 합격하는 서류의 A-Z',
        content: (
          <div className="flex w-full flex-col items-stretch gap-2">
            <Highlight
              className="bg-[#E9F6EF]"
              companyImg="naver-webtoon.png"
              role="네이버웹툰 퍼포먼스 마케터"
              date="| 6/21 저녁 8시 (온라인)"
              description={
                <>
                  대기업과 스타트업 모두 경험한{' '}
                  <br className="hidden md:block" />
                  합격하는 <br className="md:hidden" />
                  마케터의 포트폴리오를 안내합니다.
                </>
              }
            />
            <Highlight
              className="bg-[#E9F4FF] md:mt-0"
              companyImg="cashnote.png"
              role="캐시노트 그로스 마케터"
              date="| 6/28 저녁 8시 (온라인)"
              description={
                <>
                  현직 마케터가 들려주는 그로스 마케팅의 A-Z,
                  <br className="hidden md:block" /> 합격하는 서류의 공통점을
                  소개합니다.
                </>
              }
            />
          </div>
        ),
      },
    ],
  },
  {
    date: '6/29-7/5',
    title: '+ 클래스101 현직자 강연',
    detail: [
      {
        date: '6/28-6/30',
        title: '3회차 경험 분석3회차 경험 분석',
        content: (
          <Description>
            합격의 Key가 될 수 있는 경험을 분석하고{' '}
            <br className="hidden md:block" />
            기업과 Fit한 요소를 파악합니다.
          </Description>
        ),
      },
      {
        date: '7/1-7/4',
        title: '4회차 컨셉 잡기',
        content: (
          <Description>
            기업에 Fit한 나만의 컨셉을 확보하여 서류 요소의 기반을 완성합니다.
          </Description>
        ),
      },
      {
        date: '7/2',
        title: '역량 더하기 | 렛츠커리어 LIVE 클래스',
        content: (
          <Highlight description="데이터 역량 쌓는 방법. Google Analytics 실습" />
        ),
      },
      {
        date: '7/5',
        title: '현직자에게 듣는 합격하는 서류의 A-Z',
        content: (
          <Highlight
            companyImg="class101.png"
            role="Class 101 콘텐츠 마케터"
            date="| 7/5 저녁 8시 (온라인) "
            description={
              <>
                현직 콘텐츠 마케터와 함께 <br className="hidden md:block" />
                콘텐츠 마케터에게 가장 필요한 경험과 역량을 살펴봅니다.
              </>
            }
          />
        ),
      },
    ],
  },
  {
    date: '7/6-12',
    title: '+ 야놀자 현직자 강연',
    detail: [
      {
        date: '7/5-7/7',
        title: '5회차 이력서 작성',
        content: (
          <Description>
            정리된 경험과 역량에 기반하여 눈에 띄는 이력서를 작성합니다.
          </Description>
        ),
      },
      {
        date: '7/8-7/11',
        title: '6회차 자기소개서 작성',
        content: (
          <Description>
            이력서 컨셉에 기반하여 자기소개서의 공통 문항들을 완성합니다.
          </Description>
        ),
      },
      {
        date: '7/9',
        title: '역량 더하기 | 렛츠커리어 LIVE 클래스',
        content: (
          <Highlight description="데이터 역량 쌓는 방법. 인스타그램 계정, 메타 광고 운영" />
        ),
      },
      {
        date: '7/12',
        title: '현직자에게 듣는 합격하는 서류의 A-Z',
        content: (
          <Highlight
            className="bg-[#FFF0F4]"
            companyImg="yanolja.png"
            role="야놀자 CRM 마케터"
            date="| 7/12 저녁 8시 (온라인)"
            description={
              <>
                IT 스타트업 현직 마케터와 함께 <br />
                CRM 마케터에게 가장 필수적인 경험과 역량을 살펴봅니다.
              </>
            }
          />
        ),
      },
    ],
  },
  {
    date: '7/13-19',
    title: '+ 대학내일 현직자 강연',
    detail: [
      {
        date: '7/12-7/14',
        title: '7회차 포트폴리오 기초',
        content: (
          <Description>
            정리된 역량에 기반하여 포트폴리오 초안을 제작합니다.
          </Description>
        ),
      },
      {
        date: '7/15-7/18',
        title: '8회차 포트폴리오 완성',
        content: (
          <Description>
            채용 담당자의 시선을 멈추게 하는 합격하는 포트폴리오를 완성합니다.
          </Description>
        ),
      },
      {
        date: '7/16',
        title: '역량 더하기 | 렛츠커리어 LIVE 클래스',
        content: (
          <Highlight
            description={
              <>
                렛츠커리어 CMO가 알려주는 <br />
                2025 마케팅 합격 포트폴리오 트렌드
              </>
            }
          />
        ),
      },
      {
        date: '7/19',
        title: '현직자에게 듣는 합격하는 서류의 A-Z',
        content: (
          <Highlight
            className="bg-[#FFF3F2]"
            companyImg="corpuniv.png"
            role="대학내일 AE"
            date="| 7/19 저녁 8시 (온라인) "
            description={
              <>
                대학내일ES, 이런 포트폴리오를 기다려요. <br />
                AE 취업을 위한 나만의 무기를 함께 찾아봅니다.
              </>
            }
          />
        ),
      },
    ],
  },
];

function Description({ children }: { children: ReactNode }) {
  return (
    <p className="whitespace-pre-line text-xxsmall12 text-neutral-0 md:text-xsmall16">
      {children}
    </p>
  );
}

function Highlight({
  companyImg,
  role,
  date,
  description,
  className,
}: {
  companyImg?: string;
  role?: string;
  date?: string;
  description: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-2.5 rounded-xs bg-neutral-90 px-3 py-2.5 text-neutral-0 md:mt-2',
        className,
      )}
    >
      {role && (
        <div className="flex items-center gap-1.5">
          <img
            src={`/images/marketing/${companyImg}`}
            alt=""
            className="h-5 w-5 md:h-7 md:w-7"
          />
          <div className="flex items-center gap-1 text-nowrap text-xxsmall12 md:gap-1.5">
            <span className="text-xsmall16 font-medium md:text-small18">
              {role}
            </span>
            <span>{date}</span>
          </div>
        </div>
      )}
      <p className="text-xsmall16 font-semibold md:text-small18">
        {description}
      </p>
    </div>
  );
}

const CurriculumContent = ({
  curriculum,
}: {
  curriculum: (typeof curriculums)[0];
}) => {
  const isLastItem = (index: number) => index === curriculum.detail.length - 1;

  return (
    <ul>
      {curriculum.detail.map((item, index) => (
        <li key={item.date} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xsmall14 font-semibold text-neutral-0 md:text-small18">
            <span>{item.date}</span>
            <h4>{item.title}</h4>
          </div>
          {item.content}
          {!isLastItem(index) && (
            <hr className="my-2 border-t border-neutral-80 md:my-[14px]" />
          )}
        </li>
      ))}
    </ul>
  );
};

export default CurriculumContent;
