import { useMediaQuery } from '@mui/material';

import { ReportType } from '@/api/report';
import { personalStatementColors } from '@components/page/ReportPersonalStatementPage';
import { resumeColors } from '@components/page/ReportResumePage';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUPER_TITLE = '전문가와 함께 해결하세요.';
const HEADING =
  '당신을 합격의 길로 이끌,\n렛츠커리어 취업 연구팀을 소개합니다.';

interface ResearchTeamSectionProps {
  reportType: ReportType;
}

const ResearchTeamSection = ({ reportType }: ResearchTeamSectionProps) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };

  return (
    <section
      className="max-w-[1000px] px-5 py-[60px] md:pb-[140px] md:pt-[120px] lg:px-0"
      data-section="intro-3"
    >
      <SubHeader className="mb-2 md:mb-3" style={subHeaderStyle}>
        {SUPER_TITLE}
      </SubHeader>
      <MainHeader>{HEADING}</MainHeader>
      <p className="mb-8 mt-5 text-center text-xsmall14 md:mb-16 md:mt-8 md:text-small20">
        렛츠커리어 취업 연구팀은
        <br className="md:hidden" /> 대기업 및 IT 업계 다양한 직무 현직자들로
        구성되어,
        <br />
        최신 채용 트렌드와 서류 심사 기준을 반영한
        <br className="md:hidden" /> 실질적이고 전문적인 피드백을 제공합니다.
      </p>
      <div className="w-full">
        <img
          className="h-auto w-full"
          src={`/images/research-team-${isMobile ? 'mobile' : 'desktop'}.jpg`}
          alt="취업 연구팀이 속한 회사 목록"
        />
      </div>
    </section>
  );
};

export default ResearchTeamSection;
