'use client';

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
  return (
    <div>
      <AboutHeader />
      <main>
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
      </main>
    </div>
  );
};

export default About;
