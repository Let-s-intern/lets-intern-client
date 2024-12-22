import { useMediaQuery } from '@mui/material';
import { memo, ReactNode } from 'react';

import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { twMerge } from '@/lib/twMerge';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUB_HEADER = '더 자세한 피드백이 궁금하다면?';
const MAIN_HEADER = '합격을 향한 가장 확실한 방법\n1:1 피드백 서비스';

interface PromoSectionProps {
  reportType: ReportType;
}

function PromoSection({ reportType }: PromoSectionProps) {
  const SUB_HEADER_STYLE = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._171918,
  };
  const SECTION_STYLE = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.E8FDF2,
  };
  const BORDER_STYLE = {
    backgroundImage: `linear-gradient(to right, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.F3A2FF : resumeColors._2CE282}, ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.C34AFF : resumeColors._2CDDEA})`,
  };

  const isMobile = useMediaQuery('(max-width:768px)');

  const reportDisplayName = convertReportTypeToDisplayName(reportType);

  const contentList = [
    {
      title: '개인 맞춤형 심층 코칭',
      content: `당신의 강점과 약점을 정확히 파악하여,\n최적의 ${reportDisplayName}를 작성할 수 있도록 도와드립니다.`,
    },
    {
      title: '전문가와의 1:1 상담',
      content: `전문가와 1:1 상담을 통해 피드백부터 개선 방향 설정,\n그리고 실시간 ${reportDisplayName} 첨삭까지 한 번에 받아보세요.`,
    },
    {
      title: '무제한 질문 가능',
      content: `40분 동안 ${reportDisplayName} 작성부터 취업 전반에 걸친\n모든 궁금증을 마음껏 질문하세요.`,
    },
    {
      title: '전반적인 커리어 솔루션 제공',
      content: `${reportDisplayName} 피드백을 넘어, 커리어 방향 설정,\n인터뷰 준비 등 전반적인 취업 과정을 지원합니다.`,
    },
    {
      title: '합격률 상승을 위한 필수 선택!',
      content:
        '단순 첨삭을 넘어, 합격률을 높일 수 있는\n전략적 지원을 제공합니다.',
    },
  ];

  return (
    <section
      className="w-full px-5 py-16 md:pb-32 md:pt-28 lg:px-0"
      style={SECTION_STYLE}
    >
      <header className="mb-10">
        <SubHeader className="mb-2 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>
          {isMobile ? MAIN_HEADER : MAIN_HEADER.split('\n').join(' ')}
        </MainHeader>
      </header>

      <main className="relative flex max-w-[800px] flex-col gap-5 bg-white px-5 py-7 text-center md:mx-auto md:gap-11 md:py-10">
        <div
          className="absolute left-0 top-0 h-[6px] w-full"
          style={BORDER_STYLE}
        />
        {contentList.map((item, index) => (
          <div key={index}>
            <CardTitle>{item.title}</CardTitle>
            <CardContent>
              {isMobile ? item.content : item.content.split('\n').join(' ')}
            </CardContent>
          </div>
        ))}
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
        'whitespace-pre-line text-xxsmall12 font-medium md:text-xsmall16',
        className,
      )}
    >
      {children}
    </p>
  );
});
