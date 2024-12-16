import { useMediaQuery } from '@mui/material';

import { ReportColors } from '@/types/interface';
import DetailHeading2 from './DetailHeading2';
import SuperTitle from './SuperTitle';

const SUPER_TITLE = '믿고 맡겨도 될까? 더이상 걱정마세요.';
const HEADING =
  '당신을 합격의 길로 이끌,\n렛츠커리어 취업 연구팀을 소개합니다.';

interface ResearchTeamSectionProps {
  colors: ReportColors;
}

const ResearchTeamSection = ({ colors }: ResearchTeamSectionProps) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  const superTitleStyle = {
    color: colors.primary.DEFAULT,
  };

  return (
    <div className="max-w-[1000px] px-5 py-14 md:pb-36 md:pt-32 lg:px-0">
      <SuperTitle className="mb-2 md:mb-3" style={superTitleStyle}>
        {SUPER_TITLE}
      </SuperTitle>
      <DetailHeading2>{HEADING}</DetailHeading2>
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
    </div>
  );
};

export default ResearchTeamSection;
