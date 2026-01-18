import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import Profile1 from '@/assets/illust/report_profile_1.svg?react';
import Profile2 from '@/assets/illust/report_profile_2.svg?react';
import Profile3 from '@/assets/illust/report_profile_3.svg?react';
import { REPORT_INTRO } from '@/data/reportConstant';
import { REPORT_INTRO_ID } from '@/domain/report/ReportNavigation';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import { useMediaQuery } from '@mui/material';
import React, { ReactNode, useEffect, useRef } from 'react';
import ResearchTeamSection from './ResearchTeamSection';

interface ReportIntroSectionProps {
  type: ReportType;
}

const Section0: Record<
  ReportType,
  {
    steps: ReactNode[];
  }
> = {
  RESUME: {
    steps: [
      <React.Fragment key={0}>
        <p>
          6가지 핵심 기준으로 <strong>이력서의 강점과 약점</strong>을 분석한{' '}
          <strong>솔직하고 객관적인 피드백 & 총평 제공</strong>
        </p>
        <p className="text-xxsmall12 text-neutral-35 md:text-small18">
          가독성/구조 및 구성/직무 적합성/정확성/간결성/구체성
        </p>
      </React.Fragment>,
      <p key={1}>
        두루뭉술한 피드백 X<br />
        구체적인 피드백으로 <strong>명확한 개선 방향 제시</strong>
      </p>,
      <p key={2}>
        직무별 <strong>합격자 사례 제공</strong>
      </p>,
      <p key={3}>
        <strong>채용공고 맞춤형 피드백</strong> (*프리미엄 플랜)
      </p>,
      <p key={4}>
        이력서 작성 <strong>고민에 대한 1:1 상담</strong>
      </p>,
    ],
  },
  PERSONAL_STATEMENT: {
    steps: [
      <React.Fragment key={0}>
        <p>
          5가지 핵심 기준으로 <strong>자소서의 강점과 약점</strong>을 분석한{' '}
          <strong>솔직하고 객관적인 피드백 & 총평 제공</strong>
        </p>
        <p className="text-xxsmall12 text-neutral-35 md:text-small18">
          가독성/구조 및 구성/구체성/직무 적합성/완성도
        </p>
      </React.Fragment>,
      <p key={1}>
        두루뭉술한 피드백 X<br />
        구체적인 피드백으로 <strong>명확한 개선 방향 제시</strong>
      </p>,
      <p key={2}>
        직무별 <strong>합격 비결을 담은 자소서 예시 제공</strong>
      </p>,
      <p key={3}>
        자소서의{' '}
        <strong>{`전체 흐름과 강점을 한눈에 보여주는\n'총평 페이지'`}</strong>로
        스토리의 <strong>통일성과 설득력 강화</strong>
        <br />
        (*프리미엄 플랜)
      </p>,
      <p key={4}>
        자소서 작성 <strong>고민에 대한 1:1 상담</strong>
      </p>,
    ],
  },
  PORTFOLIO: {
    steps: [
      <React.Fragment key={0}>
        <p>
          6가지 핵심 기준으로 <strong>포트폴리오의 강점과 약점</strong>을 분석한{' '}
          <strong>솔직하고 객관적인 피드백 & 총평 제공</strong>
        </p>
        <p className="text-xxsmall12 text-neutral-35 md:text-small18">
          가독성/구조 및 구성/직무 적합성/정확성/간결성/구체성
        </p>
      </React.Fragment>,
      <p key={1}>
        두루뭉술한 피드백 X<br />
        구체적인 피드백으로 <strong>명확한 개선 방향 제시</strong>
      </p>,
      <p key={2}>
        직무별 <strong>합격자 사례 제공</strong>
      </p>,
      <p key={3}>
        <strong>채용공고 맞춤형 피드백</strong> (*프리미엄 플랜)
      </p>,
      <p key={4}>
        포트폴리오 작성 <strong>고민에 대한 1:1 상담</strong>
      </p>,
    ],
  },
};

const ReportIntroSection = ({ type }: ReportIntroSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const subHeaderStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const stepStyle = {
    backgroundColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
    color: type === 'PERSONAL_STATEMENT' ? 'white' : 'black',
  };
  const boxStyle = {
    backgroundColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.E8FDF2,
    borderColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
  };
  const illustStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
  };
  const darkSubHeaderStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const afterStyle = {
    borderColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.EB6CFF
        : resumeColors.D8E36C,
    backgroundColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F3A2FF
        : resumeColors.F7FFAB,
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !beforeRef.current || !afterRef.current)
        return;
      const currentScrollY = window.scrollY;
      const clientRectWidth =
        window.document.body.getBoundingClientRect().width;

      const containerY = containerRef.current.getBoundingClientRect().y;
      const beforeX = beforeRef.current.getBoundingClientRect().x;
      const afterX = afterRef.current.getBoundingClientRect().x;

      const isUp = currentScrollY < lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (containerY >= 200 && containerY <= 300 && afterX >= 200 && !isUp) {
        // containerRef 에서 afterRef 보이게 스크롤
        containerRef.current.scrollTo({
          top: 0,
          left: clientRectWidth,
          behavior: 'smooth',
        });
      } else if (
        containerY >= 200 &&
        containerY <= 300 &&
        beforeX < 200 &&
        isUp
      ) {
        // containerRef 에서 beforeRef 보이게 스크롤
        containerRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const reportIntro = REPORT_INTRO[type];
  const section0 = Section0[type];

  const convertString = (str: string): string => {
    return isDesktop ? str.replace(/\n\n/g, ' ') : str.replace(/\n\n/g, '\n');
  };

  const userProfile = (index: number) => {
    switch (index % 3) {
      case 0:
        return <Profile1 className="h-full w-full" />;
      case 1:
        return <Profile2 className="h-full w-full" />;
      case 2:
        return <Profile3 className="h-full w-full" />;
      default:
        return <Profile1 className="h-full w-full" />;
    }
  };

  return (
    <section
      id={REPORT_INTRO_ID}
      className="flex w-full flex-col items-center whitespace-pre-wrap break-keep text-center text-neutral-0"
    >
      {/* section0 */}
      <div
        data-section="intro-1"
        className="flex w-full max-w-[1000px] flex-col gap-y-[30px] px-5 py-[60px] md:gap-y-[50px] md:pb-[120px] md:pt-[100px] lg:px-0"
      >
        <div className="flex w-full flex-col gap-y-6 md:gap-y-[50px]">
          <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18">
            서비스 소개
          </h5>
          <div className="flex w-full flex-col gap-y-2 md:gap-y-3">
            <span
              className="text-xsmall16 font-bold md:text-small20"
              style={subHeaderStyle}
            >
              서류 합격에 한걸음 더 가까이
            </span>
            <div className="flex w-full flex-col items-center gap-y-5 md:gap-y-[30px]">
              <p className="text-medium22 font-bold md:text-xlarge30">
                {`${convertReportTypeToDisplayName(type)} 피드백 REPORT를 통해\n이런 걸 얻어 가실 거예요.`}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-2 md:w-[643px] md:gap-y-4">
          {section0.steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="mx-auto flex w-full gap-x-2 rounded-md border px-4 py-2.5 md:gap-x-3 md:px-20 md:py-5"
              style={boxStyle}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xxsmall12 font-semibold md:h-[30px] md:w-[30px] md:text-small20"
                style={stepStyle}
              >{`${index + 1}`}</span>
              <div className="flex flex-1 flex-col items-start gap-y-1 text-start text-xsmall14 font-medium md:text-small20">
                {step}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-3 md:w-[643px] md:gap-y-4">
          <h6 className="mx-auto text-xsmall14 font-semibold text-neutral-45 md:text-small18">
            진행 방식
          </h6>
          <div className="flex w-full items-center gap-x-2 md:gap-x-6">
            {reportIntro.section0.images.map((image, index) => (
              <div
                key={`step-img-${index}`}
                className="flex flex-1 flex-col items-center gap-y-1 text-xxsmall12 font-medium text-neutral-20 md:gap-y-2 md:text-small18"
              >
                <img
                  src={image.image}
                  alt={`step-${index}`}
                  className="aspect-square h-auto w-full"
                />
                <span>{image.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* section1 */}
      <div data-section="intro-2" className="w-full bg-neutral-90">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-y-[30px] px-5 pb-[70px] pt-[50px] md:gap-y-[50px] md:pb-[120px] md:pt-[100px] lg:px-0">
          <div className="flex w-full flex-col gap-y-6 md:gap-y-[50px]">
            <div className="flex w-full flex-col items-center gap-y-2 md:gap-y-3">
              <span
                className="text-xsmall16 font-bold md:text-small20"
                style={subHeaderStyle}
              >
                쌓여가는 불합격 메일들...
              </span>
              <div className="flex w-full flex-col items-center gap-y-5 md:gap-y-[30px]">
                <p className="text-medium22 font-bold md:text-xlarge30">
                  {convertString(reportIntro.section1.title)}
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-col gap-y-5 md:w-3/5 md:gap-y-9">
            {reportIntro.section1.questions.map((question, index) => (
              <div
                className="relative flex w-full items-center justify-center rounded-md border px-4 py-3 text-xsmall16 font-bold md:px-[60px] md:py-[30px] md:text-medium24"
                key={`${type}-question-${index}`}
                style={boxStyle}
              >
                {convertString(question)}
                <div
                  className={`absolute z-10 ${index % 2 === 0 ? 'left-2.5' : 'right-0 translate-x-1/3 md:right-2.5'} ${index === 2 ? 'top-full md:top-0' : 'top-full'} h-[50px] w-[50px] -translate-y-2/3 transform md:h-[100px] md:w-[100px]`}
                  style={illustStyle}
                >
                  {userProfile(index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* section2 */}
      {/* 취업 연구팀 소개 */}
      <ResearchTeamSection reportType={type} />
      {/* section3 */}
      <div data-section="intro-4" className="w-full bg-black">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-y-5 px-5 py-[70px] md:gap-y-20 md:pb-[140px] md:pt-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-2 md:gap-y-3">
            <h5
              className="text-xsmall16 font-bold md:text-small20"
              style={darkSubHeaderStyle}
            >{`이제는 합격하는 ${convertReportTypeToDisplayName(type)}로!`}</h5>
            <div className="flex w-full flex-col gap-y-5 md:gap-y-[30px]">
              <p className="text-medium22 font-bold text-white md:text-xlarge30">
                {convertString(reportIntro.section3.title)}
              </p>
              <p className="text-xsmall14 text-neutral-70 md:text-small20">
                {convertString(reportIntro.section3.description)}
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-hidden md:px-24">
            <div
              className="flex w-full items-stretch gap-x-3 overflow-auto pt-8"
              ref={containerRef}
            >
              <div
                className="relative flex min-h-full w-[90%] shrink-0 flex-col rounded-sm md:w-[calc(50%-6px)]"
                ref={beforeRef}
              >
                <div className="absolute left-0 right-0 top-0 z-10 mx-auto flex w-fit -translate-y-1/2 transform items-center justify-center rounded-full bg-neutral-40 px-5 py-3 text-xsmall16 font-semibold text-neutral-30 md:text-small18">
                  BEFORE
                </div>
                <div className="grid h-full w-full grid-rows-4 rounded-sm bg-neutral-40 px-6 py-5 text-small18 font-semibold text-neutral-20 md:px-12 md:text-medium22">
                  {reportIntro.section3.before.map((item, index) => (
                    <div
                      className="h-full w-full"
                      key={`${type}-before-${index}`}
                    >
                      {index !== 0 && <hr className="border-neutral-30" />}
                      <div className="flex h-full w-full items-center justify-center py-4 md:py-6">
                        {convertString(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="relative flex min-h-full w-[90%] shrink-0 flex-col rounded-sm md:w-[calc(50%-6px)]"
                ref={afterRef}
              >
                <div
                  className="absolute left-0 right-0 top-0 z-10 mx-auto flex w-fit -translate-y-1/2 transform items-center justify-center rounded-full border-2 bg-white px-5 py-3 text-xsmall16 font-semibold text-neutral-0 md:text-small18"
                  style={{ borderColor: afterStyle.borderColor }}
                >
                  AFTER
                </div>
                <div
                  className="grid h-full w-full grid-rows-4 rounded-sm px-6 py-5 text-small18 font-semibold md:px-12 md:text-medium22"
                  style={{ backgroundColor: afterStyle.backgroundColor }}
                >
                  {reportIntro.section3.after.map((item, index) => (
                    <div
                      className="h-full w-full"
                      key={`${type}-after-${index}`}
                    >
                      {index !== 0 && (
                        <hr style={{ borderColor: afterStyle.borderColor }} />
                      )}
                      <div className="flex h-full w-full items-center justify-center py-4 md:py-6">
                        {convertString(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportIntroSection;
