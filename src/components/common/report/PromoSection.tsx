import { memo, ReactNode } from 'react';

import {
  convertReportTypeToDisplayName,
  convertReportTypeToPathname,
  ReportType,
} from '@/api/report';
import { twMerge } from '@/lib/twMerge';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
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
  const decorationStyle = {
    textDecorationColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const borderStyle = {
    backgroundImage: `linear-gradient(to right, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.F3A2FF : resumeColors._2CE282}, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.C34AFF : resumeColors._2CDDEA})`,
  };

  const reportDisplayName = convertReportTypeToDisplayName(reportType);

  const contentList = [
    {
      title: '전문가와의 1:1 상담',
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
      <header className="mb-10">
        <SubHeader className="mb-2 md:mb-3" style={subHeaderStyle}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="relative flex max-w-[50rem] flex-col items-center gap-5 bg-white px-5 py-7 text-center md:mx-auto md:gap-11 md:py-10">
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
              className="underline underline-offset-4"
              style={decorationStyle}
            >
              3,000명 이상
            </span>
            의 데이터를 보유한 전문가가 제공하는
            <br /> 실시간 첨삭과 맞춤 취업 전략 상담을
            <br className="md:hidden" /> 한번에 받아보세요.
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
        'whitespace-pre-line text-xxsmall12 font-medium md:text-small18',
        className,
      )}
    >
      {children}
    </p>
  );
});
