'use client';

import AboutHeader from '@/domain/about/header/AboutHeader';
import ResultSection from '@/domain/about/ResultSection';
import CommunitySection from '@/domain/about/section/CommunitySection';
import ContactSection from '@/domain/about/section/ContactSection';
import EndSection from '@/domain/about/section/EndSection';
import IntroSection from '@/domain/about/section/introduction/IntroSection';
import PartnerSection from '@/domain/about/section/PartnerSection';
import ProblemSection from '@/domain/about/section/problem/ProblemSection';
import ProgramMenuSection from '@/domain/about/section/program/ProgramMenuSection';
import ReviewSection from '@/domain/about/section/ReviewSection';
import SolutionSection from '@/domain/about/section/solution/SolutionSection';

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
