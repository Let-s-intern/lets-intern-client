'use client';

import AboutHeader from '../../../common/about/header/AboutHeader';
import ResultSection from '../../../common/about/ResultSection';
import CommunitySection from '../../../common/about/section/CommunitySection';
import ContactSection from '../../../common/about/section/ContactSection';
import EndSection from '../../../common/about/section/EndSection';
import IntroSection from '../../../common/about/section/introduction/IntroSection';
import PartnerSection from '../../../common/about/section/PartnerSection';
import ProblemSection from '../../../common/about/section/problem/ProblemSection';
import ProgramMenuSection from '../../../common/about/section/program/ProgramMenuSection';
import ReviewSection from '../../../common/about/section/ReviewSection';
import SolutionSection from '../../../common/about/section/solution/SolutionSection';

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
