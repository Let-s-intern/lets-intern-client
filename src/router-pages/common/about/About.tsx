import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import AboutHeader from '../../../components/common/about/header/AboutHeader';
import ResultSection from '../../../components/common/about/ResultSection';
import CommunitySection from '../../../components/common/about/section/CommunitySection';
import ContactSection from '../../../components/common/about/section/ContactSection';
import EndSection from '../../../components/common/about/section/EndSection';
import IntroSection from '../../../components/common/about/section/introduction/IntroSection';
import PartnerSection from '../../../components/common/about/section/PartnerSection';
import ProblemSection from '../../../components/common/about/section/problem/ProblemSection';
import ProgramMenuSection from '../../../components/common/about/section/program/ProgramMenuSection';
import ReviewSection from '../../../components/common/about/section/ReviewSection';
import SolutionSection from '../../../components/common/about/section/solution/SolutionSection';

const About = () => {
  const location = useLocation();

  const title = `렛츠커리어 스토리`;
  const url = `${window.location.origin}/${location.pathname}`;
  const description =
    '커리어 성장, 이제 렛츠커리어가 취업준비생과 주니어의 길라잡이가 되겠습니다.';

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <AboutHeader />
      <div>
        <ProblemSection />
        <SolutionSection />
        <IntroSection />
        <ProgramMenuSection />
        <CommunitySection />
        <ResultSection />
        <ReviewSection />
        <PartnerSection />
        <EndSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default About;
