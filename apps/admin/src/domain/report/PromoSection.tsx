import { memo, ReactNode } from 'react';

import {
  convertReportTypeToDisplayName,
  convertReportTypeToPathname,
  ReportType,
} from '@/api/report';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import { twMerge } from '@/lib/twMerge';
import clsx from 'clsx';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUB_HEADER = '진단 리포트는 받았는데\n어떻게 수정해야 할지 막막하다면?';
const MAIN_HEADER =
  '실시간 첨삭부터 취업 전략까지,\n”1:1 온라인 상담”을 추천합니다!';

interface PromoSectionProps {
  reportType: ReportType;
}

function PromoSection({ reportType }: PromoSectionProps) {
  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const sectionStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.E8FDF2,
  };
  const borderStyle = {
    backgroundImage: `linear-gradient(to right, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.F3A2FF : resumeColors._2CE282}, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.C34AFF : resumeColors._2CDDEA})`,
  };

  const reportDisplayName = convertReportTypeToDisplayName(reportType);

  const contentList = [
    {
      title: '렛츠커리어 취업연구팀과 1:1 상담',
    },
    {
      title: '무제한 질문 가능',
      content: `40분 동안 ${reportDisplayName} 작성부터 취업 전반에 걸친\n모든 궁금증을 마음껏 질문하세요.`,
    },
  ];

  return (
    <section
      data-section="price-3"
      className="w-full px-5 py-16 md:pb-32 md:pt-28 lg:px-0"
      style={sectionStyle}
    >
      <div className="mb-10">
        <SubHeader className="mb-2 md:mb-3" style={subHeaderStyle}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </div>

      <main className="relative flex max-w-[50rem] flex-col items-center gap-5 bg-white px-5 py-7 text-center text-neutral-0 md:mx-auto md:gap-11 md:py-10">
        <div
          className="absolute left-0 top-0 h-[6px] w-full"
          style={borderStyle}
        />
        <div className="w-48 md:w-80">
          <img
            className="h-auto w-full"
            src={`/images/report/report-promo-${convertReportTypeToPathname(reportType)}.png`}
          />
        </div>
        <div>
          <CardTitle>{contentList[0].title}</CardTitle>
          <CardContent>
            <span
              className={clsx(
                // 밑줄
                {
                  'after:bg-text-decoration-line-resume':
                    reportType === 'RESUME',
                  'after:bg-text-decoration-line-personal-statement':
                    reportType === 'PERSONAL_STATEMENT',
                },
                'relative after:absolute after:-bottom-1.5 after:-left-1 after:h-2 after:w-[68px] after:bg-contain after:bg-no-repeat after:md:w-[82px]',
              )}
            >
              3,000+명
            </span>
            의 프로그램 참여자와 합격 서류 및 노하우를 보유한
            <br className="hidden md:block" /> 렛츠커리어의 취업연구팀이
            제공하는
            <br /> 실시간 첨삭제안과 맞춤 취업 전략 상담을
            <br className="sm:hidden" /> 한번에 받아보세요.
          </CardContent>
        </div>
        <div>
          <CardTitle>{contentList[1].title}</CardTitle>
          <CardContent>{contentList[1].content}</CardContent>
        </div>
      </main>
    </section>
  );
}

export default PromoSection;

const CardTitle = memo(function CardTitle({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        'mb-2 block text-small18 font-semibold md:text-medium22',
        className,
      )}
    >
      {children}
    </span>
  );
});

const CardContent = memo(function CardContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={twMerge(
        'whitespace-pre-line text-xsmall14 font-medium md:text-small18',
        className,
      )}
    >
      {children}
    </p>
  );
});
