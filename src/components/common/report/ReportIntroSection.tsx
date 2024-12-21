import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import Profile1 from '@/assets/illust/report_profile_1.svg?react';
import Profile2 from '@/assets/illust/report_profile_2.svg?react';
import Profile3 from '@/assets/illust/report_profile_3.svg?react';
import { REPORT_INTRO } from '@/data/reportConstant';
import { ReportColors } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import { useEffect, useRef } from 'react';

interface ReportIntroSectionProps {
  colors: ReportColors;
  type: ReportType;
}

const ReportIntroSection = ({ colors, type }: ReportIntroSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  const lastScrollY = useRef(0);

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

  const convertString = (str: string) => {
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
    <section className="flex w-full flex-col items-center whitespace-pre-wrap break-keep text-center text-neutral-0">
      {/* section1 */}
      <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-[70px] md:gap-y-20 md:pb-[150px] md:pt-[110px] lg:px-0">
        <div className="flex w-full flex-col gap-y-6 md:gap-y-[50px]">
          <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18">
            서비스 소개
          </h5>
          <div className="flex w-full flex-col items-center gap-y-2 md:gap-y-3">
            <span
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary.DEFAULT }}
            >
              쌓여가는 불합격 메일들...
            </span>
            <div className="flex w-full flex-col items-center gap-y-5 md:gap-y-[30px]">
              <p className="text-medium22 font-bold md:text-xlarge30">
                {convertString(reportIntro.section1.title)}
              </p>
              <p className="text-xsmall14 text-neutral-30 md:text-small20">
                {convertString(reportIntro.section1.description)}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-5 md:w-3/5 md:gap-y-9">
          {reportIntro.section1.questions.map((question, index) => (
            <div
              className="relative flex w-full items-center justify-center rounded-md border px-4 py-3 text-xsmall16 font-bold md:px-[60px] md:py-[30px] md:text-medium24"
              key={`${type}-question-${index}`}
              style={{
                backgroundColor: colors.primary[50],
                borderColor: colors.primary.DEFAULT,
              }}
            >
              {convertString(question)}
              <div
                className={`absolute z-10 ${index % 2 === 0 ? 'left-2.5' : 'right-0 translate-x-1/3 md:right-2.5'} ${index === 2 ? 'top-full md:top-0' : 'top-full'} h-[50px] w-[50px] -translate-y-2/3 transform md:h-[100px] md:w-[100px]`}
                style={{ color: colors.primary.DEFAULT }}
              >
                {userProfile(index)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* section2 */}
      <div className="w-full bg-neutral-90">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-y-6 px-5 py-[70px] md:gap-y-[60px] md:py-[110px] md:pb-[130px] lg:px-0">
          <div className="flex w-full flex-col gap-y-2 md:gap-y-3">
            <h6
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary.DEFAULT }}
            >
              대체 뭐가 문제일까?
            </h6>
            <div className="flex w-full flex-col gap-y-5 md:gap-y-[30px]">
              <p className="text-medium22 font-bold md:text-xlarge30">
                {convertString(reportIntro.section2.title)}
              </p>
              <div className="flex w-full flex-col text-neutral-30 md:gap-y-2">
                <p className="text-xsmall16 font-semibold md:text-medium24">
                  {convertString(reportIntro.section2.subTitle)}
                </p>
                <p className="text-xsmall14 md:text-small20">
                  {convertString(reportIntro.section2.description)}
                </p>
              </div>
            </div>
          </div>
          <img
            src={reportIntro.section2.pointSrc}
            alt="report_intro"
            className="h-auto w-full md:w-[70%]"
          />
        </div>
      </div>
      {/* section3 */}
      <div className="w-full bg-black">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-y-5 px-5 py-[70px] md:gap-y-20 md:pb-[140px] md:pt-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-2 md:gap-y-3">
            <h5
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary.DEFAULT }}
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
          <div className="w-full overflow-x-hidden">
            <div
              className="flex w-full items-stretch gap-x-3 overflow-auto pt-8"
              ref={containerRef}
            >
              <div
                className="relative flex w-[90%] shrink-0 flex-col rounded-sm md:w-[calc(50%-6px)]"
                ref={beforeRef}
              >
                <div className="absolute left-0 right-0 top-0 z-10 mx-auto flex w-fit -translate-y-1/2 transform items-center justify-center rounded-full bg-neutral-40 px-5 py-3 text-xsmall16 font-semibold text-neutral-30 md:text-small18">
                  BEFORE
                </div>
                <div className="flex w-full flex-col rounded-sm bg-neutral-40 px-8 py-5 text-small18 font-semibold text-neutral-20 md:text-medium22">
                  {reportIntro.section3.before.map((item, index) => (
                    <div key={`${type}-before-${index}`}>
                      {index !== 0 && <hr className="border-neutral-30" />}
                      <div className="flex w-full items-center justify-center py-4">
                        {convertString(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="relative flex w-[90%] shrink-0 flex-col rounded-sm md:w-[calc(50%-6px)]"
                ref={afterRef}
              >
                <div
                  className="absolute left-0 right-0 top-0 z-10 mx-auto flex w-fit -translate-y-1/2 transform items-center justify-center rounded-full border-2 bg-white px-5 py-3 text-xsmall16 font-semibold text-neutral-0 md:text-small18"
                  style={{ borderColor: colors.secondary.DEFAULT }}
                >
                  AFTER
                </div>
                <div
                  className="flex w-full flex-col rounded-sm px-8 py-5 text-small18 font-semibold md:text-medium22"
                  style={{ backgroundColor: colors.secondary[50] }}
                >
                  {reportIntro.section3.after.map((item, index) => (
                    <div key={`${type}-after-${index}`}>
                      {index !== 0 && (
                        <hr style={{ borderColor: colors.secondary.DEFAULT }} />
                      )}
                      <div className="flex w-full items-center justify-center py-4">
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
      {/* section4 */}
      <div className="w-full bg-neutral-95">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-y-[50px] px-5 py-[70px] md:gap-y-10 md:pb-[90px] md:pt-20 lg:px-0">
          <div className="flex w-full flex-col gap-y-2 md:gap-y-3">
            <h5
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary.DEFAULT }}
            >{`${convertReportTypeToDisplayName(type)} 작성 현황 체크리스트`}</h5>
            <p className="text-medium22 font-bold md:text-xlarge30">
              {convertString(reportIntro.section4.title)}
            </p>
          </div>
          <div className="flex w-full flex-col gap-y-5 md:w-8/12 md:gap-y-6">
            {reportIntro.section4.checkList.map((item, index) => (
              <div
                key={`${type}-checklist-${index}`}
                className="relative flex w-full items-center justify-center rounded-[10px] bg-white px-4 py-6"
              >
                <div
                  className="absolute left-4 top-0 flex -translate-y-2/3 -rotate-[10deg] items-center justify-center rounded-sm px-2.5 py-1 text-xsmall16 font-bold text-white md:py-1.5 md:text-small18"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                >{`Check ${index + 1}`}</div>
                <p className="text-small18 font-bold md:text-medium24">
                  {convertString(item)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportIntroSection;
