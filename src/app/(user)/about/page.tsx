'use client';

import AboutHeader from '@/domain/about/v1/header/AboutHeader';
import ResultSection from '@/domain/about/v1/ResultSection';
import CommunitySection from '@/domain/about/v1/section/CommunitySection';
import ContactSection from '@/domain/about/v1/section/ContactSection';
import EndSection from '@/domain/about/v1/section/EndSection';
import IntroSection from '@/domain/about/v1/section/introduction/IntroSection';
import PartnerSection from '@/domain/about/v1/section/PartnerSection';
import ProblemSection from '@/domain/about/v1/section/problem/ProblemSection';
import ProgramMenuSection from '@/domain/about/v1/section/program/ProgramMenuSection';
import ReviewSection from '@/domain/about/v1/section/ReviewSection';
import SolutionSection from '@/domain/about/v1/section/solution/SolutionSection';

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
