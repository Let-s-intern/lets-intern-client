'use client';

import AboutHeaderSection from '@/domain/about/section/AboutHeaderSection';
import CommunitySection from '@/domain/about/section/CommunitySection';
import ContactSection from '@/domain/about/section/ContactSection';
import EndSection from '@/domain/about/section/EndSection';
import IntroSection from '@/domain/about/section/IntroSection';
import PartnerSection from '@/domain/about/section/PartnerSection';
import ProblemSection from '@/domain/about/section/ProblemSection';
import ProgramMenuSection from '@/domain/about/section/ProgramMenuSection';
import ResultSection from '@/domain/about/section/ResultSection';
import ReviewSection from '@/domain/about/section/ReviewSection';
import SolutionSection from '@/domain/about/section/SolutionSection';

const About = () => {
  return (
    <div>
      <AboutHeaderSection />
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
