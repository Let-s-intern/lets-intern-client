import { ReportType } from '@/api/report';
import Profile1 from '@/assets/illust/report_profile_1.svg?react';
import Profile2 from '@/assets/illust/report_profile_2.svg?react';
import Profile3 from '@/assets/illust/report_profile_3.svg?react';
import { REPORT_INTRO } from '@/data/reportConstant';
import { ReportColors } from '@/types/interface';
import { useMediaQuery } from '@mui/material';

interface ReportIntroSectionProps {
  colors: ReportColors;
  type: ReportType;
}

const ReportIntroSection = ({ colors, type }: ReportIntroSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reportIntro = REPORT_INTRO[type];

  const convertString = (str: string) => {
    return isDesktop ? str.replace('\n\n', ' ') : str.replace('\n\n', '\n');
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
    <section className="flex w-full flex-col items-center whitespace-pre-wrap break-keep text-center">
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
      <div>문제</div>
      <div>before after</div>
      <div>추천</div>
    </section>
  );
};

export default ReportIntroSection;
